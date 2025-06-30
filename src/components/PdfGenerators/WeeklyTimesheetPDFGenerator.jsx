// src/components/PdfGenerators/WeeklyTimesheetPDFGenerator.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

const minutesToDecimalHours = (totalMinutes) => {
    return (totalMinutes / 60).toFixed(1);
};

const generateWeeklyTimesheetPDF = (selectedMember, weeklyData, startDate, weekDays) => {
    const memberForPdf = selectedMember;
    if (!memberForPdf) {
        alert("No member data available to generate PDF.");
        return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 14;
    let cursorY = margin;

    // --- 1. Header Section ---
    autoTable(doc, {
        startY: cursorY,
        theme: 'grid',
        body: [
            [
                { content: 'Employee Name:', styles: { fontStyle: 'bold' } }, memberForPdf.name,
                { content: 'Title:', styles: { fontStyle: 'bold' } }, memberForPdf.title || '',
            ],
            [
                { content: 'Manager Name:', styles: { fontStyle: 'bold' } }, memberForPdf.managerName,
                { content: 'Week Of:', styles: { fontStyle: 'bold' } }, format(startDate, 'M/d/yyyy'),
            ],
            [
                { content: 'Hourly Rate:', styles: { fontStyle: 'bold' } }, `$${memberForPdf.hourlyRate || 0}`,
                { content: 'Overtime Rate:', styles: { fontStyle: 'bold' } }, `$${memberForPdf.overtimeRate || 0}`,
            ],
        ],
        styles: { fontSize: 9, cellPadding: 2 },
    });
    cursorY = doc.lastAutoTable.finalY + 10;

    // --- 2. Main Timesheet Table & Totals Footer ---
    const currentMemberData = weeklyData.find(m => m.id === memberForPdf.id);
    const dailyRows = weekDays.map(day => {
        const dateKey = format(day, 'yyyy-MM-dd');
        const dayTotals = currentMemberData?.formattedDailyTotals[dateKey] || { regular: "0", overtime: "0", totalDecimal: "0" };
        return [
            format(day, 'M/d/yyyy'),
            format(day, 'EEEE'),
            "", "", "", "", // Start, Lunch, End times are not available
            dayTotals.regular,
            dayTotals.overtime,
            dayTotals.totalDecimal,
        ];
    });

    // Calculate totals dynamically
    let totalRegularMinutes = 0;
    let totalOvertimeMinutes = 0;
    if (currentMemberData && currentMemberData.dailyTotals) {
        Object.values(currentMemberData.dailyTotals).forEach(day => {
            totalRegularMinutes += day.regularMinutes;
            totalOvertimeMinutes += day.overtimeMinutes;
        });
    }

    const totalRegularPay = (totalRegularMinutes / 60 * (memberForPdf.hourlyRate || 0)).toFixed(2);
    const totalOvertimePay = (totalOvertimeMinutes / 60 * (memberForPdf.overtimeRate || 0)).toFixed(2);
    const grandTotalPay = (parseFloat(totalRegularPay) + parseFloat(totalOvertimePay)).toFixed(2);
    
    // Define the table footer using the calculated totals
    const tableFooter = [
        [
            { content: 'Total Time', colSpan: 6, styles: { halign: 'right', fontStyle: 'bold' } },
            { content: minutesToDecimalHours(totalRegularMinutes), styles: { halign: 'center' } },
            { content: minutesToDecimalHours(totalOvertimeMinutes), styles: { halign: 'center' } },
            { content: minutesToDecimalHours(totalRegularMinutes + totalOvertimeMinutes), styles: { halign: 'center', fontStyle: 'bold' } },
        ],
        [
            { content: 'Total Pay', colSpan: 6, styles: { halign: 'right', fontStyle: 'bold' } },
            { content: `$${totalRegularPay}`, styles: { halign: 'center' } },
            { content: `$${totalOvertimePay}`, styles: { halign: 'center' } },
            { content: `$${grandTotalPay}`, styles: { halign: 'center', fontStyle: 'bold' } },
        ]
    ];

    autoTable(doc, {
        startY: cursorY,
        head: [["Date", "Day", "Start Time", "Lunch Start", "Lunch End", "End Time", "Regular Hours", "Overtime Hours", "Total Hours"]],
        body: dailyRows,
        foot: tableFooter, // Use the 'foot' property for a reliable, aligned summary
        theme: 'grid',
        headStyles: { fillColor: [189, 215, 238], textColor: 0, fontStyle: 'bold', fontSize: 8.5 },
        footStyles: { fillColor: [232, 232, 232], textColor: 0, fontStyle: 'bold', fontSize: 8 },
        styles: { fontSize: 8, cellPadding: 2, textColor: 0 },
        columnStyles: {
            6: { halign: 'center' },
            7: { halign: 'center' },
            8: { halign: 'center', fontStyle: 'bold' },
        }
    });
    cursorY = doc.lastAutoTable.finalY + 20;
    
    // --- 3. Signature Section ---
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const signatureLineLength = 70;
    const signatureTextOffset = 4;
    
    doc.text("Employee Signature:", margin, cursorY);
    doc.line(margin + 45, cursorY + signatureTextOffset, margin + 45 + signatureLineLength, cursorY + signatureTextOffset);
    doc.text("Date:", margin + signatureLineLength + 48, cursorY);
    doc.line(margin + signatureLineLength + 58, cursorY + signatureTextOffset, margin + signatureLineLength + 58 + signatureLineLength, cursorY + signatureTextOffset);
    
    cursorY += 15;

    doc.text("Manager Signature:", margin, cursorY);
    doc.line(margin + 45, cursorY + signatureTextOffset, margin + 45 + signatureLineLength, cursorY + signatureTextOffset);
    doc.text("Date:", margin + signatureLineLength + 48, cursorY);
    doc.line(margin + signatureLineLength + 58, cursorY + signatureTextOffset, margin + signatureLineLength + 58 + signatureLineLength, cursorY + signatureTextOffset);

    // --- 4. Footer ---
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Powered By https://applaye.com/", pageWidth - margin, doc.internal.pageSize.height - 10, { align: 'right' });

    // --- Save the document ---
    doc.save(`WeeklyTimesheet_${memberForPdf.name.replace(" ", "_")}_${format(startDate, 'yyyy-MM-dd')}.pdf`);
};

export default generateWeeklyTimesheetPDF;