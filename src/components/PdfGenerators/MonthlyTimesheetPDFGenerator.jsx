import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format, getDaysInMonth } from 'date-fns';

const generateMonthlyPDF = (member, monthData, currentMonth) => {
  if (!member) {
    alert("No member selected. Cannot generate PDF.");
    return;
  }

  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 14;
  let cursorY = margin;

  autoTable(doc, {
    startY: cursorY,
    theme: 'grid',
    body: [
      [
        { content: 'Employee Name:', styles: { fontStyle: 'bold' } }, member.name,
        { content: 'Title:', styles: { fontStyle: 'bold' } }, member.title || '',
      ],
      [
        { content: 'Manager Name:', styles: { fontStyle: 'bold' } }, member.managerName || '',
        { content: 'Month:', styles: { fontStyle: 'bold' } }, format(currentMonth, 'MMMM, yyyy'),
      ],
      [
        { content: 'Hourly Rate:', styles: { fontStyle: 'bold' } }, member.hourlyRate || 'N/A',
        { content: 'Overtime Rate:', styles: { fontStyle: 'bold' } }, member.overtimeRate || 'N/A',
      ],
    ],
    styles: { fontSize: 9, cellPadding: 2 },
  });
  cursorY = doc.lastAutoTable.finalY + 8;

  const daysInMonth = getDaysInMonth(currentMonth);
  const tableBody = [];
  let totalMinutes = 0;

  for (let i = 1; i <= 31; i++) {
    let dateSuffix = 'th';
    if (i === 1 || i === 21 || i === 31) dateSuffix = 'st';
    else if (i === 2 || i === 22) dateSuffix = 'nd';
    else if (i === 3 || i === 23) dateSuffix = 'rd';

    let hoursEntry = '0';
    if (i <= daysInMonth) {
      const dateKey = format(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i), 'yyyy-MM-dd');
      const entry = monthData ? monthData[dateKey] : null;
      if (entry) {
        const parts = entry.match(/(\d+)\s*h\s*(\d*)\s*m/);
        if (parts) {
            const h = parseInt(parts[1] || 0, 10);
            const m = parseInt(parts[2] || 0, 10);
            totalMinutes += (h * 60) + m;
            hoursEntry = `${h}h ${m}m`;
        }
      }
    }
    
    tableBody.push([
      i <= daysInMonth ? `${i}${dateSuffix}` : '',
      '', '', '', '', '', '',
      // Corrected typo here from daysInMouth to daysInMonth
      i <= daysInMonth ? hoursEntry : ''
    ]);
  }
  
  autoTable(doc, {
    startY: cursorY,
    theme: 'grid',
    head: [['Date', 'Start Time', 'Lunch Start', 'Lunch End', 'End Time', 'Regular Hours', 'Overtime Hours', 'Total Hours']],
    body: tableBody,
    headStyles: { fillColor: [236, 240, 252], textColor: [0, 0, 0], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 1.5, halign: 'center' },
    columnStyles: { 0: { halign: 'left' } }
  });
  cursorY = doc.lastAutoTable.finalY;

  const finalHours = Math.floor(totalMinutes / 60);

  autoTable(doc, {
    startY: cursorY,
    theme: 'grid',
    body: [
      ['Total Time', '', '', finalHours],
      ['Total Pay', '$ -', '$ -', '$ -']
    ],
    styles: { fontSize: 8, fontStyle: 'bold', cellPadding: 1.5, halign: 'right' },
    columnStyles: {
        0: { halign: 'right' },
        3: { halign: 'center' }
    }
  });
  cursorY = doc.lastAutoTable.finalY + 20;

  const signatureX = margin;
  const signatureLabelOffset = 2;
  const signatureLineStartOffset = 40;
  const signatureLineLength = 120;
  const dateX = pageWidth - margin - 60;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  doc.text('Employee Signature:', signatureX, cursorY);
  doc.line(signatureX + signatureLineStartOffset, cursorY + signatureLabelOffset, signatureX + signatureLineStartOffset + signatureLineLength, cursorY + signatureLabelOffset);
  doc.text('Date:', dateX, cursorY);
  doc.line(dateX + 12, cursorY + signatureLabelOffset, dateX + 60, cursorY + signatureLabelOffset);
  
  cursorY += 15;

  doc.text('Manager Signature:', signatureX, cursorY);
  doc.line(signatureX + signatureLineStartOffset, cursorY + signatureLabelOffset, signatureX + signatureLineStartOffset + signatureLineLength, cursorY + signatureLabelOffset);
  doc.text('Date:', dateX, cursorY);
  doc.line(dateX + 12, cursorY + signatureLabelOffset, dateX + 60, cursorY + signatureLabelOffset);

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Powered By https://facelove.com/", pageWidth - margin, pageHeight - 10, { align: 'right' });

  doc.save(`MonthlyTimesheet_${member.name.replace(' ', '_')}_${format(currentMonth, 'MMMM_yyyy')}.pdf`);
};

export default generateMonthlyPDF;