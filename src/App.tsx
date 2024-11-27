import React from "react";
import { Route, Routes } from "react-router-dom";
import "./style/App.css";
import UserDashboard from "./components/Users/UserDashboard";
import RoleDashboard from "./components/Roles/RoleDashboard";
import Home from "./components/Home/Home";

const App: React.FC = () => (
  <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users" element={<UserDashboard />} />
      <Route path="/roles" element={<RoleDashboard />} />
    </Routes>
  </>
);

export default App;
