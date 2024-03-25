import { useQuery } from "@apollo/client";
import { useState } from "react";
import queries from "../queries.js";
import "../App.css";
import noImage from "../images/noImage.jpg";
import LikeUnlike from "./LikeUnlike.js";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";

const Home = () => {
  const [pageNum, setPageNum] = useState(1);
  const { loading, error, data } = useQuery(queries.GET_LOCATION_POSTS, {
    variables: { pageNum: pageNum },
  });

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
                gutterBottom="true"
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

  let card = null;

  card =
    data &&
    data.locationPosts.map((location) => {
      return buildCard(location);
    });

  if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <h2>{error.message}</h2>
      </div>
    );
  }
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

      <button
        className="locationLink"
        onClick={(e) => {
          e.preventDefault();
          setPageNum(pageNum + 1);
        }}
      >
        Get More
      </button>
    </div>
  );
};
export default Home;
