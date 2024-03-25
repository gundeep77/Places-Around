import React from "react";
import { useMutation } from "@apollo/client";
import queries from "../queries.js";
import "../App.css";

const LikeUnlike = (props) => {
  const [updateLocation] = useMutation(queries.UPDATE_LOCATION);

  const likeUnlikeButton = (location) => {
    if (location.liked === false) {
      return (
        <button
          className="locationLink"
          onClick={(e) => {
            e.preventDefault();
            updateLocation({
              variables: {
                id: location.id,
                image: location.image,
                name: location.name,
                address: location.address,
                userPosted: location.userPosted,
                liked: !location.liked,
              },
              refetchQueries: [{ query: queries.GET_LIKED_LOCATIONS }],
            });
          }}
        >
          Like
        </button>
      );
    } else if (location.liked === true) {
      return (
        <button
          style={{ backgroundColor: "grey" }}
          className="locationLink"
          onClick={(e) => {
            e.preventDefault();
            updateLocation({
              variables: {
                id: location.id,
                image: location.image,
                name: location.name,
                address: location.address,
                userPosted: location.userPosted,
                liked: !location.liked,
              },
              refetchQueries: [{ query: queries.GET_LIKED_LOCATIONS }],
            });
          }}
        >
          Unlike
        </button>
      );
    }
  };
  return likeUnlikeButton(props.location);
};

export default LikeUnlike;
