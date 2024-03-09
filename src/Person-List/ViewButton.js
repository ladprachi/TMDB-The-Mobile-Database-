import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { Carousel } from "antd";

const PERSON_QUERY = gql`
  query Person($id: ID!) {
    person(id: $id) {
      message
      data {
        id
        name
        gender
        biography
        adult
      }
    }
  }
`;

const ViewButton = () => {
  const { person_id } = useParams();
  const { loading, error, data } = useQuery(PERSON_QUERY, {
    variables: { id: person_id },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { id, name, gender, biography, adult } = data.person.data;

  console.log(person_id);

  const contentStyle = {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  return (
    <div style={{ height: "130%" }}>
      <span
        style={{
          color: "black",
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
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOZDXIMcKgVVJu7CyqaiGnzVqpmWG24iEyrA&usqp=CAU"
              alt="Image 1"
              style={contentStyle}
            />
          </div>
        </Carousel>
        <p>Id:{person_id}</p>
        <p>Name: {name}</p>
        <p>Gender:{gender}</p>
        <p>Biography: {biography}</p>
        <p>Adult: {adult}</p>
      </div>
    </div>
  );
};

export default ViewButton;
