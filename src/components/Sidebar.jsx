import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Sidebar.css"; // Import the above CSS

const DropdownIcon = ({ isOpen }) => (
  <svg
    className={`dropdown-icon ms-2${isOpen ? " open" : ""}`}
    viewBox="0 0 20 20"
    fill="currentColor"
    width="16"
    height="16"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({ Timesheets: true });

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Live Feed", path: "/live-feed" },
    {
      name: "Timesheets",
      children: [
        { name: "Daily", path: "/timesheets/daily" },
        { name: "Weekly", path: "/timesheets/weekly" },
        { name: "Bi-Weekly", path: "/timesheets/bi-weekly" },
        { name: "Monthly", path: "/timesheets/monthly" },
        { name: "Custom", path: "/timesheets/custom" }
      ]
    },
    { name: "Approval", path: "/approval" },
    { name: "Work Notes", path: "/work-notes" },
    { name: "Reports", path: "/reports" },
    {
      name: "Manage",
      children: [
        { name: "Tasks", path: "/manage/tasks" },
        { name: "Attendance", path: "/manage/attendance" },
        { name: "To", path: "/manage/to" },
        { name: "Projects", path: "/manage/projects" },
        { name: "Invoice", path: "/manage/invoice" },
        { name: "Clients", path: "/manage/clients" }
      ]
    },
    {
      name: "Admin",
      children: [
        { name: "Teams", path: "/admin/teams" },
        { name: "Members", path: "/admin/members" }
      ]
    }
  ];

  const toggleMenu = (menuName) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  return (
    <nav className="sidebar d-flex flex-column p-3">
      <div className="sidebar-header border-bottom pb-3 mb-3">
        <h3 className="text-center m-0">Dashboard</h3>
      </div>
      <ul className="menu-list nav flex-column">
        {menuItems.map((item, idx) => (
          <li key={idx} className={`nav-item ${item.children ? "" : "mb-1"}`}>
            {item.children ? (
              <>
                <button
                  className="menu-button nav-link d-flex align-items-center justify-content-between w-100"
                  onClick={() => toggleMenu(item.name)}
                  style={{
                    fontSize: "1rem"
                  }}
                  type="button"
                >
                  <span>{item.name}</span>
                  <DropdownIcon isOpen={openMenus[item.name]} />
                </button>
                {openMenus[item.name] && (
                  <ul className="sub-menu nav flex-column ms-4">
                    {item.children.map((child, childIdx) => (
                      <li key={childIdx} className="nav-item">
                        <NavLink
                          to={child.path}
                          className={({ isActive }) =>
                            `sub-menu-button nav-link px-3 py-2${isActive ? " active" : ""}`
                          }
                          style={{ fontSize: ".97rem" }}
                        >
                          {child.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `menu-button nav-link d-flex align-items-center px-3 py-2 mb-1${isActive ? " active" : ""}`
                }
              >
                {item.name}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;