import { useMutation } from "@apollo/client";
import React from "react";
import queries from "../queries.js";
import "../App.css";

const NewLocation = () => {
  const [uploadLocation] = useMutation(queries.UPLOAD_LOCATION);

  let image;
  let name;
  let address;

  return (
    <div className="cardImageForm">
      <h1>Post a location:</h1>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          uploadLocation({
            variables: {
              image: image.value,
              name: name.value,
              address: address.value,
            },
          });
          image.value = "";
          name.value = "";
          address.value = "";
          
          document.getElementById("successful").hidden = false;
          setTimeout(()=> {
            document.getElementById("successful").hidden = true;
          }, 1500)
        }}
      >
        <label>
          Location Name:
          <br />
          <input ref={(node) => (name = node)} required />
        </label>

        <br />
        <br />

        <label>
          Location Address:
          <br />
          <input ref={(node) => (address = node)} required />
        </label>

        <br />
        <br />

        <label>
          Image URL:
          <br />
          <input ref={(node) => (image = node)} required />
        </label>

        <br />
        <br />

        <button className="locationLink" type="submit">
          Submit
        </button>
        <h3 hidden id="successful">
          Location successfully posted!
        </h3>
      </form>
    </div>
  );
};

export default NewLocation;
