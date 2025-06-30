// src/components/PdfGenerators/TimesheetPDFGenerator.js
import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Helper function to convert 'HH:mm' time to total minutes
const timeToMinutes = (time) => {
    if (!time || !time.includes(':')) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return (hours * 60) + minutes;
};

const TimesheetPDFGenerator = ({ selectedMember, timeEntries, displayDate, onDownload }) => {

    const generatePdf = () => {
        if (!selectedMember) {
            alert("Please select a member first.");
            return;
        }

        const doc = new jsPDF();

        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const margin = 14; 
        let cursorY = 15; 

        // --- Employee Details Table (Now with dynamic data) ---
        const employeeDetails = [
            ["Employee Name:", selectedMember.name, "Date:", displayDate],
            ["Manager Name:", selectedMember.managerName || 'N/A', "Hourly Rate:", `$${selectedMember.hourlyRate}`],
            ["Overtime Rate:", `$${selectedMember.overtimeRate}`, "", ""],
        ];
        autoTable(doc, {
            startY: cursorY,
            body: employeeDetails,
            theme: 'plain',
            styles: { fontSize: 8.5, cellPadding: 1.2, textColor: [0, 0, 0] },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 28 },
                1: { cellWidth: 58 },
                2: { fontStyle: 'bold', cellWidth: 28 },
                3: { cellWidth: 58 }
            },
            margin: { left: margin, right: margin }
        });
        cursorY = doc.lastAutoTable.finalY + 8;

        // --- Main Timesheet Grid Setup ---
        const gridStartX = margin;
        const gridEndX = pageWidth - margin;
        const headerRowHeight = 7;
        const hourRowHeight = 7;
        const hoursInDisplay = 24;
        const gridContentStartY = cursorY + headerRowHeight;
        const columnHeaders = ["Hour", "Project", "Task", "Regular", "Overtime", "Total Time"];
        const colWidths = [18, 42, 42, 18, 18, 18];

        // --- Draw Grid Headers and Vertical Lines ---
        doc.setDrawColor(0);
        doc.setLineWidth(0.2);
        doc.setFillColor(230, 230, 230);
        doc.rect(gridStartX, cursorY, gridEndX - gridStartX, headerRowHeight, 'F');
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);

        let currentX = gridStartX;
        columnHeaders.forEach((header, index) => {
            let xPos = currentX + (colWidths[index] / 2);
            doc.line(currentX, cursorY, currentX, gridContentStartY + (hoursInDisplay * hourRowHeight));
            doc.text(header, xPos, cursorY + headerRowHeight / 2, { align: 'center', baseline: 'middle' });
            currentX += colWidths[index];
        });
        doc.line(currentX, cursorY, currentX, gridContentStartY + (hoursInDisplay * hourRowHeight));
        doc.line(gridStartX, gridContentStartY, gridEndX, gridContentStartY);
        cursorY = gridContentStartY;

        // --- Draw Hourly Rows and DYNAMIC Content ---
        doc.setFontSize(6.5);
        doc.setFont("helvetica", "normal");
        
        let grandTotalMinutes = 0;

        for (let i = 0; i < hoursInDisplay; i++) {
            const y = cursorY + (i * hourRowHeight);
            let hour = i;
            const ampm = hour >= 12 ? 'PM' : 'AM';
            hour = hour % 12;
            hour = hour === 0 ? 12 : hour;
            const timeLabel = `${hour}:00 ${ampm}`;

            doc.line(gridStartX, y, gridEndX, y);
            doc.text(timeLabel, gridStartX + 2, y + hourRowHeight / 2, { baseline: 'middle' });
            
            // Find if any entry starts in this hour
            const entryForThisHour = timeEntries.find(entry => Math.floor(timeToMinutes(entry.startTime) / 60) === i);

            if (entryForThisHour) {
                const entryMinutes = timeToMinutes(entryForThisHour.endTime) - timeToMinutes(entryForThisHour.startTime);
                grandTotalMinutes += entryMinutes;
                const entryHoursDecimal = (entryMinutes / 60).toFixed(2);
                
                let textX = gridStartX + colWidths[0];
                doc.text(entryForThisHour.project, textX + 2, y + hourRowHeight / 2, { baseline: 'middle', maxWidth: colWidths[1] - 4 });
                textX += colWidths[1];
                doc.text(entryForThisHour.task, textX + 2, y + hourRowHeight / 2, { baseline: 'middle', maxWidth: colWidths[2] - 4 });
                textX += colWidths[2];
                doc.text(entryHoursDecimal, textX + (colWidths[3] / 2), y + hourRowHeight / 2, { align: 'center', baseline: 'middle' });
                textX += colWidths[3];
                doc.text("0.00", textX + (colWidths[4] / 2), y + hourRowHeight / 2, { align: 'center', baseline: 'middle' });
                textX += colWidths[4];
                doc.text(entryHoursDecimal, textX + (colWidths[5] / 2), y + hourRowHeight / 2, { align: 'center', baseline: 'middle' });
            }
        }
        doc.line(gridStartX, cursorY + (hoursInDisplay * hourRowHeight), gridEndX, cursorY + (hoursInDisplay * hourRowHeight));
        cursorY += (hoursInDisplay * hourRowHeight);

        // --- Dynamic Totals Section ---
        const grandTotalHoursDecimal = (grandTotalMinutes / 60).toFixed(2);
        const grandTotalPay = (grandTotalHoursDecimal * selectedMember.hourlyRate).toFixed(2);
        
        const totalsRowHeight = 5.5;
        const totalsStartY = cursorY + 5;
        doc.setFontSize(6.5);
        doc.setFont("helvetica", "normal");
        
        const totalColRightX = pageWidth - margin;
        const totalTimeValueX = totalColRightX - colWidths[5] / 2;
        const overtimeValueX = totalColRightX - colWidths[5] - colWidths[4] / 2;
        const regularValueX = totalColRightX - colWidths[5] - colWidths[4] - colWidths[3] / 2;

        doc.text("Total Time", gridStartX + 20, totalsStartY + totalsRowHeight / 2);
        doc.text("Total Pay", gridStartX + 20, totalsStartY + totalsRowHeight + totalsRowHeight / 2);

        doc.line(gridStartX, totalsStartY, gridEndX, totalsStartY); // Top line
        doc.line(regularValueX - colWidths[3]/2, totalsStartY, regularValueX - colWidths[3]/2, totalsStartY + totalsRowHeight * 2);
        doc.line(overtimeValueX - colWidths[4]/2, totalsStartY, overtimeValueX - colWidths[4]/2, totalsStartY + totalsRowHeight * 2);
        doc.line(totalTimeValueX - colWidths[5]/2, totalsStartY, totalTimeValueX - colWidths[5]/2, totalsStartY + totalsRowHeight * 2);
        doc.line(gridEndX, totalsStartY, gridEndX, totalsStartY + totalsRowHeight * 2);
        
        // Dynamic Values
        doc.text(grandTotalHoursDecimal.toString(), regularValueX, totalsStartY + totalsRowHeight / 2, { align: 'center' });
        doc.text("0.00", overtimeValueX, totalsStartY + totalsRowHeight / 2, { align: 'center' });
        doc.text(grandTotalHoursDecimal.toString(), totalTimeValueX, totalsStartY + totalsRowHeight / 2, { align: 'center' });
        
        doc.text(`$ ${grandTotalPay}`, regularValueX, totalsStartY + totalsRowHeight + totalsRowHeight / 2, { align: 'center' });
        doc.text("$ 0.00", overtimeValueX, totalsStartY + totalsRowHeight + totalsRowHeight / 2, { align: 'center' });
        doc.text(`$ ${grandTotalPay}`, totalTimeValueX, totalsStartY + totalsRowHeight + totalsRowHeight / 2, { align: 'center' });

        doc.line(gridStartX, totalsStartY + totalsRowHeight * 2, gridEndX, totalsStartY + totalsRowHeight * 2); // Bottom line
        cursorY = totalsStartY + totalsRowHeight * 2 + 12;
        
        // --- Signature Section ---
        doc.setFontSize(9);
        const signatureLineLength = 55;
        const signatureTextOffset = 3.5;

        doc.text("Employee Signature:", margin, cursorY);
        doc.line(margin + 45, cursorY + signatureTextOffset, margin + 45 + signatureLineLength, cursorY + signatureTextOffset);

        doc.text("Date:", margin + signatureLineLength + 25, cursorY);
        doc.line(margin + signatureLineLength + 35, cursorY + signatureTextOffset, margin + signatureLineLength + 35 + signatureLineLength, cursorY + signatureTextOffset);
        
        cursorY += 18;

        doc.text("Manager Signature:", margin, cursorY);
        doc.line(margin + 45, cursorY + signatureTextOffset, margin + 45 + signatureLineLength, cursorY + signatureTextOffset);

        doc.text("Date:", margin + signatureLineLength + 25, cursorY);
        doc.line(margin + signatureLineLength + 35, cursorY + signatureTextOffset, margin + signatureLineLength + 35 + signatureLineLength, cursorY + signatureTextOffset);
        
        // --- Save PDF ---
        doc.save(`Timesheet_${selectedMember.name.replace(" ", "_")}_${displayDate.replace(/\//g, '-')}.pdf`);

        if (onDownload) {
            onDownload();
        }
    };

    return (
        <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); generatePdf(); }}>
            <i className="bi bi-file-earmark-pdf-fill me-2 text-danger"></i>
            PDF
        </a>
    );
};

export default TimesheetPDFGenerator;