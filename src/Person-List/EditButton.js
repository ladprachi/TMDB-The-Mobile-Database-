import React, {useState, useEffect}from "react";
import { useParams } from "react-router-dom";
import { useLazyQuery, useMutation, gql } from "@apollo/client";
import CreatePerson,{PERSON_QUERY,UPDATED_PERSON_MUTATION } from "./Create";


const EditButton =() => {
    const { person_id } = useParams();
    const [personLoading, setPersonLoading] = useState(true);
    const [personData, setPersonData] = useState(null);


    const [fetchPerson] = useLazyQuery(PERSON_QUERY, {
        fetchPolicy: "network-only",
        onCompleted: (res) => {   
          setPersonData({
            name: res.person.data.name,
            gender: res.person.data.gender,
            biography: res.person.data.biography,
            adult: res.person.data.adult,
          })
          setPersonLoading(false);
        },
        onError: () => {},
      });


      const [updatePerson] = useMutation(UPDATED_PERSON_MUTATION, {
        onError: () => { 
        },
      });

      useEffect(() => {
        if (person_id) {
          fetchPerson({
            fetchPolicy:'network-only',
            variables: { id: person_id },
          });
        }
      }, [person_id]);
    
      if (personLoading) return <p>Loading...</p>;
  

    return(
    <>
    <CreatePerson  
         initialValues ={personData}
         mutation={updatePerson}
         edit={true}
         dataLoading={setPersonLoading}
         setMovieLoading={setPersonLoading}
         person_id={person_id}
    />
    </>
    );
};

export default EditButton;