import React, { useState, useRef, useCallback, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/Sidebar.css";

const DropdownIcon = ({ isOpen }) => (
  <svg className={`dropdown-icon ms-auto transition-transform ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const Sidebar = () => {
  const [isMenuOpen, setMenuOpen] = useState(true);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [width, setWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);

  const sidebarRef = useRef(null);

  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((mouseMoveEvent) => {
    if (isResizing && sidebarRef.current) {
      const newWidth = mouseMoveEvent.clientX - sidebarRef.current.getBoundingClientRect().left;
      if (newWidth >= 200 && newWidth <= 500) {
        setWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);
  
  const menuItems = [
    {
      name: "Timesheets",
      children: [
        { name: "Daily", path: "/timesheets/daily" },
        { name: "Weekly", path: "/timesheets/weekly" },
        { name: "Bi-Weekly", path: "/timesheets/bi-weekly" },
        { name: "Monthly", path: "/timesheets/monthly" },
      ],
    },
  ];

  const toggleParentMenu = () => {
    setMenuOpen((prev) => !prev);
  };
  
  const toggleMobileSidebar = () => {
    setMobileOpen(prev => !prev);
  }

  return (
    <>
      <button 
        className="sidebar-toggle-btn btn position-fixed top-0 start-0 m-3 d-lg-none bg-white rounded shadow-sm z-3" 
        type="button" 
        onClick={toggleMobileSidebar}
        aria-label="Toggle sidebar"
      >
        <i className="bi bi-list"></i>
      </button>

      {isMobileOpen && <div className="sidebar-overlay position-fixed top-0 start-0 w-100 h-100 d-lg-none" onClick={toggleMobileSidebar}></div>}

      <nav 
        ref={sidebarRef}
        className={`sidebar d-flex flex-column p-lg-3 p-2 bg-white text-black min-vh-100 position-relative ${isMobileOpen ? "is-open" : ""} ${isResizing ? "is-resizing" : ""}`} 
        style={{ width: `${width}px` }}
        aria-label="Main navigation"
      >
        <div className="sidebar-header border-bottom pb-3 mb-3">
          <h3 className="text-center m-0">Dashboard</h3>
        </div>
        <ul className="nav flex-column">
          {menuItems.map((item, idx) => (
            <li key={idx} className="nav-item">
              {item.children ? (
                <>
                  <button
                    className="menu-button btn d-flex align-items-center justify-content-between w-100"
                    onClick={toggleParentMenu}
                    type="button"
                  >
                    <span>{item.name}</span>
                    <DropdownIcon isOpen={isMenuOpen} />
                  </button>
                  {isMenuOpen && (
                    <ul className="nav flex-column ms-4">
                      {item.children.map((child, childIdx) => (
                        <li key={childIdx} className="nav-item">
                          <NavLink
                            to={child.path}
                            className={({ isActive }) =>
                              `sub-menu-button nav-link px-3 py-2 ${isActive ? "active" : ""}`
                            }
                            onClick={() => setMobileOpen(false)}
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
                    className="nav-link"
                    onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        <div 
            className="sidebar-dragger d-none d-lg-block" 
            onMouseDown={startResizing}
        ></div>
      </nav>
    </>
  );
};

export default Sidebar;