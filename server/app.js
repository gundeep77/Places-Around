import { ApolloServer, gql } from "apollo-server";
import axios from "axios";
import { v4 } from "uuid";
import redis from "redis";
import dotenv from "dotenv";

const redisClient = redis.createClient();
redisClient.connect().then(() => {});
dotenv.config();
const apiKey = process.env.API_KEY;

const typeDefs = gql`
  type Query {
    locationPosts(pageNum: Int): [Location]
    likedLocations: [Location]
    userPostedLocations: [Location]
  }

  type Location {
    id: String!
    image: String!
    name: String!
    address: String!
    userPosted: Boolean!
    liked: Boolean!
  }

  type Mutation {
    uploadLocation(image: String!, address: String, name: String): Location
    updateLocation(
      id: String!
      image: String
      name: String
      address: String
      userPosted: Boolean
      liked: Boolean
    ): Location
    deleteLocation(id: String!): Location
  }
`;
const resolvers = {
  Query: {
    locationPosts: async (_, args) => {
      const { data } = await axios.get(
        `https://api.foursquare.com/v3/places/search?pageNum=${
          args.pageNum
        }&limit=${args.pageNum * 8}`,
        {
          headers: {
            Authorization: apiKey,
          },
        }
      );

      const allLocationPosts =
        data.results &&
        data.results.map(async (locationPost) => {
          let id = locationPost.fsq_id;
          let imageSize = "300x200";
          let userPosted = false;
          const existsInLikedLocations = redisClient.hExists("likedLocations", id);
          let liked;
          liked = true ? existsInLikedLocations : false

          const imagesArray = await axios.get(
            `https://api.foursquare.com/v3/places/${id}/photos`,
            {
              headers: {
                Authorization:
                  apiKey,
              },
            }
          );

          const imageUrls = imagesArray.data.map((imageObj) => {
            return imageObj.prefix + imageSize + imageObj.suffix;
          });

          return {
            id: id,
            image: imageUrls[0] || "",
            name: locationPost.name,
            address: locationPost.location.formatted_address || "No address available!",
            userPosted: userPosted,
            liked: liked,
          };
        });
      return allLocationPosts;
    },
    likedLocations: async () => {
      const allLocationsRedis = await redisClient.hVals("likedLocations");
      const allLocations = allLocationsRedis.map((location) =>
        JSON.parse(location)
      );
      const likedLocations = allLocations.filter(
        (location) => location.liked === true
      );
      return likedLocations;
    },
    userPostedLocations: async () => {
      const allLocationsRedis = await redisClient.hVals("uploadedLocations");
      const allLocations = allLocationsRedis.map((location) =>
        JSON.parse(location)
      );
      return allLocations;
    },
  },
  Mutation: {
    uploadLocation: async (_, args) => {
      try {
        const id = v4();
        const newLocation = {
          id: id,
          image: args.image,
          name: args.name,
          address: args.address,
          userPosted: true,
          liked: false,
        };
        await redisClient.hSet(
          "uploadedLocations",
          id,
          JSON.stringify(newLocation)
        );
        return newLocation;
      } catch (error) {
        return error;
      }
    },
    updateLocation: async (_, args) => {
      try {
        const likedLocation = await redisClient.hExists(
          "likedLocations",
          args.id
        );
        if (likedLocation) {
          const updatedLocation = {
            id: args.id,
            image: args.image,
            name: args.name,
            address: args.address,
            userPosted: args.userPosted,
            liked: false,
          };
          await redisClient.hDel("likedLocations", args.id);
          // await redisClient.lRem("likedLocationsList", 0, args.id);
          if (args.userPosted) {
            await redisClient.hSet(
              "uploadedLocations",
              args.id,
              JSON.stringify(updatedLocation)
            );
          }
          return updatedLocation;
        } else {
          const updatedLocation = {
            id: args.id,
            image: args.image,
            name: args.name,
            address: args.address,
            userPosted: args.userPosted,
            liked: true,
          };
          await redisClient.hSet(
            "likedLocations",
            args.id,
            JSON.stringify(updatedLocation)
          );
          // await redisClient.lPush("likedLocationsList", args.id);
          if (args.userPosted) {
            await redisClient.hSet(
              "uploadedLocations",
              args.id,
              JSON.stringify(updatedLocation)
            );
          }
          return updatedLocation;
        }
      } catch (e) {
        return e;
      }
    },
    deleteLocation: async (_, args) => {
      try {
        const toBeDeleted = await redisClient.hVals("uploadedLocations");
        const deletedLocationPosts = toBeDeleted.filter(
          (location) => JSON.parse(location).id === args.id
        );
        const parsed = JSON.parse(deletedLocationPosts[0]);
        await redisClient.hDel("likedLocations", parsed.id);
        await redisClient.hDel("uploadedLocations", parsed.id);
        return parsed;
      } catch (error) {
        return error;
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server running on ${url}`);
});
