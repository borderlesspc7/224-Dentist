import "./Sidebar.css";
import { NavLink, useLocation } from "react-router-dom";
import React, { useMemo } from "react";
import { pathOptions } from "../../../pages/admin/navigationOptions";
import { usePermissions } from "../../../hooks/usePermissions";

interface SidebarProps {
  Logo: React.ComponentType;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ Logo, className }) => {
  const location = useLocation();
  const { checkPermission } = usePermissions();

  // Filter navigation options based on user permissions
  const filteredOptions = useMemo(() => {
    return pathOptions.filter((option) => {
      // If option has a permission requirement, check it
      if (option.permission) {
        return checkPermission(option.permission);
      }
      // If no permission specified, show it (backward compatibility)
      return true;
    });
  }, [checkPermission]);

  return (
    <aside className={`sidebar ${className || ""}`}>
      <Logo />
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {filteredOptions.map((option) => (
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
