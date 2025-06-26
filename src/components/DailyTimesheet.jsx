import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/DailyTimesheet.css";
import "../styles/IdleTime.css";

// --- DUMMY DATA ---
const membersData = [
  {
    id: 1,
    name: "Byron Jett",
    avatarInitials: "BJ",
    title: "Lead Developer",
    managerName: "Elon Musk",
    hourlyRate: 50,
    overtimeRate: 75,
    totalTime: "7h 30m",
    totalIdleTime: "0h 30m",
    timeEntries: [
      { id: 101, project: 'Falcon Heavy', task: 'Auditing Information Architecture', startTime: '09:00', endTime: '13:00', total: '4h 0m', colorClass: 'project-blue', idleTimes: [{ id: 1001, startTime: '11:20', endTime: '11:50', total: '0 h 30 m' }] },
      { id: 102, project: 'Grasshopper', task: 'Planning on Falcon-9 Launch', startTime: '14:00', endTime: '17:30', total: '3h 30m', colorClass: 'project-green', idleTimes: [] }
    ]
  },
  {
    id: 2,
    name: "Jane Doe",
    avatarInitials: "JD",
    title: "UI/UX Designer",
    managerName: "Elon Musk",
    hourlyRate: 45,
    overtimeRate: 65,
    totalTime: "6h 0m",
    totalIdleTime: "1h 15m",
    timeEntries: [
      { id: 201, project: 'Starship', task: 'UI/UX Mockups', startTime: '10:00', endTime: '12:30', total: '2h 30m', colorClass: 'project-green', idleTimes: [{ id: 2001, startTime: '11:00', endTime: '11:30', total: '0 h 30 m' }] },
      { id: 202, project: 'Internal', task: 'Team Sync Meeting', startTime: '13:30', endTime: '14:15', total: '0h 45m', colorClass: 'project-blue', idleTimes: [] },
      { id: 203, project: 'Starship', task: 'Component Development', startTime: '14:15', endTime: '17:00', total: '2h 45m', colorClass: 'project-green', idleTimes: [{ id: 2002, startTime: '15:30', endTime: '16:15', total: '0 h 45 m' }] }
    ]
  },
  {
    id: 3,
    name: "Sam Wilson",
    avatarInitials: "SW",
    title: "Backend Engineer",
    managerName: "Elon Musk",
    hourlyRate: 55,
    overtimeRate: 80,
    totalTime: "8h 0m",
    totalIdleTime: "0h 0m",
    timeEntries: [
      { id: 301, project: 'Grasshopper', task: 'Backend API Refactor', startTime: '09:00', endTime: '17:00', total: '8h 0m', colorClass: 'project-blue', idleTimes: [] }
    ]
  }
];

// NEW: Data source for Project dropdown
const projectsData = [
    { id: "proj-1", name: "Falcon Heavy" },
    { id: "proj-2", name: "Starship" },
    { id: "proj-3", name: "Grasshopper" },
    { id: "proj-4", name: "Internal" },
    { id: "proj-5", name: "Dragon Capsule" },
];

// NEW: Data source for Task dropdown
const tasksData = [
    { id: "task-1", name: "Development" },
    { id: "task-2", name: "Planning" },
    { id: "task-3", name: "Auditing" },
    { id: "task-4", name: "Team Meeting" },
    { id: "task-5", name: "UI/UX Mockups" },
    { id: "task-6", name: "Backend API Refactor" },
];


const timeToMinutes = (time) => {
  if (!time || !time.includes(':')) return 0;
  const [hours, minutes] = time.split(':').map(Number);
  return (hours * 60) + minutes;
};

