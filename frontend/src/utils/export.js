import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// 🔥 FILTER HELPER
export const filterTransactions = (transactions, filters) => {
  return transactions.filter((t) => {
    const date = new Date(t.date);

    return (
      (!filters.type || t.type === filters.type) &&
      (!filters.startDate || date >= new Date(filters.startDate)) &&
      (!filters.endDate || date <= new Date(filters.endDate)) &&
      (!filters.search ||
        t.description?.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });
};

// 🔥 FILTER BULAN
export const filterByMonth = (transactions, month, year) => {
  return transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });
};

// 🔥 HITUNG TOTAL
const calculateTotal = (data) => {
  return data.reduce((sum, t) => sum + t.amount, 0);
};

// 🔥 EXPORT PDF
export const exportToPDF = (transactions, title = 'Laporan Keuangan') => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(title, 14, 15);

  const tableData = transactions.map((t) => [
    new Date(t.date).toLocaleDateString('id-ID'),
    t.description || '-',
    t.category,
    t.type,
    `Rp ${t.amount.toLocaleString('id-ID')}`,
  ]);

  autoTable(doc, {
    head: [['Tanggal', 'Deskripsi', 'Kategori', 'Tipe', 'Jumlah']],
    body: tableData,
    startY: 20,
  });

  const total = calculateTotal(transactions);

  doc.setFontSize(12);
  doc.text(
    `Total: Rp ${total.toLocaleString('id-ID')}`,
    14,
    doc.lastAutoTable.finalY + 10
  );

  doc.save(`${title}.pdf`);
};

// 🔥 EXPORT EXCEL
export const exportToExcel = (transactions, fileName = 'Laporan') => {
  const data = transactions.map((t) => ({
    Tanggal: new Date(t.date).toLocaleDateString('id-ID'),
    Deskripsi: t.description || '-',
    Kategori: t.category,
    Tipe: t.type,
    Jumlah: t.amount,
  }));

  const total = calculateTotal(transactions);

  data.push({});
  data.push({ Deskripsi: 'TOTAL', Jumlah: total });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, 'Laporan');

  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  saveAs(new Blob([buffer]), `${fileName}.xlsx`);
};