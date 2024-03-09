// export const AUTH_TOKEN = 'auth-token';

import React, { Suspense, useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function Constant() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/");
    }
  }, [location]);

  return (
    <div>
      <Navbar />
      <Suspense fallback={<>loading...</>}>
        <Outlet />
      </Suspense>
    </div>
  );
}

export default Constant;