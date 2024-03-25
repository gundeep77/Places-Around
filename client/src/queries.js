import { gql } from "@apollo/client";

const GET_LOCATION_POSTS = gql`
  query locationPosts($pageNum: Int!) {
    locationPosts(pageNum: $pageNum) {
      id
      image
      name
      address
      userPosted
      liked
    }
  }
`;

const GET_LIKED_LOCATIONS = gql`
  query likedLocations {
    likedLocations {
      id
      image
      name
      address
      userPosted
      liked
    }
  }
`;

const GET_USER_POSTED_LOCATIONS = gql`
  query userpostedLocations {
    userPostedLocations {
      id
      image
      name
      address
      userPosted
      liked
    }
  }
`;

const UPLOAD_LOCATION = gql`
  mutation uploadLocation($image: String!, $address: String, $name: String) {
    uploadLocation(image: $image, address: $address, name: $name) {
      id
      image
      name
      address
      userPosted
      liked
    }
  }
`;

const UPDATE_LOCATION = gql`
  mutation updateLocation(
    $id: String!
    $image: String
    $name: String
    $address: String
    $userPosted: Boolean
    $liked: Boolean
  ) {
    updateLocation(
      id: $id
      image: $image
      name: $name
      address: $address
      userPosted: $userPosted
      liked: $liked
    ) {
      id
      image
      name
      address
      userPosted
      liked
    }
  }
`;

const DELETE_LOCATION = gql`
  mutation deleteLocation($id: String!) {
    deleteLocation(id: $id) {
      id
      image
      name
      address
      userPosted
      liked
    }
  }
`;

const allFunctions = {
  GET_LOCATION_POSTS,
  GET_LIKED_LOCATIONS,
  GET_USER_POSTED_LOCATIONS,
  UPLOAD_LOCATION,
  UPDATE_LOCATION,
  DELETE_LOCATION,
};

export default allFunctions;
