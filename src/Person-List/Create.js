import React, { useState } from "react";
import { Form, Input, Radio, DatePicker, Button } from "antd";
import { useMutation, gql } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import MovieList, { LIST_PERSONS } from "./Movie-list";

const CREATE_PERSON_MUTATION = gql`
  mutation createPersonMutation($data: PersonInput!) {
    createPerson(data: $data) {
      data {
        name
        gender
        biography
        adult
      }
    }
  }
`;

export const PERSON_QUERY = gql`
  query person($id: ID!) {
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

export const UPDATED_PERSON_MUTATION = gql`
  mutation UpdatePerson($id: ID!, $data: UpdatePersonInput!) {
    updatePerson(id: $id, data: $data) {
      message
      data {
        name
        gender
        biography
        adult
      }
    }
  }
`;

const CreatePerson = ({ initialValues, person_id, edit }) => {
  const navigate = useNavigate();
  const [personData, setPersonData] = useState(null);
  const male = "MALE";
  const female = "FEMALE";
  const others = "OTHERS";

  const [createdPerson, { loading, error }] = useMutation(
    CREATE_PERSON_MUTATION,
    {
      onCompleted: () => navigate("/person-list"),
      // refetchQueries: [
      //   {
      //     query: LIST_PERSONS,
      //     variables: {
      //       skip: 0,
      //       limit: 10,
      //       searchTerm: "",
      //       category: "",
      //     },
      //   },
      // ],
      fetchPolicy: "network-only",
    }
  );

  const [updatePerson] = useMutation(UPDATED_PERSON_MUTATION, {
    onCompleted: () => navigate("/person-list"),
    refetchQueries: [
      {
        query: LIST_PERSONS,
        variables: {
          skip: 0,
          limit: 10,
          searchTerm: "",
          category: "TRENDING",
          field: "createdAt",
          order: "DESC",
        },
      },
    ],
    fetchPolicy: "network-only",
  });

  const onFinish = (values) => {
    const personData = {
      name: values.name,
      gender: values.gender,
      biography: values.biography,
      adult: values.adult,
    };
    const formValues = person_id ? { ...values, id: person_id } : { ...values };

    if (formValues.id) {
      updatePerson({
        variables: {
          id: formValues.id,
          data: personData,
        },
      })
        .then((result) => {
          loading(false);
          setPersonData(result.data.updatePerson.data.person);
        })
        .catch((err) => {
          loading(false);
          error(err.message);
        });
    } else {
      createdPerson({
        variables: {
          data: personData,
        },
      })
        .then((result) => {
          loading(false);
          setPersonData(result.data.CreatePerson.data.person);
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
    <div>
      <h2 style={{ marginLeft: '43%'}}>{edit ? "Update Person" : "Create Person"}</h2>
      <div className="create">
        <Form
          initialValues={initialValues}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input the field",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[
              {
                required: true,
                defaultField: "female",
                message: "Please input the field",
              },
            ]}
          >
            <Radio.Group>
              <Radio value={female}> FEMALE </Radio>
              <Radio value={male}> MALE </Radio>
              <Radio value={others}>OTHERS</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Biography"
            name="biography"
            rules={[
              {
                required: true,
                message: "Please input the field",
              },
            ]}
          >
            <Input />
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

      {personData && (
        <MovieList
          name={personData.name}
          gender={personData.gender}
          biography={personData.biography}
          adult={personData.adult}
        />
      )}
      {personData && <MovieList person={personData} />}
    </div>
  );
};

export default CreatePerson;
