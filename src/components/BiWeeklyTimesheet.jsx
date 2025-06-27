import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/DailyTimesheet.css";
import "../styles/IdleTime.css";

// Import the reusable components and data
import TimesheetFilters from "./TimesheetFilters";
import { membersData, projectsData, tasksData, organizationsData } from "./data";

// Import date-fns helpers for week calculations
import { startOfWeek, endOfWeek } from 'date-fns';

const BiWeeklyTimesheet = () => {
  // --- State Management for Filters ---
  const [selectedMemberId, setSelectedMemberId] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("org-1");

  // State for the weekly date range picker
  const [startDate, setStartDate] = useState(startOfWeek(new Date("2025-06-27"), { weekStartsOn: 1 }));
  const [endDate, setEndDate] = useState(endOfWeek(new Date("2025-06-27"), { weekStartsOn: 1 }));

  return (
    <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">BiWeekly Timesheet</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary">Download PDF</button>
          <button className="btn btn-primary">+ ADD manual Time</button>
        </div>
      </div>

      <TimesheetFilters
        viewMode="weekly" // <-- This prop tells the filter to show the date range picker
        projectsData={projectsData}
        tasksData={tasksData}
        membersData={membersData}
        organizationsData={organizationsData}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        selectedTaskId={selectedTaskId}
        setSelectedTaskId={setSelectedTaskId}
        selectedMemberId={selectedMemberId}
        setSelectedMemberId={setSelectedMemberId}
        startDate={startDate} // Pass weekly state
        setStartDate={setStartDate} // Pass weekly state
        endDate={endDate} // Pass weekly state
        setEndDate={setEndDate} // Pass weekly state
        selectedOrganizationId={selectedOrganizationId}
        setSelectedOrganizationId={setSelectedOrganizationId}
      />
      
      {/* The rest of the weekly content will go here */}
      <div className="mt-4 p-5 bg-white border rounded text-center">
        <h4 className="text-muted">Weekly Content Area</h4>
        <p>The BiWeekly grid and summary cards will be built here.</p>
      </div>
    </div>
  );
};

export default BiWeeklyTimesheet;
