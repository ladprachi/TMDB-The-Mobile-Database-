import React, { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { Card, Input, Button, Select, Modal, Carousel } from "antd";
import { useLazyQuery, gql, useMutation } from "@apollo/client";
import { Link, useParams } from "react-router-dom";

export const LIST_MOVIES = gql`
  query listMovies(
    $skip: Int
    $limit: Int
    $category: MoviesCategory
    $searchTerm: String
    $order: SortOrder
    $field: ListMoviesSortFields
  ) {
    listMovies(
      filter: {
        skip: $skip
        limit: $limit
        category: $category
        searchTerm: $searchTerm
      }
      sort: { field: $field, order: $order }
    ) {
      message
      count
      data {
        id
        title
        streamingOn
        popularity
        status
        budget
        runtime
        __typename
      }
    }
  }
`;

const DELETE_MOVIE = gql`
  mutation deleteMovieMutation($id: ID!) {
    deleteMovie(id: $id) {
      message
      data {
        movie {
          title
        }
        companies
        collections
      }
    }
  }
`;

const Moviecard = ({
  skip = 0,
  limit = 10,
  searchTerm = "",
  category = "POPULAR",
  field = "createdAt",
  order = "DESC",
}) => {
  const [datasource, setDatasource] = useState();
  const [executeSearchQuery, { loading, error, data }] = useLazyQuery(
    LIST_MOVIES,
    {
      onCompleted: (data) => {
        setDatasource(data?.listMovies?.data);
      },
      fetchPolicy: "network-only",
    }
  );

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error :</p>;

  // search
  const { Search } = Input;

  const [currentPage, setCurrentPage] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [categoryValue, setcategory] = useState("POPULAR");
  const [sortFieldValue, setSortField] = useState("createdAt");
  const [sortOrderValue, setSortOrder] = useState("DESC");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [deleteMovie] = useMutation(DELETE_MOVIE, {
    onCompleted() {
      setDeleteModalVisible(false);
      setSelectedMovie(null);
    },
    refetchQueries: [
      {
        query: LIST_MOVIES,
        variables: {
          skip: 0,
          limit: 10,
          searchTerm: "",
          category: "POPULAR",
          field: "createdAt",
          order: "DESC",
        },
      },
    ],
  });

  const handleDelete = (movie) => {
    setSelectedMovie(movie);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = (movie) => {
    deleteMovie({ variables: { id: selectedMovie.id } });
  };

  useEffect(() => {
    executeSearchQuery({
      variables: {
        skip: 0,
        limit: 10,
        category: categoryValue,
        searchTerm: searchValue,
        field: sortFieldValue,
        order: sortOrderValue,
      },
    });
  }, []);

  const searchValueHandle = debounce((e) => {
    setSearchValue(e.target.value);
    executeSearchQuery({
      variables: {
        skip: 0,
        limit: 10,
        order: sortOrderValue === "asc" ? "ASC" : "DESC",
        field: sortFieldValue ? sortFieldValue : "default",
        category: categoryValue,
        searchTerm: e.target.value,
      },
    });
  }, 500);

  const handleSortOrder = (value) => {
    setSortOrder(value);
    executeSearchQuery({
      variables: {
        skip: 0,
        limit: 10,
        order: value,
        field: sortFieldValue,
        category: categoryValue,
        searchTerm: searchValue,
      },
    });
  };

  const handleSortField = (value) => {
    setSortField(value);
    executeSearchQuery({
      variables: {
        skip: 0,
        limit: 10,
        field: value,
        order: sortOrderValue,
        category: categoryValue,
      },
    });
  };

  const handleSortCategory = (value) => {
    setcategory(value);
    executeSearchQuery({
      variables: {
        skip: 0,
        limit: 10,
        category: value,
        order: sortOrderValue,
        field: sortFieldValue,
      },
    });
  };

  // filter and sort
  const options = [
    { value: "LATEST", label: "LATEST" },
    { value: "PLAYING_IN_THEATERS", label: "PLAYING_IN_THEATERS" },
    { value: "POPULAR", label: "POPULAR" },
    { value: "TOP_RATED", label: "TOP_RATED" },
    { value: "UPCOMING", label: "UPCOMING" },
  ];

  const options1 = [
    { value: "createdAt", label: "createdAt" },
    { value: "updatedAt", label: "updatedAt" },
    { value: "releaseDate", label: "releaseDate" },
    { value: "popularity", label: "popularity" },
    { value: "voteAverage", label: "voteAverage" },
  ];

  const options2 = [
    { value: "ASC", label: "ASC" },
    { value: "DESC", label: "DESC" },
  ];

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
        Movie-Card
      </span>
      <br />

      <Select
        // size={size}
        placeholder="Filter"
        onChange={(e) => handleSortCategory(e)}
        style={{
          width: 120,
          left: "36%",
          padding: "5px",
        }}
        options={options}
      />

      <Select
        // size={size}
        placeholder="Field"
        onChange={(e) => handleSortField(e)}
        style={{
          width: 120,
          left: "37%",
        }}
        options={options1}
      />

      <Select
        // size={size}
        placeholder="Order"
        onChange={(e) => handleSortOrder(e)}
        style={{
          width: 120,
          left: "38%",
        }}
        options={options2}
      />

      <Button
        style={{
          left: "48%",
        }}
      >
        <Link to="/movie-card/form">ADD MOVIE</Link>
      </Button>

      <Search
        placeholder="input search text"
        // onSearch={() => executeSearchQuery({
        //   variables: { filter: searchValue}
        // })}
        onChange={(e) => searchValueHandle(e)}
        //defaultValue={searchValue}
        size="large"
        style={{
          width: 1000,
          marginRight: "8%",
          marginLeft: "8%",
        }}
      />

      {data && (
        <>
          {datasource.map((movie) => (
            <Card
              key={movie.id}
              card={movie}
              title={movie.title}
              bordered={false}
              style={{ width: 300 }}
              className="movie-card"
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
              <p>{movie.status}</p>
              <p>{movie.streamingOn}</p>
              <p>{movie.budget}</p>

              <Button type="link">
                <Link to={`/movie-card/${movie.id}/view`}>
                  {movie.title["title-U"]}View
                </Link>
              </Button>

              <Button type="link">
                <Link to={`/movie-card/${movie.id}/edit`}>
                  {movie.title["title-U"]}Edit
                </Link>
              </Button>

              <Button type="link" onClick={() => handleDelete(movie)}>
                Delete
              </Button>
            </Card>
          ))}
          {selectedMovie && (
            <Modal
              title="Confirm Delete"
              visible={deleteModalVisible}
              onCancel={() => setDeleteModalVisible(false)}
              onOk={() => handleConfirmDelete(false)}
            >
              <p>Are you sure "{selectedMovie.title}" to delete?</p>
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default Moviecard;
