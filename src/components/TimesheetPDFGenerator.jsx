import React, { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/DailyTimesheet.css";
import "../styles/IdleTime.css";
import TimesheetPDFGenerator from "./TimesheetPDFGenerator";
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

const projectsData = [
    { id: "proj-1", name: "Falcon Heavy" },
    { id: "proj-2", name: "Starship" },
    { id: "proj-3", name: "Grasshopper" },
    { id: "proj-4", name: "Internal" },
    { id: "proj-5", name: "Dragon Capsule" },
];

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
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [selectedTaskId, setSelectedTaskId] = useState("");
    const [isMemberDropdownOpen, setMemberDropdownOpen] = useState(false);

    const selectedMember = membersData.find(m => m.id === selectedMemberId);

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

    if (!selectedMember) {
        return <div>Select a member to view their timesheet.</div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="m-0">Daily Timesheet</h2>
                <div className="d-flex gap-2">
                    <TimesheetPDFGenerator
                        selectedMember={selectedMember}
                        timeEntries={timeEntries}
                        displayDate={displayDate}
                    />
                    <button className="btn btn-primary">+ ADD manual Time</button>
                </div>
            </div>

            <div className="p-3 rounded-3 mb-4">
                <div className="row g-3 align-items-end">
                    <div className="col-lg-2 col-md-3">
                        <label htmlFor="projectSelect" className="form-label fw-bold small">Projects</label>
                        <select
                            id="projectSelect"
                            className="form-select custom-select-style"
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                        >
                            <option value="">All Projects</option>
                            {projectsData.map(project => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-lg-2 col-md-3">
                        <label htmlFor="taskSelect" className="form-label fw-bold small">Tasks</label>
                        <select
                            id="taskSelect"
                            className="form-select custom-select-style"
                            value={selectedTaskId}
                            onChange={(e) => setSelectedTaskId(e.target.value)}
                        >
                            <option value="">All Tasks</option>
                            {tasksData.map(task => (
                                <option key={task.id} value={task.id}>{task.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-lg-4 col-md-6 d-flex align-items-end">
                        <div className="me-3 dropdown" style={{ position: 'relative' }}>
                            <label className="form-label fw-bold small">Member</label>
                            <div>
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