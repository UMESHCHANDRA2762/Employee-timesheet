import React, { useState, useMemo, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/DailyTimesheet.css";
import "../styles/IdleTime.css";
import "../styles/WeeklyTimesheet.css";

import TimesheetFilters from "./TimesheetFilters";
import { membersData, projectsData, tasksData, organizationsData } from "./data";
import WeeklyPDFGenerator from "./WeeklyPDFGenerator"; 

import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';
import * as XLSX from 'xlsx';

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

const WeeklyTimesheet = () => {
  const isMobile = useIsMobile();
  
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("org-1");
  const [startDate, setStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [endDate, setEndDate] = useState(endOfWeek(new Date(), { weekStartsOn: 1 }));

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
        dailyTotals[format(day, 'yyyy-MM-dd')] = { workedMinutes: 0 };
      });

      member.timeEntries.forEach(entry => {
        const entryDate = weekDays[Math.floor(Math.random() * weekDays.length)];
        const formattedEntryDate = format(entryDate, 'yyyy-MM-dd');
        const entryTotalMinutes = timeToMinutes(entry.total);
        
        if (dailyTotals[formattedEntryDate]) {
          dailyTotals[formattedEntryDate].workedMinutes += entryTotalMinutes;
        }
        memberTotalMinutes += entryTotalMinutes;
      });

      grandTotal += memberTotalMinutes;

      const formattedDailyTotals = {};
      for (const dateKey in dailyTotals) {
        const workedMins = dailyTotals[dateKey].workedMinutes;
        formattedDailyTotals[dateKey] = {
            worked: workedMins > 0 ? minutesToHoursMinutes(workedMins) : "-",
        };
      }

      return {
        ...member,
        dailyTotals,
        formattedDailyTotals,
        totalMinutesWeekly: memberTotalMinutes,
      };
    });

    return { weeklyData: processedData, grandTotalMinutes: grandTotal };
  }, [filteredMembers, weekDays]);

  const grandTotalFormatted = minutesToHoursMinutes(grandTotalMinutes);
  
  const handleXlsxExport = () => {
    const headers = [
      'User Name', ...weekDays.map(day => format(day, 'E, dd MMM')), 'Total Hours'
    ];
    const dataForExcel = weeklyData.map(member => {
      const row = {};
      row['User Name'] = member.name;
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
    const columnWidths = [
        { wch: 25 }, ...Array(7).fill({ wch: 15 }), { wch: 15 }
    ];
    worksheet["!cols"] = columnWidths;
    XLSX.writeFile(workbook, `WeeklyTimesheet_Summary_${format(startDate, 'yyyy-MM-dd')}.xlsx`);
  };

  return (
    <div className="weekly-timesheet-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">Weekly Timesheet</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={handleXlsxExport}>Export Excel</button>
          <WeeklyPDFGenerator 
            weeklyData={weeklyData}
            weekDays={weekDays}
            startDate={startDate}
          />
          <button className="btn btn-primary">+ ADD manual Time</button>
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
        endDate={endDate}
        setEndDate={setEndDate}
        selectedOrganizationId={selectedOrganizationId}
        setSelectedOrganizationId={setSelectedOrganizationId}
      />

      {isMobile ? (
        <div className="mobile-summary-list">
          {weeklyData.map(member => {
            const totalTime = minutesToHoursMinutes(member.totalMinutesWeekly);
            return (
                <div key={member.id} className="mobile-member-card">
                    <div className="mobile-member-info">
                        <img src={`https://placehold.co/32x32/EBF4FF/76A9FA?text=${member.avatarInitials}`} alt={member.name} className="member-avatar" />
                        <span>{member.name}</span>
                    </div>
                    <div className="mobile-member-total">
                        <div className="worked-time-tag">{totalTime === "0h 0m" ? "-" : totalTime}</div>
                        <span className="total-label">Total Hours</span>
                    </div>
                </div>
            )
          })}
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
                    <img src={`https://placehold.co/32x32/EBF4FF/76A9FA?text=${member.avatarInitials}`} alt={member.name} className="member-avatar" />
                    <span>{member.name}</span>
                </div>
                {weekDays.map((day, index) => {
                  const dailyKey = format(day, 'yyyy-MM-dd');
                  const worked = member.formattedDailyTotals[dailyKey]?.worked;
                  return (
                    <div key={index} className="grid-cell time-cell">
                      <div className="worked-time">{worked}</div>
                    </div>
                  );
                })}
                <div className="grid-cell total-cell sticky-col last-col">
                    <div className="worked-time">{minutesToHoursMinutes(member.totalMinutesWeekly) === "0h 0m" ? "-" : minutesToHoursMinutes(member.totalMinutesWeekly)}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
          <div style={{ height: '1.5rem' }} />
        </div>
      )}
    </div>
  );
};

export default WeeklyTimesheet;
