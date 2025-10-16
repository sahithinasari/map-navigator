import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../component/user/Login";
import Register from "../component/user/Register";
import Form from "../component/Form";
import Layout from "../component/Layout";

function Routers() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Parent Route with Nested Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Form />} /> {/* Default child route */}
      </Route>
    </Routes>
  );
}

export default Routers;
