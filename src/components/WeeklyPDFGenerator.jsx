import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Use a direct import
import { format } from 'date-fns';

// Helper Functions
const minutesToHoursMinutes = (totalMinutes) => {
    if (totalMinutes === 0 || !totalMinutes) return "0h 0m";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
};

const minutesToDecimal = (totalMinutes) => {
    if (!totalMinutes) return 0;
    return totalMinutes / 60;
};

const WeeklyPDFGenerator = ({ weeklyData, weekDays, startDate }) => {

    const handleGeneratePdf = () => {
        // FIXED: Wrap entire logic in a try...catch block to display any errors.
        try {
            if (!weeklyData || weeklyData.length === 0) {
                alert("No data available to generate PDF.");
                return;
            }
    
            const doc = new jsPDF();
        
            weeklyData.forEach((member, index) => {
                if (index > 0) {
                    doc.addPage();
                }
    
                // 1. Document Header
                doc.setFont("helvetica", "bold");
                doc.setFontSize(16);
                doc.text("Weekly Timesheet", 105, 15, { align: "center" });
    
                // 2. Employee Details Table
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                const details = [
                    [`Employee Name:`, member.name, `Manager Name:`, member.managerName],
                    [`Title:`, member.title, `Week Of:`, format(startDate, 'MM/dd/yyyy')],
                    [`Hourly Rate:`, `$${member.hourlyRate.toFixed(2)}`, `Overtime Rate:`, `$${member.overtimeRate.toFixed(2)}`]
                ];
                
                autoTable(doc, {
                    startY: 22, body: details, theme: 'plain',
                    styles: { fontSize: 9, cellPadding: 1.5 },
                    columnStyles: { 0: { fontStyle: 'bold' }, 2: { fontStyle: 'bold' } }
                });
                
                // @ts-ignore
                let lastY = doc.lastAutoTable?.finalY || 50;
    
                // 3. Main Data Table
                let totalWeeklyMinutes = 0;
                let totalOvertimeMinutes = 0;
    
                const tableBody = weekDays.map(day => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const workedMinutes = member.dailyTotals[dateKey]?.workedMinutes || 0;
                    totalWeeklyMinutes += workedMinutes;
    
                    let regularMinutes = 0;
                    let overtimeMinutes = 0;
    
                    if (workedMinutes > 480) {
                        regularMinutes = 480;
                        overtimeMinutes = workedMinutes - 480;
                    } else {
                        regularMinutes = workedMinutes;
                    }
                    totalOvertimeMinutes += overtimeMinutes;
    
                    return [
                        format(day, 'MM/dd/yyyy'), format(day, 'dddd'),
                        "", "", "", "",
                        minutesToHoursMinutes(regularMinutes), minutesToHoursMinutes(overtimeMinutes), minutesToHoursMinutes(workedMinutes)
                    ];
                });
    
                autoTable(doc, {
                    head: [['Date', 'Day', 'Start Time', 'Lunch Start', 'Lunch End', 'End Time', 'Regular Hours', 'Overtime Hours', 'Total Hours']],
                    body: tableBody,
                    startY: lastY + 2,
                    headStyles: { fillColor: [34, 49, 63], fontSize: 8 },
                    styles: { halign: 'center', fontSize: 9 }
                });
    
                // @ts-ignore
                lastY = doc.lastAutoTable?.finalY || lastY + 50;
    
                // 4. Summary Table
                const totalPay = (minutesToDecimal(totalWeeklyMinutes - totalOvertimeMinutes) * member.hourlyRate) + 
                                 (minutesToDecimal(totalOvertimeMinutes) * member.overtimeRate);
    
                autoTable(doc, {
                    startY: lastY + 5, theme: 'plain',
                    body: [[`Total Time:`, minutesToHoursMinutes(totalWeeklyMinutes), `Total Pay:`, `$${totalPay.toFixed(2)}`]],
                    styles: { fontSize: 10 },
                    columnStyles: { 0: { fontStyle: 'bold' }, 2: { fontStyle: 'bold' } }
                });
                
                // 5. Signature Section
                // @ts-ignore
                const finalY = doc.lastAutoTable?.finalY || lastY + 20;
                doc.setFontSize(10);
                doc.text("Employee Signature:", 20, finalY + 25);
                doc.line(62, finalY + 25, 110, finalY + 25);
                doc.text("Manager Signature:", 20, finalY + 35);
                doc.line(62, finalY + 35, 110, finalY + 35);
                doc.text("Date:", 120, finalY + 25);
                doc.line(132, finalY + 25, 190, finalY + 25);
                doc.text("Date:", 120, finalY + 35);
                doc.line(132, finalY + 35, 190, finalY + 35);
                
                // 6. Footer
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text("Powered By YourAppName", 105, doc.internal.pageSize.getHeight() - 10, { align: "center" });
            });
            
            doc.save(`Weekly_Timesheet_${format(startDate, 'yyyy-MM-dd')}.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("Could not generate PDF. An error occurred: " + error.message);
        }
    };

    return (
        <button className="btn btn-primary" onClick={handleGeneratePdf}>
            Download PDF
        </button>
    );
};

export default WeeklyPDFGenerator;