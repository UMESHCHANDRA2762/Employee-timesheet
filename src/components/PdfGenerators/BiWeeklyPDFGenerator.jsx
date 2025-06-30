// src/components/PdfGenerators/BiWeeklyPDFGenerator.js
import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format, addDays } from 'date-fns';

// Helper to parse "X h Y m" strings into total minutes
const parseTotalHours = (hoursString) => {
    if (!hoursString || typeof hoursString !== 'string') return 0;
    const hourMatch = hoursString.match(/(\d+)\s*h/);
    const minuteMatch = hoursString.match(/(\d+)\s*m/);
    const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
    const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;
    return (hours * 60) + minutes;
};

// Helper to convert minutes to a decimal hour string (e.g., "113.3")
const minutesToDecimalHours = (totalMinutes) => {
    return (totalMinutes / 60).toFixed(1);
};


const BiWeeklyPDFGenerator = ({ selectedMember, biWeeklyData, startDate, endDate, onDownload }) => {
    const handleGeneratePdf = (e) => {
        e.preventDefault();

        if (!selectedMember || !biWeeklyData) {
            alert("Data not available to generate PDF.");
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
                    { content: 'Employee Name:', styles: { fontStyle: 'bold' } }, selectedMember.name,
                    { content: 'Title:', styles: { fontStyle: 'bold' } }, selectedMember.title || '',
                ],
                [
                    { content: 'Manager Name:', styles: { fontStyle: 'bold' } }, selectedMember.managerName,
                    { content: 'Period:', styles: { fontStyle: 'bold' } }, 
                    `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`,
                ],
                [
                    { content: 'Hourly Rate:', styles: { fontStyle: 'bold' } }, `$${selectedMember.hourlyRate || 0}`,
                    { content: 'Overtime Rate:', styles: { fontStyle: 'bold' } }, `$${selectedMember.overtimeRate || 0}`,
                ],
            ],
            styles: { fontSize: 9, cellPadding: 2 },
        });
        cursorY = doc.lastAutoTable.finalY + 10;

        // --- 2. Main Timesheet Table and Totals Footer ---
        const allDaysData = [...biWeeklyData.week1.days, ...biWeeklyData.week2.days];
        const dailyRows = [];
        for (let i = 0; i < 14; i++) {
            const currentDay = addDays(startDate, i);
            const dayData = allDaysData[i];
            const hoursValue = dayData ? dayData.hours : "-";
            // Note: Start/End/Regular/Overtime data is not available in this data model.
            dailyRows.push([
                format(currentDay, 'M/d/yyyy'),
                format(currentDay, 'EEEE'),
                "", "", "", "", "", "", // Empty columns for unavailable data
                hoursValue,
            ]);
        }

        // Calculate totals dynamically
        const totalMinutes = parseTotalHours(biWeeklyData.totalHours);
        const totalHoursDecimal = minutesToDecimalHours(totalMinutes);
        const totalPay = ((totalMinutes / 60) * (selectedMember.hourlyRate || 0)).toFixed(2);
        
        // Define the table footer content
        const tableFooter = [
            [
                { content: 'Total Time', colSpan: 6, styles: { halign: 'right', fontStyle: 'bold' } },
                { content: totalHoursDecimal, styles: { halign: 'center' } }, // Regular
                { content: '0.0', styles: { halign: 'center' } },             // Overtime
                { content: totalHoursDecimal, styles: { halign: 'center', fontStyle: 'bold' } }  // Total
            ],
            [
                { content: 'Total Pay', colSpan: 6, styles: { halign: 'right', fontStyle: 'bold' } },
                { content: `$${totalPay}`, styles: { halign: 'center' } },
                { content: '$0.00', styles: { halign: 'center' } },
                { content: `$${totalPay}`, styles: { halign: 'center', fontStyle: 'bold' } }
            ]
        ];

        autoTable(doc, {
            startY: cursorY,
            head: [["Date", "Day", "Start Time", "Lunch Start", "Lunch End", "End Time", "Regular", "Overtime", "Total"]],
            body: dailyRows,
            foot: tableFooter, // Use the 'foot' property for a reliable summary
            theme: 'grid',
            headStyles: { fillColor: [189, 215, 238], textColor: 0, fontStyle: 'bold', fontSize: 8.5 },
            footStyles: { fillColor: [232, 232, 232], textColor: 0, fontStyle: 'bold', fontSize: 8 },
            styles: { fontSize: 8, cellPadding: 2, textColor: 0 },
            columnStyles: { 8: { halign: 'center', fontStyle: 'bold' } }
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
        const fileName = `BiWeeklyTimesheet_${selectedMember.name.replace(" ", "_")}_${format(startDate, 'yyyy-MM-dd')}.pdf`;
        doc.save(fileName);
        
        if(onDownload) {
            onDownload();
        }
    };

    return (
        <a className="dropdown-item" href="#" onClick={handleGeneratePdf}>
            <i className="bi bi-file-earmark-pdf-fill me-2 text-danger"></i>
            PDF
        </a>
    );
};

export default BiWeeklyPDFGenerator;