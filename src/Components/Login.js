// import React, { useState } from "react";
// import { LockOutlined, UserOutlined } from "@ant-design/icons";
// import { Button, Checkbox, Form, Input } from "antd";
// import { useMutation,gql } from "@apollo/client";
// import { useNavigate } from "react-router-dom";
// import { AUTH_TOKEN } from "./Constant";

// const LOGIN_MUTATION = gql`
//   mutation emailPasswordLogIn($data: EmailPasswordLogInData!) {
//     emailPasswordLogIn(data: $data) {
//       message
//       data {
//         token
//       }
//     }
//   }
// `;

// const Login = () => {
//   const navigate = useNavigate();
//   const [formState, setFormState] = useState({
//     login: true,
//     email: "",
//     password: "",
//   });

//   const [login] = useMutation(LOGIN_MUTATION, {
//     variables: {
//       email: formState.email,
//       password: formState.password,
//     },
//     onCompleted: ({ login }) => {
//       localStorage.setItem(AUTH_TOKEN, login.token);
//       navigate("/");
//     },
//   });

//   const handleFormSubmit = (event) => {
//     event.preventDefault();
//     if (formState.login) {
//       login({ variables: { data: { email: formState.email, password: formState.password } } });
//     } else {
     
//     }
//   };

//   return (
//     <Form className="login-form" onSubmit={handleFormSubmit}>
//       <h1 style={{
//         marginLeft: "40%"
//       }}> Log In</h1>
//       <Form.Item
//         name="username"
//         rules={[
//           {
//             required: true,
//             message: "Please input your Username!",
//           },
//         ]}
//       >
//         <Input
//           prefix={<UserOutlined className="site-form-item-icon" />}
//           placeholder="Username"
//         />
//       </Form.Item>
//       <Form.Item
//         name="password"
//         rules={[
//           {
//             required: true,
//             message: "Please input your Password!",
//           },
//         ]}
//       >
//         <Input
//           prefix={<LockOutlined className="site-form-item-icon" />}
//           type="password"
//           placeholder="Password"
//         />
//       </Form.Item>
//       <Form.Item>
//         <Form.Item name="remember" valuePropName="checked" noStyle>
//           <Checkbox>Remember me</Checkbox>
//         </Form.Item>

//         <a className="login-form-forgot" href="">
//           Forgot password
//         </a>
//       </Form.Item>

//       <Form.Item>
//         <Button type="primary" htmlType="submit" className="login-form-button">
//           Log In
//         </Button>
//         Or <Button 
//         onClick={(e) =>
//             setFormState({
//               ...formState,
//               login: !formState.login,
//             })
//           }>
//            {formState.login
//             ? "Sign up"
//             : ""}
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };


// export default Login;


import React from "react";
import {Input, Checkbox, Button, Form, Card, message} from "antd";
import {gql, useMutation} from '@apollo/client';
import {useNavigate} from 'react-router-dom';

const LOGIN_MUTATION = gql`
mutation emailPasswordLogInMutation($email: String!, $password: String!) {
  emailPasswordLogIn(data: {email: $email, password: $password}) {
    message
    data{
      token
    }
}
}
`;

const Login = () => {
  const[form] = Form.useForm();
  const navigate = useNavigate();

  const [loginMutation, {loading}] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const { token } = data.emailPasswordLogIn.data;
      localStorage.setItem("token", token);
      message.success(data.emailPasswordLogIn.message);
      navigate("/home");
      window.location.reload();
    },
    onError : (error) => {
      message.error(error.message);
    },
  });

  const handleFormSubmit = (values) => {
    const { email, password} = values;
    loginMutation({variables: {email,password}});
  };

  return(
<div style={{paddingTop: '3%'}}>
  <Card
  bordered={true}
  style={{
    border: "2px solid black",
    borderRadius: "5%",
    marginLeft:"20%",
    marginRight:"20%",
    paddingLeft:"10px",
    paddingRight:"20%",
    paddingTop:"10px",
    paddingBottom:"90px",
    backgroundColor:"lightgrey",
   
  }}
  >
    <Form form= {form} onFinish={handleFormSubmit}>
      <h1 style={{marginLeft:"60%"}}>Login</h1>
      <Form.Item
      label="Username"
        name="email"
        rules={[{ required: true, message: 'Please enter your username' }]}
      >
        <Input placeholder="Please enter your email" />
      </Form.Item>

      <Form.Item
      label="password"
        name="password"
        rules={[{ required: true, message: 'Please enter your password' }]}
      >
        <Input.Password placeholder="Please enter your Password" />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span:16 }}
        >
        <Checkbox>Remember me</Checkbox>    
      </Form.Item>

      <Form.Item wrapperCol={{offset:8, span: 16}}>
        <Button type="" htmlType="submit" loading={loading} style={{border:"1px solid grey",marginRight: "10px"}}>
          Login
        </Button>
        <Button type="" htmlType="button" onClick={() => navigate("/signup")} style={{border:"1px solid grey",marginLeft: "10px"}}>
          SignUp
        </Button>
      </Form.Item>
    </Form>
  </Card>
</div>
  );
}


export default Login; 