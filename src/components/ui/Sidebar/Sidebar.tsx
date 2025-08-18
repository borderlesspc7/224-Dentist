import "./Sidebar.css";
import { NavLink, useLocation } from "react-router-dom";
import React from "react";
import { pathOptions } from "../../../pages/admin/navigationOptions";

interface SidebarProps {
  Logo: React.ComponentType;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ Logo, className }) => {
  const location = useLocation();
  return (
    <aside className={`sidebar ${className || ""}`}>
      <Logo />
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {pathOptions.map((option) => (
            <li key={option.value} className="nav-item">
              <NavLink
                to={option.value}
                end={false}
                className={({ isActive }) =>
                  `nav-link ${
                    isActive || location.pathname.endsWith(`/${option.value}`)
                      ? "active"
                      : ""
                  }`
                }
              >
                {option.icon}
                {option.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
