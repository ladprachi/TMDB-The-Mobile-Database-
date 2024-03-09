import React from "react";
import { Menu, Layout, Button } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Header>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["1"]}
        style={{ display: "flex" }}
      >
        <Menu.Item key="1">
          <Link to="/">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/movie-card">Moviecard</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/person-list">Personlist</Link>
        </Menu.Item>

        <Button
          style={{ left: "80%", marginTop: "15px" }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Menu>
    </Header>
  );
};

export default Navbar;
