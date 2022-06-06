import React from "react";
import routes from "../routes.jsx";
import Environment from "./select/environment.jsx";

const Header = () => (
  
  <header className="sticky">
      <Environment/>

    {routes.map(({ path, name }) => (
      <a href={path} className="button" key={path}>
        {name}
      </a>
    ))}
  </header>
);

export default Header;
