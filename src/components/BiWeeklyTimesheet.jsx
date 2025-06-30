import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/DailyTimesheet.css";
import "../styles/IdleTime.css";
import "../styles/BiWeeklyTimesheet.css";

import TimesheetFilters from "./TimesheetFilters";
import AddManualTimeModal from "./AddManualTimeModal";
import BiWeeklyPDFGenerator from "./PdfGenerators/BiWeeklyPDFGenerator";
import { membersData, projectsData, tasksData, organizationsData } from "./data";
import * as XLSX from 'xlsx';

import { startOfWeek, format, addDays } from 'date-fns';

const BiWeeklyTimesheet = () => {
    const [selectedMemberId, setSelectedMemberId] = useState(1);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [selectedTaskId, setSelectedTaskId] = useState("");
    const [selectedOrganizationId, setSelectedOrganizationId] = useState("org-1");
    const [showManualTimeModal, setShowManualTimeModal] = useState(false);
    const [isDownloadOpen, setDownloadOpen] = useState(false);
    const downloadRef = useRef(null);

    const [startDate, setStartDate] = useState(startOfWeek(new Date("2025-06-16"), { weekStartsOn: 1 }));
    const [endDate, setEndDate] = useState(addDays(startOfWeek(new Date("2025-06-16"), { weekStartsOn: 1 }), 13));

    const selectedMemberData = membersData.find(member => member.id === selectedMemberId);
    const biWeeklyData = selectedMemberData?.biWeeklyTimesheet;

    useEffect(() => {
        const newStartDate = startOfWeek(startDate, { weekStartsOn: 1 });
        const newEndDate = addDays(newStartDate, 13);
        setEndDate(newEndDate);
    }, [startDate]);

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

    const handleCloseModal = () => setShowManualTimeModal(false);
    const handleShowModal = () => setShowManualTimeModal(true);

    const handleExcelExport = () => {
        if (!selectedMemberData || !biWeeklyData) {
            alert("No data to export.");
            return;
        }

        const dataForExcel = [];
        dataForExcel.push({ A: 'Week 1', H: `Total: ${biWeeklyData.week1.total}` });
        dataForExcel.push({ 
            A: 'Mon', B: 'Tue', C: 'Wed', D: 'Thu', E: 'Fri', F: 'Sat', G: 'Sun'
        });
        dataForExcel.push({
            A: biWeeklyData.week1.days[0].hours, B: biWeeklyData.week1.days[1].hours, C: biWeeklyData.week1.days[2].hours,
            D: biWeeklyData.week1.days[3].hours, E: biWeeklyData.week1.days[4].hours, F: biWeeklyData.week1.days[5].hours,
            G: biWeeklyData.week1.days[6].hours
        });
        dataForExcel.push({}); // Spacer

        dataForExcel.push({ A: 'Week 2', H: `Total: ${biWeeklyData.week2.total}` });
        dataForExcel.push({ 
            A: 'Mon', B: 'Tue', C: 'Wed', D: 'Thu', E: 'Fri', F: 'Sat', G: 'Sun'
        });
        dataForExcel.push({
            A: biWeeklyData.week2.days[0].hours, B: biWeeklyData.week2.days[1].hours, C: biWeeklyData.week2.days[2].hours,
            D: biWeeklyData.week2.days[3].hours, E: biWeeklyData.week2.days[4].hours, F: biWeeklyData.week2.days[5].hours,
            G: biWeeklyData.week2.days[6].hours
        });
        dataForExcel.push({}); // Spacer
        dataForExcel.push({ A: 'Grand Total', B: biWeeklyData.totalHours });
        
        const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { skipHeader: true });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "BiWeekly Timesheet");
        
        const fileName = `BiWeeklyTimesheet_${selectedMemberData.name.replace(' ', '_')}_${format(startDate, 'yyyy-MM-dd')}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };

    const weekHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Total"];
    
    return (
        <div className="bg-light p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="m-0">BiWeekly Timesheet</h2>
                <div className="d-flex gap-2">
                    <div className="dropdown" ref={downloadRef}>
                        <button className="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" onClick={() => setDownloadOpen(prev => !prev)}>
                            Download
                        </button>
                        <ul className={`dropdown-menu dropdown-menu-end ${isDownloadOpen ? 'show' : ''}`}>
                            <li>
                                <BiWeeklyPDFGenerator
                                    selectedMember={selectedMemberData}
                                    biWeeklyData={biWeeklyData}
                                    startDate={startDate}
                                    endDate={endDate}
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
                    {/* --- THIS BUTTON IS NOW UPDATED --- */}
                    <button className="btn btn-primary btn-sm" onClick={handleShowModal}>
                        <span className="d-md-none">+</span>
                        <span className="d-none d-md-inline">+ ADD manual Time</span>
                    </button>
                </div>
            </div>

            <TimesheetFilters
                viewMode="biweekly"
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
                startDate={startDate} 
                setStartDate={setStartDate} 
                selectedOrganizationId={selectedOrganizationId}
                setSelectedOrganizationId={setSelectedOrganizationId}
            />
            
            <div className="bg-white rounded-3 mt-4 overflow-hidden">
                <div className="d-flex align-items-center p-4">
                    <h4 className="m-0 fw-semibold date-range-text">{`${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`}</h4>
                    {biWeeklyData && (
                        <div className="d-flex justify-content-center align-items-center rounded-2 ms-5 py-2 px-3 total-hour-box">
                            <span className="fw-bold">Total Hours {biWeeklyData.totalHours}</span>
                        </div>
                    )}
                </div>
                
                {biWeeklyData ? (
                    <div className="p-4 pt-0">
                        <div className="week-grid week-header-grid">
                            {weekHeaders.map(header => <div key={header} className="week-day-header text-uppercase">{header}</div>)}
                        </div>
                        <div className="week-grid week-row">
                            {biWeeklyData.week1.days.map((day, index) => (
                                <div key={index} className="d-flex flex-column justify-content-center align-items-center h-100">
                                    <div className="time-block day-hours">{day.hours}</div>
                                    <div className="day-date mt-2">{day.date}</div>
                                </div>
                            ))}
                            <div className="d-flex flex-column justify-content-center align-items-center h-100">
                                <div className="time-block total-hours">{biWeeklyData.week1.total}</div>
                            </div>
                        </div>
                        <div className="week-grid week-row">
                            {biWeeklyData.week2.days.map((day, index) => (
                                <div key={index} className="d-flex flex-column justify-content-center align-items-center h-100">
                                    <div className="day-hours time-block">{day.hours}</div>
                                    <div className="day-date mt-2">{day.date}</div>
                                </div>
                            ))}
                            <div className="d-flex flex-column justify-content-center align-items-center h-100">
                                <div className="total-hours time-block">{biWeeklyData.week2.total}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center p-5">
                        <p>No bi-weekly timesheet data available for the selected member.</p>
                    </div>
                )}
            </div>
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

export default BiWeeklyTimesheet;