
import React from "react";
import Nav from "./Nav";

const Layout = ({ children }) => {
  return (
    <>
      <div style={{ paddingBottom: "60px" }}>{children}</div>
      <Nav />
    </>
  );
};

export default Layout;
