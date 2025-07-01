import React, { useState, useMemo, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/DailyTimesheet.css";
import "../styles/IdleTime.css";
import "../styles/WeeklyTimesheet.css";

import TimesheetFilters from "./TimesheetFilters";
import AddManualTimeModal from "./AddManualTimeModal";
import { membersData, projectsData, tasksData, organizationsData } from "./data";

import * as XLSX from 'xlsx';
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';

import generateWeeklyTimesheetPDF from './PdfGenerators/WeeklyTimesheetPDFGenerator';

const useIsMobile = (breakpoint = 767) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= breakpoint);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= breakpoint);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isMobile;
};

const timeToMinutes = (time) => {
    if (!time) return 0;
    const parts = time.match(/(\d+)\s*h(?:\s*(\d+)\s*m)?/);
    if (!parts) return 0;
    const hours = parseInt(parts[1] || '0', 10);
    const minutes = parseInt(parts[2] || '0', 10);
    return (hours * 60) + minutes;
};

const minutesToHoursMinutes = (totalMinutes) => {
    if (totalMinutes === 0 || !totalMinutes) return "0h 0m";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
};

const minutesToDecimalHours = (totalMinutes) => {
    return (totalMinutes / 60).toFixed(1);
};


const WeeklyTimesheet = () => {
    const isMobile = useIsMobile();
    
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [selectedTaskId, setSelectedTaskId] = useState("");
    const [selectedOrganizationId, setSelectedOrganizationId] = useState("org-1");
    // Set initial date to a date where there is data
    const [startDate, setStartDate] = useState(startOfWeek(new Date("2025-06-23"), { weekStartsOn: 1 }));
    const [endDate, setEndDate] = useState(endOfWeek(new Date("2025-06-23"), { weekStartsOn: 1 }));
    const [showManualTimeModal, setShowManualTimeModal] = useState(false);

    const handleCloseModal = () => setShowManualTimeModal(false);
    const handleShowModal = () => setShowManualTimeModal(true);

    useEffect(() => {
        setEndDate(endOfWeek(startDate, { weekStartsOn: 1 }));
    }, [startDate]);

    const weekDays = useMemo(() => {
        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [startDate, endDate]);

    const filteredMembers = useMemo(() => {
        return selectedMemberId
            ? membersData.filter(member => member.id === selectedMemberId)
            : membersData;
    }, [selectedMemberId]);

    const { weeklyData, grandTotalMinutes } = useMemo(() => {
        let grandTotal = 0;
        const processedData = filteredMembers.map(member => {
            const dailyTotals = {};
            let memberTotalMinutes = 0;

            weekDays.forEach(day => {
                const dateKey = format(day, 'yyyy-MM-dd');
                let workedMins = 0;

                // Check for time entry in the member's monthly timesheet data
                if (member.monthlyTimesheet && member.monthlyTimesheet[dateKey]) {
                    workedMins = timeToMinutes(member.monthlyTimesheet[dateKey]);
                }
                
                dailyTotals[dateKey] = {
                    workedMinutes: workedMins,
                    regularMinutes: workedMins, // Assuming all worked time is regular for this summary
                    overtimeMinutes: 0
                };
                memberTotalMinutes += workedMins;
            });

            grandTotal += memberTotalMinutes;
            
            const formattedDailyTotals = {};
            for (const dateKey in dailyTotals) {
                const { workedMinutes, regularMinutes, overtimeMinutes } = dailyTotals[dateKey];

                formattedDailyTotals[dateKey] = {
                    worked: workedMinutes > 0 ? minutesToHoursMinutes(workedMinutes) : "-",
                    regular: regularMinutes > 0 ? minutesToDecimalHours(regularMinutes) : "0",
                    overtime: overtimeMinutes > 0 ? minutesToDecimalHours(overtimeMinutes) : "0",
                    totalDecimal: workedMinutes > 0 ? minutesToDecimalHours(workedMinutes) : "0"
                };
            }
            return { ...member, dailyTotals, formattedDailyTotals, totalMinutesWeekly: memberTotalMinutes };
        });
        return { weeklyData: processedData, grandTotalMinutes: grandTotal };
    }, [filteredMembers, weekDays]);

    const grandTotalFormatted = minutesToHoursMinutes(grandTotalMinutes);
    
    const handleXlsxExport = () => {
        const headers = ['User Name', ...weekDays.map(day => format(day, 'E, dd MMM')), 'Total Hours'];
        const dataForExcel = weeklyData.map(member => {
            const row = { 'User Name': member.name };
            weekDays.forEach(day => {
                const dateKey = format(day, 'yyyy-MM-dd');
                const dayHeader = format(day, 'E, dd MMM');
                row[dayHeader] = member.formattedDailyTotals[dateKey]?.worked || '-';
            });
            const total = minutesToHoursMinutes(member.totalMinutesWeekly);
            row['Total Hours'] = total === "0h 0m" ? "-" : total;
            return row;
        });
        const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { header: headers });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Weekly Timesheet Summary");
        worksheet["!cols"] = [{ wch: 25 }, ...Array(7).fill({ wch: 15 }), { wch: 15 }];
        XLSX.writeFile(workbook, `WeeklyTimesheet_Summary_${format(startDate, 'yyyy-MM-dd')}.xlsx`);
    };

    const handlePdfExport = () => {
        const memberToExport = selectedMemberId
            ? membersData.find(m => m.id === selectedMemberId)
            : (weeklyData.length > 0 ? weeklyData[0] : null); 

        if (!memberToExport) {
            alert("Please select a member or ensure data is loaded to generate PDF.");
            return;
        }

        generateWeeklyTimesheetPDF(memberToExport, weeklyData, startDate, weekDays);
    };

    return (
        <div className="weekly-timesheet-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="m-0">Weekly Timesheet</h2>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary btn-sm" onClick={handleShowModal}>
                        <span className="d-md-none">+</span>
                        <span className="d-none d-md-inline">+ ADD manual Time</span>
                    </button>
                </div>
            </div>

            <TimesheetFilters
                viewMode="weekly"
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
                onXlsxExport={handleXlsxExport}
                onPdfExport={handlePdfExport}
            />

            {isMobile ? (
                 <div className="mobile-summary-list">
                     {weeklyData.map(member => (
                         <div key={member.id} className="mobile-member-card">
                             <div className="mobile-member-info">
                                 <img src={member.avatarUrl} alt={member.name} className="member-avatar" />
                                 <span>{member.name}</span>
                             </div>
                             <div className="mobile-member-total">
                                 <div className="worked-time-tag">{minutesToHoursMinutes(member.totalMinutesWeekly) === "0h 0m" ? "-" : minutesToHoursMinutes(member.totalMinutesWeekly)}</div>
                                 <span className="total-label">Total Hours</span>
                             </div>
                         </div>
                     ))}
                 </div>
            ) : (
                <div className="timesheet-grid-wrapper">
                    <div className="timesheet-grid">
                        <div className="grid-header-cell sticky-col first-col">
                            <div>Members</div>
                            <div className="date-box">{weeklyData.length}</div>
                        </div>
                        {weekDays.map((day, index) => (
                            <div key={index} className="grid-header-cell weekday-header">
                                <div>{format(day, 'E')}</div>
                                <div className="date-box">{format(day, 'dd')}</div>
                            </div>
                        ))}
                        <div className="grid-header-cell sticky-col last-col">
                            <div>Total</div>
                            <div className="grand-total-box">{grandTotalFormatted === "0h 0m" ? "-" : grandTotalFormatted}</div>
                        </div>
                        {weeklyData.map(member => (
                            <React.Fragment key={member.id}>
                                <div className="grid-cell member-cell sticky-col first-col">
                                    <img src={member.avatarUrl} alt={member.name} className="member-avatar" />
                                    <span>{member.name}</span>
                                </div>
                                {weekDays.map((day, index) => (
                                    <div key={index} className="grid-cell time-cell">
                                        <div className="worked-time">{member.formattedDailyTotals[format(day, 'yyyy-MM-dd')]?.worked}</div>
                                    </div>
                                ))}
                                <div className="grid-cell total-cell sticky-col last-col">
                                    <div className="worked-time">{minutesToHoursMinutes(member.totalMinutesWeekly) === "0h 0m" ? "-" : minutesToHoursMinutes(member.totalMinutesWeekly)}</div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                    <div style={{ height: '1.5rem' }} />
                </div>
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

export default WeeklyTimesheet;