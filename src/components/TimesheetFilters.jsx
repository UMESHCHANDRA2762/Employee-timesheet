import React, { useState, forwardRef, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { format, addDays, startOfWeek } from 'date-fns';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/TimesheetFilters.css";

const TimesheetFilters = ({
  viewMode,
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
  startDate,
  setStartDate,
  selectedOrganizationId,
  setSelectedOrganizationId,

  onXlsxExport,
  onPdfExport,
}) => {
  const [isMemberDropdownOpen, setMemberDropdownOpen] = useState(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const memberDropdownRef = useRef(null);

  const CalendarIcon = () => (<i className="bi bi-calendar-event"></i>);
  const DropdownIcon = () => (<i className="bi bi-chevron-down"></i>);
  const SearchIcon = () => (<i className="bi bi-search"></i>);

  const CustomDateInput = forwardRef(({ value, onClick }, ref) => {
    let displayValue = "";
    switch(viewMode) {
      case 'weekly':
        const weekEndDate = addDays(startDate, 6);
        displayValue = `${format(startDate, 'dd MMM')} - ${format(weekEndDate, 'dd MMM')}`;
        break;
      case 'biweekly':
        const biweeklyEndDate = addDays(startDate, 13);
        displayValue = `${format(startDate, 'dd MMM')} - ${format(biweeklyEndDate, 'dd MMM')}`;
        break;
      default:
        displayValue = format(startDate, 'dd MMM, yyyy');
        break;
    }
    return (
        <button className="form-control d-flex justify-content-between align-items-center custom-date-input" onClick={onClick} ref={ref}>
            <span>{displayValue}</span>
            <CalendarIcon />
        </button>
    );
  });

  const handleDateChange = (date) => {
    if (viewMode === 'weekly' || viewMode === 'biweekly') {
      setStartDate(startOfWeek(date, { weekStartsOn: 1 }));
    } else {
      setStartDate(date);
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (memberDropdownRef.current && !memberDropdownRef.current.contains(event.target)) {
        setMemberDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMembers = membersData.filter(member =>
    member.name.toLowerCase().includes(memberSearchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-3 p-md-4 rounded shadow-sm mb-4">
      <div className="row g-3 align-items-end">
        
        <div className="col-12 col-sm-6 col-md-4 col-lg-auto">
          <label htmlFor="projectSelect" className="filter-label">Projects</label>
          <div className="select-wrapper">
            <select id="projectSelect" className="form-select custom-select-style" value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
              <option value="">All Projects</option>
              {projectsData.map(project => (<option key={project.id} value={project.id}>{project.name}</option>))}
            </select>
            <div className="select-dropdown-icon"><DropdownIcon /></div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-4 col-lg-auto">
          <label htmlFor="taskSelect" className="filter-label">Tasks</label>
          <div className="select-wrapper">
            <select id="taskSelect" className="form-select custom-select-style" value={selectedTaskId} onChange={(e) => setSelectedTaskId(e.target.value)}>
              <option value="">All Tasks</option>
              {tasksData.map(task => (<option key={task.id} value={task.id}>{task.name}</option>))}
            </select>
            <div className="select-dropdown-icon"><DropdownIcon /></div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-4 col-lg-auto">
          <label className="filter-label">Member</label>
          <div className="dropdown" ref={memberDropdownRef}>
            <button className="add-member-btn" title="Select Member" onClick={() => setMemberDropdownOpen(!isMemberDropdownOpen)}>
              <i className="bi bi-person-plus-fill"></i>
            </button>
            {isMemberDropdownOpen && (
              <ul className="dropdown-menu show member-dropdown-menu">
                <li>
                  <div className="member-search-wrapper" onClick={(e) => e.stopPropagation()}>
                    <div className="member-search-icon"><SearchIcon /></div>
                    <input type="text" placeholder="Search members..." className="member-search-input" value={memberSearchTerm} onChange={(e) => setMemberSearchTerm(e.target.value)} autoFocus />
                  </div>
                </li>
                <div className="member-list">
                  {filteredMembers.map(member => (
                    <li key={member.id}>
                      <a className={`dropdown-item d-flex align-items-center member-dropdown-item ${selectedMemberId === member.id ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setSelectedMemberId(member.id); setMemberDropdownOpen(false); }}>
                        <img src={member.avatarUrl} alt={member.name} className="user-avatar me-2" />
                        {member.name}
                      </a>
                    </li>
                  ))}
                </div>
              </ul>
            )}
          </div>
        </div>
        
        {viewMode !== 'monthly' && (
          <div className="col-12 col-sm-6 col-md-8 col-lg-auto">
            <label htmlFor="date-picker" className="filter-label">Date</label>
            <div className="d-flex align-items-center gap-2">
              <DatePicker id="date-picker" selected={startDate} onChange={handleDateChange} customInput={<CustomDateInput />} />
              <button className="btn btn-sm btn-outline-secondary today-btn" onClick={() => setStartDate(new Date())}>Today</button>
            </div>
          </div>
        )}

        <div className="col-12 col-lg-auto ms-lg-auto">
          { (viewMode === 'daily' || viewMode === 'biweekly') ? (
            <div>
              <label htmlFor="orgSelect" className="filter-label">Timezone</label>
              <div className="select-wrapper">
                <select id="orgSelect" className="form-select custom-select-style" value={selectedOrganizationId} onChange={(e) => setSelectedOrganizationId(e.target.value)}>
                  {organizationsData.map(org => (<option key={org.id} value={org.id}>{org.name}</option>))}
                </select>
                <div className="select-dropdown-icon"><DropdownIcon /></div>
              </div>
            </div>
          ) : (viewMode === 'weekly' || viewMode === 'monthly') ? (
         
            <div className="h-100 d-flex align-items-end">
                <div className="btn-group">
                    <button type="button" className="btn dropdown-toggle export-btn" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="bi bi-download"></i>
                        <span>Export</span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li><button className="dropdown-item" type="button" onClick={onXlsxExport}>Export as Excel</button></li>
                        <li><button className="dropdown-item" type="button" onClick={onPdfExport}>Export as PDF</button></li>
                    </ul>
                </div>
            </div>
          ) : null }
        </div>
      </div>
    </div>
  );
};

export default TimesheetFilters;