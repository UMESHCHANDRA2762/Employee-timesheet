import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar"; // Assuming Sidebar is in components folder
import DailyTimesheet from "./components/DailyTimesheet";
import WeeklyTimesheet from "./components/WeeklyTimesheet";
import BiWeeklyTimesheet from "./components/BiWeeklyTimesheet";
import MonthlyTimesheet from "./components/MonthlyTimesheet";
import CustomTimesheet from "./components/CustomTimesheet";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; // We'll add one style to this file

function App() {
  return (
    <Router>
      <div className="app-container d-flex">
        <Sidebar />
        <main className="content-area flex-grow-1 p-4">
          <Routes>
            {/* Redirect root path to the daily timesheet by default */}
            <Route path="/" element={<Navigate to="/timesheets/daily" replace />} />

            {/* --- Timesheet Routes --- */}
            <Route path="/timesheets/daily" element={<DailyTimesheet />} />
            <Route path="/timesheets/weekly" element={<WeeklyTimesheet />} />
            <Route path="/timesheets/bi-weekly" element={<BiWeeklyTimesheet />} />
            <Route path="/timesheets/monthly" element={<MonthlyTimesheet />} />
            <Route path="/timesheets/custom" element={<CustomTimesheet />} />

            {/* A placeholder for any other non-timesheet routes to avoid a blank page */}
            <Route
              path="*"
              element={
                <div>
                  <h2>Welcome</h2>
                  <p>Select an item from the sidebar.</p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
