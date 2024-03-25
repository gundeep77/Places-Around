import { useQuery, useMutation } from "@apollo/client";
import React from "react";
import queries from "../queries.js";
import noImage from "../images/noImage.jpg";
import "../App.css";
import LikeUnlike from "./LikeUnlike";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";

const MyLocations = () => {
  let card = null;
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(queries.GET_USER_POSTED_LOCATIONS, {
    fetchPolicy: "cache-and-network",
  });

  const [deleteLocation] = useMutation(queries.DELETE_LOCATION, {
    update(cache) {
      const { userPostedLocations } = cache.readQuery({
        query: queries.GET_USER_POSTED_LOCATIONS,
      });
      cache.writeQuery({
        query: queries.GET_USER_POSTED_LOCATIONS,
        data: {
          userPostedLocations: userPostedLocations.filter(
            (e) => e.id === data.userPostedLocations.id
          ),
        },
      });
    },
    refetchQueries: [{ query: queries.GET_USER_POSTED_LOCATIONS }],
  });

  if (loading) {
    return <h2>Loading...</h2>;
  } else if (error) {
    return <h2>{error.message}</h2>;
  }

  const buildCard = (location) => {
    return (
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={location.id}>
        <Card
          variant="outlined"
          sx={{
            maxWidth: 250,
            height: "auto",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 5,
            border: "1px solid #1e8678",
            boxShadow:
              "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
          }}
        >
            <CardMedia
              component="img"
              image={
                location.image && location.image ? location.image : noImage
              }
              title={location.name}
            />

            <CardContent>
              <Typography
                sx={{
                  borderBottom: "1px solid #1e8678",
                  fontWeight: "bold",
                }}
                gutterBottom
                variant="h6"
                component="h3"
              >
                {location.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {location.address}
              </Typography>
              <LikeUnlike location={location} />
              <button
                className="locationLink"
                onClick={() => {
                  deleteLocation({
                    variables: {
                      id: location.id,
                    },
                  });
                }}
              >
                Delete
              </button>
            </CardContent>
        </Card>
      </Grid>
    );
  };

  card = data.userPostedLocations.length ? (
    data.userPostedLocations.map((location) => {
      return buildCard(location);
    })
  ) : (
    <div className="noData"><h3>No locations posted!</h3></div>
  );

  return (
    <div>
      <button
        onClick={() => {
          navigate("/new-location");
        }}
        className="locationLink"
      >
        Post a Location
      </button>
      <Grid
        container
        spacing={2}
        sx={{
          flexGrow: 1,
          flexDirection: "row",
        }}
      >
        {card}
      </Grid>
    </div>
  );
};

export default MyLocations;
