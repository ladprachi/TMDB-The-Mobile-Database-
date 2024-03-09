import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation, gql } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import MovieForm,{ MOVIE_QUERY,UPDATED_MOVIE_MUTATION} from "./Form";
import moment from "moment";


const Edit = () => {
  const { movie_id } = useParams();
  const [movieLoading, setMovieLoading] = useState(true);
  const [movieData, setMovieData] = useState(null);


  const [fetchMovie] = useLazyQuery(MOVIE_QUERY, {
    fetchPolicy: "network-only",
    onCompleted: (res) => {   
      // setMovieData(res?.movie?.data);
  
      setMovieData({
        title: res.movie.data.title,
        overview: res.movie.data.overview,
        releasedate: moment(res.movie.data.releaseDate),
        budget: res.movie.data.budget.toString(),
        revenue: res.movie.data.revenue.toString(),
        runtime: res.movie.data.runtime.toString(),
        adult: res.movie.data.adult,
        status: res.movie.data.status,
        tagline: res.movie.data.tagline,
        originallanguage: res.movie.data.originalLanguage,
        originaltitle:  res.movie.data.originalTitle,
      })
      setMovieLoading(false);
    },
    onError: () => {},
  });
  

  
  const [updateMovie] = useMutation(UPDATED_MOVIE_MUTATION, {
    onError: () => { 
    },
  });

  useEffect(() => {
    if (movie_id) {
      fetchMovie({
        fetchPolicy:'network-only',
        variables: { id: movie_id },
      });
    }
  }, [movie_id]);

  if (movieLoading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;


  return (
    <>
    {/* <span>Edit Movie</span> */}
      <MovieForm
       initialValues ={movieData}
        mutation={updateMovie}
        edit={true}
        dataLoading={movieLoading}
        setMovieLoading={setMovieLoading}
        movie_id={movie_id}
      />
    </>
  );
};

export default Edit;
