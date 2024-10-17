import React from "react";
import { Login } from "./admin/Login/Login";
import { Layout } from "./admin/Layout/Layout";
import { Landing } from "./user/Landing/Landing";
import { UserTable } from "./admin/Components/Tables/UserTable/Table";
import { Routes, Route } from "react-router-dom";
// import { Credentials } from "./user/Signup/Credentials";
import { Credentials } from "./user/Signup copy/Credentials";
const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Layout />}>
        <Route path="manageUser" element={<UserTable />} />
      </Route>
      <Route path="/" element={<Landing />} />
      <Route path="/signUp" element={<Credentials />} />
    </Routes>
  );
};

export default App;
