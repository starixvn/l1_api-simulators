import React from "react";
import { useLocation } from "react-router-dom";
import routes from "../routes.jsx";
import Environment from "./select/environment.jsx";

const Header = (props) => {
    const location = useLocation();
    
    return (
        <header className="sticky">
            <Environment {...props} />

            {routes.map(({ path, name }) => (
                <a 
                    href={path} 
                    className={`button ${location.pathname === path ? 'active' : ''}`}
                    key={path}
                >
                    {name}
                </a>
            ))}
        </header>
    );
};

export default Header;
