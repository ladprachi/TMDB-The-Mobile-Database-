import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, InputNumber, Radio, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useLazyQuery, gql } from "@apollo/client";
import Moviecard, { LIST_MOVIES } from "./Movie-card";
import moment from "moment";

const CREATE_MOVIE_MUTATION = gql`
  mutation createMovieMutation($data: MovieInput) {
    createMovie(data: $data) {
      data {
        movie {
          title
          id
          adult
          overview
          releaseDate
          budget
          revenue
          runtime
          adult
          status
          tagline
          originalLanguage
          originalTitle
        }
      }
    }
  }
`;

export const MOVIE_QUERY = gql`
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

export const UPDATED_MOVIE_MUTATION = gql`
  mutation UpdateMovie($id: ID!, $data: UpdateMovieInput) {
    updateMovie(id: $id, data: $data) {
      message
      data {
        movie {
          title
          adult
          overview
          releaseDate
          budget
          revenue
          runtime
          status
          tagline
          originalLanguage
          originalTitle
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

const MovieForm = ({ initialValues, movie_id, edit }) => {
  const navigate = useNavigate();
  const { movies_id } = useParams();
  // const [initialValues, setinitialValue] = useState();
  const [movieLoading, setMovieLoading] = useState(true);
  const [movieData, setMovieData] = useState(null);
  const [formValues, setFormValues] = useState(
    movieData
      ? {
          ...movieData,
          releaseDate: movieData?.releaseDate
            ? moment(movieData?.releaseDate)
            : null,
        }
      : {}
  );

  const [createdMovie, { loading, error }] = useMutation(
    CREATE_MOVIE_MUTATION,
    {
      onCompleted: () => navigate("/form/movie-card"),
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
      fetchPolicy: "network-only",
    }
  );

  const [updateMovie] = useMutation(UPDATED_MOVIE_MUTATION, {
    onCompleted: () => navigate("/edit/movie-card"),
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
    fetchPolicy: "network-only",
  }
);
    

  const onFinish = (values) => {
    const movieData = {
      title: values.title,
      overview: values.overview,
      releaseDate: values.releasedate,
      budget: Number(values.budget),
      revenue: Number(values.revenue),
      runtime: Number(values.runtime),
      adult: values.adult,
      status: values.status,
      tagline: values.tagline,
      originalLanguage: values.originallanguage,
      originalTitle: values.originaltitle,
    };
    const formValues = movie_id ? { ...values, id: movie_id } : { ...values };

    if (formValues.id) {
      updateMovie({
        variables: {
          id: formValues.id,
          data: movieData,
        },
      })
        .then((result) => {
          loading(false);
          setMovieData(result.data.updateMovie.data.movie);
        })
        .catch((err) => {
          loading(false);
          error(err.message);
        });
    } else {
      createdMovie({
        variables: {
          data: movieData,
        },
      })
        .then((result) => {
          loading(false);
          setMovieData(result.data.createMovie.data.movie);
        })
        .catch((err) => {
          loading(false);
          error(err.message);
        });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
        {edit ? "Update Movie" : "Create Movies"}
      </span>{" "}
      <br />
      <div className="form">
        <Form
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Please input your field",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Overview"
            name="overview"
            rules={[
              {
                required: true,
                message: "Please input your field",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Releasedate"
            name="releasedate"
            rules={[
              {
                required: true,
                message: "Please input your field",
              },
            ]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="Budget"
            name="budget"
            rules={[
              {
                required: true,
                message: "Please input your field",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="Revenue"
            name="revenue"
            rules={[
              {
                required: true,
                message: "Please input your field",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="Runtime"
            name="runtime"
            rules={[
              {
                required: true,
                message: "Please input your field",
              },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="Adult"
            name="adult"
            rules={[
              {
                required: true,
                message: "Please input your field",
              },
            ]}
          >
            <Radio.Group>
              <Radio value={true}> True </Radio>
              <Radio value={false}> False </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[
              {
                required: true,
                message: "Please input your field",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tagline"
            name="tagline"
            rules={[
              {
                required: true,
                message: "Please input your field",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="OriginalLanguage"
            name="originallanguage"
            rules={[
              {
                required: true,
                message: "Please input your field",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="OriginalTitle"
            name="originaltitle"
            rules={[
              {
                required: true,
                message: "Please input your field",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                left: "40%",
              }}
            >
              {edit ? "Update" : "Create"}
            </Button>
          </Form.Item>

  
        </Form>
      </div>
      {movieData && (
        <Moviecard
          title={movieData.title}
          overview={movieData.overview}
          releaseDate={movieData.releaseDate}
          budget={movieData.budget}
          revenue={movieData.revenue}
          runtime={movieData.runtime}
          adult={movieData.adult}
          status={movieData.status}
          tagline={movieData.tagline}
          originalLanguage={movieData.originalLanguage}
          originalTitle={movieData.originalTitle}
        />
      )}
      {movieData && <Moviecard movie={movieData} />}
    </div>
  );
};

export default MovieForm;
