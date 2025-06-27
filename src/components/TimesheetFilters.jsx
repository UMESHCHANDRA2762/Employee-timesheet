import React, { useState } from "react";
import DatePicker from "react-datepicker";


import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/DailyTimesheet.css"; 
const TimesheetFilters = ({
  projectsData,
  tasksData,
  membersData,
  organizationsData,
  selectedProjectId,
  setSelectedProjectId,
  selectedTaskId,
  setSelectedTaskId,
  selectedMemberId,
  setSelectedMemberId,
  selectedDate,
  setSelectedDate,
  selectedOrganizationId,
  setSelectedOrganizationId,
}) => {

  const [isMemberDropdownOpen, setMemberDropdownOpen] = useState(false);

  // Helper SVG components for icons
  const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-event" viewBox="0 0 16 16">
        <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
    </svg>
  );

  const DropdownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
    </svg>
  );

  return (
    <div className="p-2 rounded-3 mb-4 border bg-white">
      <div className="row g-3 align-items-end">

 

        {/* Projects */}
        <div className="col-lg-auto">
          <label htmlFor="projectSelect" className="form-label fw-bold small">Projects</label>
          <div className="select-wrapper">
            <select
              id="projectSelect"
              className="form-select form-select-sm custom-select-style"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              <option value="">(All Active Projects)</option>
              {projectsData.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
            <div className="select-dropdown-icon">
                <DropdownIcon />
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="col-lg-auto">
          <label htmlFor="taskSelect" className="form-label fw-bold small">Tasks</label>
          <div className="select-wrapper">
            <select
              id="taskSelect"
              className="form-select form-select-sm custom-select-style"
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
            >
              <option value="">(All Tasks)</option>
              {tasksData.map(task => (
                <option key={task.id} value={task.id}>{task.name}</option>
              ))}
            </select>
            <div className="select-dropdown-icon">
                <DropdownIcon />
            </div>
          </div>
        </div>

        {/* Member */}
        <div className="col-lg-auto">
             <label className="form-label fw-bold small">Member</label>
             <div className="dropdown" style={{ position: 'relative' }}>
                <button className="add-member-btn" title="Select Member" onClick={() => setMemberDropdownOpen(!isMemberDropdownOpen)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-plus" viewBox="0 0 16 16">
                        <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                        <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
                    </svg>
                </button>
                {isMemberDropdownOpen && (
                <ul className="dropdown-menu show" style={{ position: 'absolute', top: '100%', left: 0, zIndex: 1000, marginTop: '5px' }}>
                    {membersData.map(member => (
                    <li key={member.id}>
                        <a className={`dropdown-item d-flex align-items-center ${selectedMemberId === member.id ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setSelectedMemberId(member.id); setMemberDropdownOpen(false); }}>
                        <img src={`https://placehold.co/24x24/EBF4FF/76A9FA?text=${member.avatarInitials}`} alt={member.name} className="user-avatar me-2" style={{ width: '24px', height: '24px' }} />
                        {member.name}
                        </a>
                    </li>
                    ))}
                </ul>
                )}
             </div>
        </div>
        
        {/* Date Picker & Today Button */}
        <div className="col-lg-auto">
          <label htmlFor="date-picker" className="form-label fw-bold small">Select Date</label>
          <div className="d-flex align-items-center gap-2">
              <div className="date-picker-container date-picker-wrapper">
                  <DatePicker
                    id="date-picker"
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    className="form-control form-control-sm"
                    dateFormat="dd/MM/yyyy"
                  />
                  <div className="date-picker-icon">
                      <CalendarIcon />
                  </div>
              </div>
              <button
                className="btn btn-sm btn-outline-secondary"
                style={{height: '31px'}}
                onClick={() => setSelectedDate(new Date())}
              >
                Today
              </button>
          </div>
        </div>
        
        {/* --- RIGHT-ALIGNED FILTERS --- */}

        {/* Organization Dropdown with Timezone Label */}
        <div className="col-lg-auto ms-auto">
          <label htmlFor="orgSelect" className="form-label fw-bold small">Timezone</label>
          <div className="select-wrapper">
            <select
              id="orgSelect"
              className="form-select form-select-sm custom-select-style"
              value={selectedOrganizationId}
              onChange={(e) => setSelectedOrganizationId(e.target.value)}
            >
              {organizationsData.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
            <div className="select-dropdown-icon">
                <DropdownIcon />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TimesheetFilters;