import React, { useState, useMemo, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/DailyTimesheet.css";
import "../styles/IdleTime.css";

import AddManualTimeModal from "./AddManualTimeModal";
import IdleTimePopover from "./IdleTimePopover";
import TimesheetFilters from "./TimesheetFilters";
import { membersData, projectsData, tasksData, organizationsData } from "./data";
import TimesheetPDFGenerator from "./PdfGenerators/TimesheetPDFGenerator";
import * as XLSX from 'xlsx';

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
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [selectedTaskId, setSelectedTaskId] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date("2025-06-27"));
    const [selectedOrganizationId, setSelectedOrganizationId] = useState("org-1");
    const [showManualTimeModal, setShowManualTimeModal] = useState(false);
    const [activeIdleInfo, setActiveIdleInfo] = useState(null);
    const [isDownloadOpen, setDownloadOpen] = useState(false);
    const downloadRef = useRef(null);

    useEffect(() => {
        if (membersData && membersData.length > 0) {
            setSelectedMemberId(membersData[0].id);
        }
    }, []);

    const handleCloseModal = () => setShowManualTimeModal(false);
    const handleShowModal = () => setShowManualTimeModal(true);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (downloadRef.current && !downloadRef.current.contains(event.target)) {
                setDownloadOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleInfoIconClick = (e, idle, entry) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const position = {
            top: rect.top + window.scrollY + 25,
            left: rect.left + window.scrollX - 300
        };

        if (activeIdleInfo && activeIdleInfo.idle.id === idle.id) {
            setActiveIdleInfo(null);
        } else {
            setActiveIdleInfo({ idle, entry, position });
        }
    };

    const selectedMember = membersData.find(m => m.id === selectedMemberId);
    const displayDate = selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const timeEntries = useMemo(() => {
        if (!selectedMember) return [];
        let entries = selectedMember.timeEntries || [];
        if (selectedProjectId) {
            const selectedProject = projectsData.find(p => p.id === selectedProjectId);
            if (selectedProject) entries = entries.filter(entry => entry.project === selectedProject.name);
        }
        if (selectedTaskId) {
            const selectedTask = tasksData.find(t => t.id === selectedTaskId);
            if (selectedTask) entries = entries.filter(entry => entry.task === selectedTask.name);
        }
        return entries;
    }, [selectedMember, selectedProjectId, selectedTaskId]);

    const handleExcelExport = () => {
        if (!selectedMember) return;

        let totalMinutes = 0;
        const dataToExport = timeEntries.map(entry => {
            const timeParts = entry.total.match(/(\d+)\s*h\s*(\d+)\s*m/);
            if (timeParts) {
                totalMinutes += parseInt(timeParts[1], 10) * 60 + parseInt(timeParts[2], 10);
            }
            return {
                'Project': entry.project,
                'Task': entry.task,
                'Start Time': entry.startTime,
                'End Time': entry.endTime,
                'Total Time': entry.total,
            };
        });

        const totalHours = Math.floor(totalMinutes / 60);
        const totalMins = totalMinutes % 60;
        const formattedTotal = `${totalHours}h ${totalMins}m`;
        const totalPay = ((totalMinutes / 60) * selectedMember.hourlyRate).toFixed(2);

        dataToExport.push({}); 
        dataToExport.push({ 'Project': 'Total Time', 'Total Time': formattedTotal });
        dataToExport.push({ 'Project': 'Total Pay', 'Total Time': `$${totalPay}` });

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Daily Timesheet");
        XLSX.writeFile(workbook, `Timesheet_${selectedMember.name.replace(/ /g, '_')}_${displayDate.replace(/\//g, '-')}.xlsx`);
    };

    const clockInOutTimes = useMemo(() => {
        if (!timeEntries || timeEntries.length === 0) {
            return { firstIn: '-', lastOut: '-' };
        }
        const firstIn = timeEntries.reduce((earliest, current) =>
            timeToMinutes(current.startTime) < timeToMinutes(earliest) ? current.startTime : earliest,
            timeEntries[0].startTime
        );
        const lastOut = timeEntries.reduce((latest, current) =>
            timeToMinutes(current.endTime) > timeToMinutes(latest) ? current.endTime : latest,
            timeEntries[0].endTime
        );
        return { firstIn, lastOut };
    }, [timeEntries]);

    const displayDay = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    const startHour = 9;
    const endHour = 22;

    const timeLabels = Array.from({ length: (endHour - startHour) + 1 }, (_, i) => {
        const hour = startHour + i;
        if (hour === 12) return "12 PM";
        if (hour > 12) return `${hour - 12} PM`;
        return `${hour} AM`;
    });

    if (!selectedMember) {
        return (
            <div className="bg-light p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="m-0">Daily Timesheet</h2>
                </div>
                <div className="p-5 text-center bg-white rounded shadow-sm">Loading member data...</div>
            </div>
        );
    }

    return (
        <div className="bg-light p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="m-0">Daily Timesheet</h2>
                <div className="d-flex gap-2">
                    <div className="dropdown" ref={downloadRef}>
                        <button className="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" onClick={() => setDownloadOpen(prev => !prev)}>
                            {/* --- THIS BUTTON IS NOW RESPONSIVE --- */}
                            <span className="d-md-none"><i className="bi bi-download"></i></span>
                            <span className="d-none d-md-inline">Download</span>
                        </button>
                        <ul className={`dropdown-menu dropdown-menu-end ${isDownloadOpen ? 'show' : ''}`}>
                            <li>
                                <TimesheetPDFGenerator
                                    selectedMember={selectedMember}
                                    timeEntries={timeEntries}
                                    displayDate={displayDate}
                                    clockInOutTimes={clockInOutTimes}
                                    onDownload={() => setDownloadOpen(false)}
                                />
                            </li>
                            <li>
                                <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleExcelExport(); setDownloadOpen(false); }}>
                                    <i className="bi bi-file-earmark-spreadsheet-fill me-2 text-success"></i>
                                    Excel
                                </a>
                            </li>
                        </ul>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={handleShowModal}>
                        <span className="d-md-none">+</span>
                        <span className="d-none d-md-inline">+ Add Time</span>
                    </button>
                </div>
            </div>

            <TimesheetFilters
                viewMode="daily"
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
                startDate={selectedDate}
                setStartDate={setSelectedDate}
                selectedOrganizationId={selectedOrganizationId}
                setSelectedOrganizationId={setSelectedOrganizationId}
            />

            {selectedMember && (
                <div className="card mb-4 member-details-card">
                    <div className="card-body">
                         <div className="member-card__content">
                              <div className="member-card__profile">
                                  <img src={selectedMember.avatarUrl} alt={selectedMember.name} className="user-avatar" />
                                  <h5 className="mb-0 member-card__name">{selectedMember.name}</h5>
                              </div>
                              <div className="member-card__info-block">
                                  <div className="member-card__value">{displayDate}</div>
                                  <div className="member-card__label">{displayDay}</div>
                              </div>
                              <div className="member-card__info-block">
                                  <div className="fw-bold member-card__value">
                                      {clockInOutTimes.firstIn} - {clockInOutTimes.lastOut}
                                  </div>
                                  <div className="member-card__label">Clock In/Out</div>
                              </div>
                              <div className="member-card__info-block">
                                  <div className="fw-bold member-card__value">{selectedMember.totalTime}</div>
                                  <div className="member-card__label">Total Time</div>
                              </div>
                         </div>
                    </div>
                </div>
            )}

            <div className="row mt-4 timeline-wrapper">
                <div className="col-auto d-none d-md-block text-end pe-4 vertical-time-axis">
                    {timeLabels.map(label => <div key={label} className="time-slot"><span>{label}</span></div>)}
                </div>
                <div className="col">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row text-center d-none d-md-flex timeline-header small text-secondary fw-bold border-bottom mx-0">
                                <div className="col-5 text-start">Project & Task</div>
                                <div className="col">Start</div>
                                <div className="col">End</div>
                                <div className="col">Total</div>
                            </div>
                        </div>
                    </div>
                    <div className="vertical-entries-area">
                        {timeEntries && timeEntries.length > 0 ? (
                            timeEntries.map(entry => (
                                <React.Fragment key={entry.id}>
                                    <div className={`time-entry-row ${entry.colorClass}`} style={getBlockStyle(entry.startTime, entry.endTime, startHour)}>
                                        <div className="entry-details">
                                            <div className="fw-bold project-name">{entry.project}</div>
                                            <div className="text-secondary small task-name">{entry.task}</div>
                                        </div>
                                        <div className="entry-time">{entry.startTime}</div>
                                        <div className="entry-time">{entry.endTime}</div>
                                        <div className="entry-total">{entry.total}</div>
                                        {entry.idleTimes && entry.idleTimes.length > 0 && (
                                            <div className="info-icon" onClick={(e) => handleInfoIconClick(e, entry.idleTimes[0], entry)}>
                                                <i className="bi bi-info-circle-fill"></i>
                                            </div>
                                        )}
                                    </div>
                                    {(entry.idleTimes || []).map(idle => (
                                        <div key={idle.id} className="idle-time-bar" style={getBlockStyle(idle.startTime, idle.endTime, startHour)}></div>
                                    ))}
                                </React.Fragment>
                            ))
                        ) : (
                            <div className="d-flex align-items-center justify-content-center text-secondary" style={{height: '200px'}}>
                                <p>No time entries logged for this day.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {activeIdleInfo && (
                <IdleTimePopover info={activeIdleInfo} onClose={() => setActiveIdleInfo(null)} />
            )}
            <AddManualTimeModal
                show={showManualTimeModal}
                handleClose={handleCloseModal}
                members={membersData}
                projects={projectsData}
                tasks={tasksData}
            />
        </div>
    );
};

export default DailyTimesheet;