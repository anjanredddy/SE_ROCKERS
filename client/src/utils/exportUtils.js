import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = (data, fileName) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export const exportToPDF = (data, columns, fileName) => {
  const doc = new jsPDF();
  doc.autoTable({
    head: [columns.map(col => col.header)],
    body: data.map(row => columns.map(col => row[col.field]))
  });
  doc.save(`${fileName}.pdf`);
};
