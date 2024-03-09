import React, { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import { Table, Button, Input, Modal } from "antd";
import { Link, useParams } from "react-router-dom";

export const LIST_PERSONS = gql`
  query listPersons(
    $skip: Int
    $limit: Int
    $category: PersonCategory
    $searchTerm: String
    $order: SortOrder
    $field: ListPersonsSortFields
  ) {
    listPersons(
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
        name
        gender
        popularity
        adult
      }
    }
  }
`;

const DELETE_PERSONS = gql`
  mutation deletePersonMutation($id: ID!) {
    deletePerson(id: $id) {
      message
      __typename
    }
  }
`;

const MovieList = ({
  skip = 0,
  searchTerm = "",
  category = "TRENDING",
  field = "createdAt",
  order = "DESC",
}) => {
  const { Search } = Input;
  const [searchValue, setSearchValue] = useState("");
  const [persons, setPersons] = useState([]);
  const [currentPage, setCurrentPage] = useState();
  const limit = 10;
  const [getPersons, { loading, error, data, refetch }] = useLazyQuery(
    LIST_PERSONS,
    {
      onCompleted: (data) => {
        setPersons(data?.listPersons?.data);
      },
      fetchPolicy: "network-only",
    }
  );

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [deletePerson] = useMutation(DELETE_PERSONS, {
    onCompleted() {
      setDeleteModalVisible(false);
      setSelectedPerson(null);
    },
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
  });

  const handleDelete = (person) => {
    setSelectedPerson(person);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    deletePerson({ variables: { id: selectedPerson.id } });
  };

  useEffect(() => {
    getPersons({
      variables: {
        skip: 0,
        limit: 10,
        category: "TRENDING",
        searchTerm: searchValue,
        field: "createdAt",
        order: "DESC",
      },
    });
  }, []);

  const searchValueHandle = debounce((e) => {
    setSearchValue(e.target.value);
    console.log("search", e.target.value);
    getPersons({
      variables: {
        skip: 0,
        limit: 10,
        searchTerm: e.target.value,
      },
    });
  }, 500);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Popularity",
      dataIndex: "popularity",
      key: "popularity",
    },

    {
      title: "",
      dataIndex: "",
      key: "",
      render: (record) => (
        <>
          <Button type="link">
            <Link to={`/person-list/${record.id}/view`}>
              {record.name["title-U"]}View
            </Link>
          </Button>

          <Button type="link">
            <Link to={`/person-list/${record.id}/edit`}>
              {record.name["title-U"]}Edit
            </Link>
          </Button>

          <Button type="link" onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

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
        Person-List
      </span>
      <br />
      <Search
        placeholder="input search text"
        // onSearch={() => executeSearchQuery({
        //   variables: { filter: searchValue}
        // })}
        onChange={(e) => searchValueHandle(e)}
        //defaultValue={searchValue}
        size="large"
        style={{
          width: 500,
          marginLeft: "70px",
          padding: "10px",
        }}
      />

      <Button
        type="default"
        style={{
          width: 250,
          left: "20%",
          bottom: "-13px",
        }}
      >
        <Link to="/person-list/create">ADD PERSONS</Link>
      </Button>

      <Table
        className="person-list"
        columns={columns}
        dataSource={data?.listPersons?.data}
        loading={loading}
        rowKey={(record) => record.id}
        onChange={(page) => {
          setCurrentPage(page.current);
          refetch({
            skip: (page.current - 1) * limit,
            limit,
            category: "TRENDING",
            searchTerm: "",
            field: "createdAt",
            order: "DESC",
          });
        }}
        pagination={{
          pageSize: limit,
          current: currentPage,
          total: data?.listPersons?.count,
          className: "page",
        }}
      />
      {selectedPerson && (
        <Modal
          title="Confirm Delete"
          visible={deleteModalVisible}
          onCancel={() => setDeleteModalVisible(false)}
          onOk={handleConfirmDelete}
        >
          <p>Are you sure "{selectedPerson.name}" to delete?</p>
        </Modal>
      )}
    </div>
  );
};

export default MovieList;
