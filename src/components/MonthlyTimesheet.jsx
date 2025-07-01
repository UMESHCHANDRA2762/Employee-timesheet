import React, { useState } from 'react';
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, addDays, getDate, getDaysInMonth
} from 'date-fns';
import * as XLSX from 'xlsx';

import TimesheetFilters from './TimesheetFilters';
import generateMonthlyPDF from './PdfGenerators/MonthlyTimesheetPDFGenerator';
import AddManualTimeModal from './AddManualTimeModal';
import { projectsData, tasksData, membersData, organizationsData } from './data';
import '../styles/MonthlyTimesheet.css';

const MonthlyTimesheet = () => {
  const [selectedMemberId, setSelectedMemberId] = useState(1);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showManualTimeModal, setShowManualTimeModal] = useState(false);

  const selectedMemberData = membersData.find(member => member.id === selectedMemberId);
  const monthlyData = selectedMemberData?.monthlyTimesheet;

  const handleCloseModal = () => setShowManualTimeModal(false);
  const handleShowModal = () => setShowManualTimeModal(true);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handlePdfExport = () => {
    if (!selectedMemberData) {
      alert("Please select a member to export.");
      return;
    }
    generateMonthlyPDF(selectedMemberData, monthlyData, currentMonth);
  };

  const handleXlsxExport = () => {
    if (!selectedMemberData || !monthlyData) {
      alert("No data available for the selected member to export.");
      return;
    }

    const daysInMonth = getDaysInMonth(currentMonth);
    const dataForExcel = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const dateKey = format(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i), 'yyyy-MM-dd');
      dataForExcel.push({
        'Date': format(new Date(dateKey), 'dd-MM-yyyy'),
        'Total Hours': monthlyData[dateKey] || '0h 0m'
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Timesheet");

    worksheet["!cols"] = [{ wch: 15 }, { wch: 15 }];

    const fileName = `MonthlyTimesheet_${selectedMemberData.name.replace(' ', '_')}_${format(currentMonth, 'MMMM_yyyy')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const weekHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Total"];
    const rows = [];
    let day = startDate;
    let grandTotalHours = 0;
    let grandTotalMinutes = 0;

    while (day <= endDate) {
      const weekRow = [];
      let weeklyHours = 0;
      let weeklyMinutes = 0;

      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'yyyy-MM-dd');
        const dayHours = monthlyData ? monthlyData[formattedDate] : null;
        const isCurrentMonth = day.getMonth() === currentMonth.getMonth();

        if (isCurrentMonth && dayHours) {
          const parts = dayHours.match(/(\d+)\s*h\s*(\d*)\s*m/);
          if (parts) {
            const h = parseInt(parts[1] || 0, 10);
            const m = parseInt(parts[2] || 0, 10);
            weeklyHours += h;
            weeklyMinutes += m;
            grandTotalHours += h;
            grandTotalMinutes += m;
          }
        }

        weekRow.push(
          <div key={formattedDate} className={`day-cell ${!isCurrentMonth ? 'day-cell--disabled' : ''}`}>
            <div className="day-date">{getDate(day)}</div>
            {isCurrentMonth && dayHours && <div className="day-hours">{dayHours}</div>}
          </div>
        );
        day = addDays(day, 1);
      }

      weeklyHours += Math.floor(weeklyMinutes / 60);
      weeklyMinutes %= 60;
      const weeklyTotal = weeklyHours > 0 || weeklyMinutes > 0 ? `${weeklyHours}h ${weeklyMinutes}m` : "-";

      weekRow.push(
        <div key={`total-${day.toString()}`} className="day-cell day-cell--total">
          <div className="total-hours">{weeklyTotal}</div>
        </div>
      );

      rows.push(<div className="monthly-grid week-row" key={day.toString()}>{weekRow}</div>);
    }

    grandTotalHours += Math.floor(grandTotalMinutes / 60);
    grandTotalMinutes %= 60;
    const grandTotal = grandTotalHours > 0 || grandTotalMinutes > 0 ? `${grandTotalHours}h ${grandTotalMinutes}m` : "0h 0m";

    const calendarGrid = (
      <div>
        <div className="monthly-grid week-header-grid">
          {weekHeaders.map(header => <div key={header} className="week-day-header">{header}</div>)}
        </div>
        {rows}
      </div>
    );

    return { calendar: calendarGrid, grandTotal: grandTotal };
  };

  const { calendar, grandTotal } = renderCalendar();

  const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
    </svg>
  );

  return (
    <div className="p-4 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">Monthly Timesheet</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-primary btn-sm" onClick={handleShowModal}>
            <span className="d-md-none">+</span>
            <span className="d-none d-md-inline">+ ADD manual Time</span>
          </button>
        </div>
      </div>

      <TimesheetFilters
        viewMode="monthly"
        projectsData={projectsData}
        tasksData={tasksData}
        membersData={membersData}
        organizationsData={organizationsData}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        selectedMemberId={selectedMemberId}
        setSelectedMemberId={setSelectedMemberId}
        onXlsxExport={handleXlsxExport}
        onPdfExport={handlePdfExport}
      />

      <div className="card mt-4 border-0">
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center">
            {/* CORRECTED CLASSNAME IS HERE */}
            <div className="total-hours-badge">
              <span>Total Hour: </span>
              <span>{grandTotal}</span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-teal rounded-circle" onClick={handlePrevMonth}>
                <ChevronLeftIcon />
              </button>
              <span className="fw-semibold text-center mx-2" style={{minWidth: '130px'}}>
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <button className="btn btn-teal rounded-circle" onClick={handleNextMonth}>
                <ChevronRightIcon />
              </button>
            </div>
          </div>

          <div className="mt-4">
            {monthlyData ? calendar : (
              <div className="text-center p-5">
                <p>No monthly timesheet data available for the selected member.</p>
              </div>
            )}
          </div>
        </div>
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

export default MonthlyTimesheet;