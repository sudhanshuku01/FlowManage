import React from "react";
import { NavLink } from "react-router-dom";

const Header: React.FC = () => (
  <header className="header">
    <h1>
      <NavLink to="/" aria-label="Flow Manage Home" title="Flow Manage">
        FlowManage
      </NavLink>
    </h1>
  </header>
);

export default Header;