const minutesToHoursMinutes = (totalMinutes) => {
  if (totalMinutes === 0) return "0";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  let result = '';
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m`;
  return result.trim();
};

const getBlockStyle = (startTime, endTime, startHour) => {
  const slotHeight = 50;
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
  const [selectedMemberId, setSelectedMemberId] = useState(1);
  const [isMemberDropdownOpen, setMemberDropdownOpen] = useState(false);
  const selectedMember = membersData.find(m => m.id === selectedMemberId);
  const timeEntries = selectedMember ? selectedMember.timeEntries : [];
  const displayDate = "26-06-2025";
  const displayDay = "Thursday";
  const startHour = 9;
  const endHour = 22;
  const timeLabels = Array.from({ length: (endHour - startHour) + 1 }, (_, i) => {
    const hour = startHour + i;
    if (hour === 12) return "12 PM";
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  });

  const handleDownloadPDF = () => {
    if (!selectedMember) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(20);
    doc.text("Daily Timesheet Report", pageWidth / 2, 20, { align: "center" });
    const employeeDetails = [
      [{ content: 'Employee Name:', styles: { fontStyle: 'bold' } }, selectedMember.name, { content: 'Manager Name:', styles: { fontStyle: 'bold' } }, selectedMember.managerName || 'N/A'],
      [{ content: 'Title:', styles: { fontStyle: 'bold' } }, selectedMember.title || 'N/A', { content: 'Date:', styles: { fontStyle: 'bold' } }, displayDate],
      [{ content: 'Hourly Rate:', styles: { fontStyle: 'bold' } }, `$${selectedMember.hourlyRate}`, { content: 'Overtime Rate:', styles: { fontStyle: 'bold' } }, `$${selectedMember.overtimeRate}`],
    ];
    autoTable(doc, {
      startY: 30,
      body: employeeDetails,
      theme: 'plain',
      styles: { fontSize: 10 },
      didDrawCell: (data) => { data.cell.styles.lineWidth = 0; }
    });
    const tableBody = [];
    let totalMinutesWorked = 0;
    for (let hour = 0; hour < 24; hour++) {
      const hourLabel = `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 || hour === 24 ? 'AM' : 'PM'}`;
      let project = '';
      let task = '';
      let minutesInHour = 0;
      const hourStart = hour * 60;
      const hourEnd = hourStart + 60;
      timeEntries.forEach(entry => {
        const entryStart = timeToMinutes(entry.startTime);
        const entryEnd = timeToMinutes(entry.endTime);
        if (entryStart < hourEnd && entryEnd > hourStart) {
          project = entry.project;
          task = entry.task;
          const start = Math.max(hourStart, entryStart);
          const end = Math.min(hourEnd, entryEnd);
          minutesInHour += (end - start);
        }
      });
      totalMinutesWorked += minutesInHour;
      tableBody.push([
        hourLabel,
        project,
        task,
        minutesInHour > 0 ? minutesToHoursMinutes(minutesInHour) : '0',
        '0',
        minutesInHour > 0 ? minutesToHoursMinutes(minutesInHour) : '0'
      ]);
    }
    const lastTableY = doc.lastAutoTable.finalY;
    autoTable(doc, {
      startY: lastTableY + 5,
      head: [['Hour', 'Project', 'Task', 'Regular', 'Overtime', 'Total Time']],
      body: tableBody,
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] },
      styles: { fontSize: 8 },
    });
    const finalY = doc.lastAutoTable.finalY;
    const totalPay = ((totalMinutesWorked / 60) * selectedMember.hourlyRate).toFixed(2);
    doc.setFontSize(10);
    doc.text('Total Time:', 14, finalY + 15);
    doc.setFont(undefined, 'bold');
    doc.text(minutesToHoursMinutes(totalMinutesWorked), 40, finalY + 15);
    doc.setFont(undefined, 'normal');
    doc.text('Total Pay:', 14, finalY + 22);
    doc.setFont(undefined, 'bold');
    doc.text(`$${totalPay}`, 40, finalY + 22);
    const signatureY = finalY + 45;
    doc.text('Employee Signature:', 14, signatureY);
    doc.line(50, signatureY, 100, signatureY);
    doc.text('Date:', 120, signatureY);
    doc.line(132, signatureY, 182, signatureY);
    doc.text('Manager Signature:', 14, signatureY + 15);
    doc.line(50, signatureY + 15, 100, signatureY + 15);
    doc.text('Date:', 120, signatureY + 15);
    doc.line(132, signatureY + 15, 182, signatureY + 15);
    doc.save(`Timesheet_${selectedMember.name.replace(' ', '_')}_${displayDate}.pdf`);
  };

  if (!selectedMember) {
    return <div>Select a member to view their timesheet.</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">Daily Timesheet</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={handleDownloadPDF}>
            Download PDF
          </button>
          <button className="btn btn-primary">+ ADD manual Time</button>
        </div>
      </div>

      <div className="p-3 rounded-3 mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-lg-2 col-md-3">
            <label htmlFor="projectSelect" className="form-label fw-bold small">Projects</label>
            {/* UPDATED: Dynamic Project Dropdown */}
            <select id="projectSelect" className="form-select custom-select-style">
              <option value="">Select Project</option>
              {projectsData.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          <div className="col-lg-2 col-md-3">
            <label htmlFor="taskSelect" className="form-label fw-bold small">Tasks</label>
            {/* UPDATED: Dynamic Task Dropdown */}
            <select id="taskSelect" className="form-select custom-select-style">
              <option value="">Select Task</option>
                {tasksData.map(task => (
                    <option key={task.id} value={task.id}>{task.name}</option>
                ))}
            </select>
          </div>
          <div className="col-lg-4 col-md-6 d-flex align-items-end">
            <div className="me-3 dropdown" style={{ position: 'relative' }}>
              <label className="form-label fw-bold small">Member</label>
              <div>
                {/* FIXED: Removed stray text that was hiding the icon */}
                <button className="add-member-btn" title="Select Member" onClick={() => setMemberDropdownOpen(!isMemberDropdownOpen)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-plus" viewBox="0 0 16 16">
                    <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                    <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
                  </svg>
                </button>
              </div>
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
            <div className="flex-grow-1">
              <label htmlFor="date-picker" className="form-label fw-bold small">Select Date</label>
              <input type="text" id="date-picker" className="form-control" defaultValue={displayDate} />
            </div>
          </div>
        </div>
      </div>
      <hr />
      {selectedMember && (
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center">
            <img src={`https://placehold.co/48x48/EBF4FF/76A9FA?text=${selectedMember.avatarInitials}`} alt={selectedMember.name} className="user-avatar me-3" />
            <div>
              <h5 className="mb-0">{selectedMember.name}</h5>
              <span className="text-muted small">{displayDate} - {displayDay}</span>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <div className="text-end me-3">
              <div className="text-muted small">Total Idle Time</div>
              <div className="fw-bold fs-5 text-danger">{selectedMember.totalIdleTime}</div>
            </div>
            <div className="vr"></div>
            <div className="text-end ms-3">
              <div className="text-muted small">Total Time</div>
              <div className="fw-bold fs-5">{selectedMember.totalTime}</div>
            </div>
          </div>
        </div>
      )}
      <hr />
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
                    {/* FIXED: Removed stray text */}
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