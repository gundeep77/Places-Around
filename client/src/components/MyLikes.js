import { useQuery } from "@apollo/client";
import React from "react";
import queries from "../queries.js";
import noImage from "../images/noImage.jpg";
import LikeUnlike from "./LikeUnlike.js";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";

const MyLikes = () => {
  let card = null;
  const { loading, error, data } = useQuery(queries.GET_LIKED_LOCATIONS, {
    fetchPolicy: "cache-and-network",
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
            </CardContent>
        </Card>
      </Grid>
    );
  };

  card = data.likedLocations.length
    ? data.likedLocations.map((location) => {
        return buildCard(location);
      })
    : <div className="noData"><h3>No locations liked!</h3></div>;

  return (
    <div>
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

export default MyLikes;
