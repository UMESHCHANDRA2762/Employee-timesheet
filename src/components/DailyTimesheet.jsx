import React, { useState, useMemo } from "react";
import jsPDF from "jspdf";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/DailyTimesheet.css";
import "../styles/IdleTime.css";

// Import the reusable components and data
import TimesheetFilters from "./TimesheetFilters";
import { membersData, projectsData, tasksData, organizationsData } from "./data"; // Data is now imported

// Helper function to convert HH:MM time to total minutes
const timeToMinutes = (time) => {
  if (!time || !time.includes(':')) return 0;
  const [hours, minutes] = time.split(':').map(Number);
  return (hours * 60) + minutes;
};

// Helper function to convert total minutes to "Xh Ym" format
const minutesToHoursMinutes = (totalMinutes) => {
  if (totalMinutes === 0) return "0";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  let result = '';
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m`;
  return result.trim();
};

// Helper function to calculate the position and height of a time block
const getBlockStyle = (startTime, endTime, startHour) => {
  const slotHeight = 50; // Corresponds to the height of one hour in the timeline
  const timelineStartMinutes = startHour * 60;
  
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  
  const startOffsetMinutes = startMinutes - timelineStartMinutes;
  const top = (startOffsetMinutes / 60) * slotHeight;
  
  const durationMinutes = endMinutes - startMinutes;
  const height = (durationMinutes / 60) * slotHeight;
  
  return { top: `${top}px`, height: `${height}px` };
};

const DailyTimesheet = () => {
  // State management for filters
  const [selectedMemberId, setSelectedMemberId] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date("2025-06-27"));
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("org-1");

  // Find the selected member from the imported data
  const selectedMember = membersData.find(m => m.id === selectedMemberId);

  // Memoized calculation to filter time entries based on selected filters
  const timeEntries = useMemo(() => {
    if (!selectedMember) return [];
    
    let entries = selectedMember.timeEntries;
    
    if (selectedProjectId) {
      const selectedProject = projectsData.find(p => p.id === selectedProjectId);
      if (selectedProject) {
        entries = entries.filter(entry => entry.project === selectedProject.name);
      }
    }
    
    if (selectedTaskId) {
      const selectedTask = tasksData.find(t => t.id === selectedTaskId);
      if (selectedTask) {
        entries = entries.filter(entry => entry.task === selectedTask.name);
      }
    }
    
    return entries;
  }, [selectedMember, selectedProjectId, selectedTaskId]);

  // Format date and day for display
  const displayDate = selectedDate.toLocaleDateString('en-GB');
  const displayDay = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

  // Timeline display parameters
  const startHour = 9;
  const endHour = 22;

  // Generate time labels for the vertical axis
  const timeLabels = Array.from({ length: (endHour - startHour) + 1 }, (_, i) => {
    const hour = startHour + i;
    if (hour === 12) return "12 PM";
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  });

  // Handler for PDF download
  const handleDownloadPDF = () => {
    if (!selectedMember) return;
    const doc = new jsPDF();
    // PDF generation logic would go here
  };

  if (!selectedMember) {
    return <div>Select a member to view their timesheet.</div>;
  }
  
  // Style object for the member card grid layout
  const cardContentStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, auto)',
    columnGap: '60px',
    justifyContent: 'start',
    alignItems: 'center',
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', padding: '1.5rem' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">Daily Timesheet</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={handleDownloadPDF}>Download PDF</button>
          <button className="btn btn-primary">+ ADD manual Time</button>
        </div>
      </div>

      <TimesheetFilters
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
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedOrganizationId={selectedOrganizationId}
        setSelectedOrganizationId={setSelectedOrganizationId}
      />
      
      {/* Member Details Card */}
      {selectedMember && (
        <div className="card mb-4">
            <div className="card-body">
                <div style={cardContentStyle}>
                    {/* Grid Item 1: Avatar and Name */}
                    <div className="d-flex align-items-center gap-3">
                        <img src={`https://placehold.co/48x48/EBF4FF/76A9FA?text=${selectedMember.avatarInitials}`} alt={selectedMember.name} className="user-avatar" />
                        <h5 className="mb-0">{selectedMember.name}</h5>
                    </div>
                    
                    {/* Grid Item 2: Date and Day */}
                    <div>
                        <div className="text-muted small">{displayDate}</div>
                        <div className="text-muted" style={{fontSize: '0.75rem'}}>{displayDay}</div>
                    </div>

                    {/* Grid Item 3: Total Time */}
                    <div>
                        <div className="fw-bold fs-5">{selectedMember.totalTime}</div>
                        <div className="text-muted small">Total Time</div>
                    </div>

                    {/* Grid Item 4: Clock In/Out */}
                    <div>
                        <div className="fw-bold fs-5 text-danger">{selectedMember.totalIdleTime}</div>
                        <div className="text-muted small">Clock In/Out</div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Vertical Timeline Grid */}
      <div className="timeline-grid">
        <div className="timeline-header">
          <div>Project & Task</div><div>Start</div><div>End</div><div>Total</div>
        </div>
        <div className="vertical-time-axis">
          {timeLabels.map(label => <div key={label} className="time-slot"><span>{label}</span></div>)}
        </div>
        <div className="vertical-entries-area">
          {timeEntries.map(entry => (
            <React.Fragment key={entry.id}>
              <div className={`time-entry-row ${entry.colorClass}`} style={getBlockStyle(entry.startTime, entry.endTime, startHour)}>
                <div className="entry-details"><div className="project-name">{entry.project}</div><div className="task-name">{entry.task}</div></div>
                <div className="entry-time">{entry.startTime}</div>
                <div className="entry-time">{entry.endTime}</div>
                <div className="entry-total">{entry.total}</div>
              </div>
              {entry.idleTimes.map(idle => (
                <div key={idle.id} className="idle-time-bar" style={getBlockStyle(idle.startTime, idle.endTime, startHour)}></div>
              ))}
            </React.Fragment>
          ))}
        </div>
        <div className="idle-details-section">
          <div className="total-idle-display">
            <span className="label">Total Idle Time</span>
            <span className="value text-danger">{selectedMember.totalIdleTime}</span>
          </div>
          {timeEntries.map(entry => (
            <React.Fragment key={`idle-details-${entry.id}`}>
              {entry.idleTimes.map(idle => (
                <div key={`idle-card-${idle.id}`} className="idle-card">
                  <div className="idle-card-project">
                    <div className="project-name">{entry.project}</div>
                    <div className="task-name">{entry.task}</div>
                  </div>
                  <div className="idle-card-time">
                    <div className="label">Start Time</div>
                    <div className="value">{idle.startTime}</div>
                  </div>
                  <div className="idle-card-time">
                    <div className="label">End Time</div>
                    <div className="value">{idle.endTime}</div>
                  </div>
                  <div className="idle-card-time">
                    <div className="label">Total Idle Time</div>
                    <div className="value">{idle.total}</div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyTimesheet;
