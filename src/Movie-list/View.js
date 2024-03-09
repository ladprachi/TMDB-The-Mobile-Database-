import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { Carousel } from "antd";

const MOVIE_QUERY = gql`
  query Movie($id: ID!) {
    movie(id: $id) {
      message
      data {
        id
        title
        overview
        adult
        releaseDate
        originalTitle
        budget
        originalLanguage
        revenue
        status
        tagline
        createdAt
        runtime
        __typename
      }
    }
  }
`;

const View = () => {
  const { movie_id } = useParams();
  const { loading, error, data } = useQuery(MOVIE_QUERY, {
    variables: { id: movie_id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const {
    title,
    overview,
    adult,
    releaseDate,
    originalTitle,
    budget,
    originalLanguage,
    revenue,
    status,
    tagline,
    createdAt,
    runtime,
  } = data.movie.data;

  console.log(movie_id);

  const contentStyle = {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  return (
    <div style={{ background: "black" }}>
      <span
        style={{
          color: "white",
          marginLeft: "45%",
          fontSize: "25px",
          // fontWeight: "10%"
        }}
      >
        Details page:
      </span>
      <br />

      <div
        style={{
          border: "2px solid black",
          borderRadius: "7%",
          marginLeft: "25%",
          paddingLeft: "180px",
          paddingRight: "10px",
          marginRight: "25%",
          paddingTop: "20px",
          backgroundColor: "lightblue",
        }}
      >
        <Carousel effect="fade">
          <div>
            <img
              src="https://media.istockphoto.com/id/1271522601/photo/pop-corn-and-on-red-armchair-cinema.jpg?s=612x612&w=0&k=20&c=XwQxmfrHb-OwV5onPUW5ApB4RaGBK7poSIzZj4q_N_g="
              alt="Image 1"
              style={contentStyle}
            />
          </div>
        </Carousel>

        <p>Title:{title}</p>
        <p>Overview:{overview}</p>
        <p>Adult: {adult ? "Yes" : "No"}</p>
        <p>Release Date: {releaseDate}</p>
        <p>Original Title: {originalTitle}</p>
        <p>Budget: {budget}</p>
        <p>Original Language: {originalLanguage}</p>
        <p>Revenue: {revenue}</p>
        <p>Status: {status}</p>
        <p>Tagline: {tagline}</p>
        <p>Created At: {createdAt}</p>
        <p>Runtime: {runtime}</p>
      </div>
    </div>
  );
};

export default View;
