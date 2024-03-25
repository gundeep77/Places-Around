import React from "react";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import MyLikes from "./components/MyLikes";
import MyLocations from "./components/MyLocations";
import NewLocation from "./components/NewLocation";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:4000",
  }),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>
            Places Around
          </h1>
          <Link className='locationLink' to='/my-likes'>
            My Likes
          </Link>
          <Link className='locationLink' to='/'>
            Home
          </Link>
          <Link className='locationLink' to='/my-locations'>
            My Locations
          </Link>
          <Link className='locationLink' to='/new-location'>
            Post a Location
          </Link>
        </header>
        <br />
        <br />
        <div className='App-body'>
          <Routes>
          <Route path="/" element={<Home />} />
            <Route path={`/my-likes`} element={<MyLikes />} />
            <Route path={`/my-locations`} element={<MyLocations />} />
            <Route path={`/new-location`} element={<NewLocation />} />
          </Routes>
        </div>
      </div>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
