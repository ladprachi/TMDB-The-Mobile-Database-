import React from "react";
import { Input, Button, Form, Card, message } from "antd";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";


const SIGNUP_MUTATION = gql`
  mutation EmailPasswordSignUpMutation(
    $email: String!
    $password: String!
    $name: String!
  ) {
    emailPasswordSignUp(
      data: { email: $email, password: $password, name: $name }
    ) {
      message
    }
  }
`;

const SignUp = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [signupMutation, { loading }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      message.success(data.emailPasswordSignUp.message);
      navigate("/login");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const handleFormSubmit = ({ email, password, name }) =>
    signupMutation({ variables: { email, password, name } });

  return (
    <div style={{paddingTop: '3%'}}>
      <Card bordered={true}
       style={{
    border: "2px solid black",
    borderRadius: "5%",
    marginLeft:"20%",
    marginRight:"20%",
    paddingLeft:"10px",
    paddingRight:"20%",
    paddingTop:"20px",
    paddingBottom:"90px",
    backgroundColor:"lightgrey",
       }}>
        <Form form={form} onFinish={handleFormSubmit}>
          <h1 style={{ marginLeft: "60%"}}>SignUp</h1>
          <Form.Item
            label="Full name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input placeholder="Please enter your email" />
          </Form.Item>

          <Form.Item
            label="password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Please enter your Password" />
          </Form.Item>

       

          <Form.Item>
            <Button
              type=""
              htmlType="submit"
              loading={loading}
              style={{
                border:"1px solid black",
                marginLeft:"40%"
              }}
            >
              SignUp
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;