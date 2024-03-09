import React from "react";
import { Card, Carousel } from "antd";
import { useQuery, gql } from "@apollo/client";

const TOP_RATED = gql`
  query topRatedMovies {
    listMovies(
      filter: { category: TOP_RATED, limit: 5 }
      sort: { field: popularity, order: ASC }
    ) {
      message
      count
      data {
        title
        id
        releaseDate
        streamingOn
        budget
        status
        originalLanguage
      }
    }
  }
`;

const Homepage = () => {
  const { data } = useQuery(TOP_RATED);

  const contentStyle = {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  return (
    <div style={{ background: "black" }}>
      {data && (
        <>
          <span
            style={{
              color: "white",
              marginLeft: "45%",
              fontSize: "25px",
              // fontWeight: "10%"
            }}
          >
            Top 5 Rated Movies
          </span>
          <br/>
          {data.listMovies.data.map((card) => (
            <Card
              key={card.id}
              card={card}
              title={card.title}
              bordered={false}
              style={{ width: 300 }}
              className="home-card"
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
              <p>{card.originalLanguage}</p>
              <p>{card.streamingOn}</p>
              <p>{card.status}</p>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default Homepage;
