import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// Filter helper
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

// Filter bulan
export const filterByMonth = (transactions, month, year) => {
  return transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });
};

// Hitung total
const calculateTotal = (data) => {
  const income = data.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = data.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  return { income, expense, balance: income - expense };
};

// Export PDF
export const exportToPDF = (transactions, title = 'Laporan Keuangan - DanaDiri') => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(47, 109, 246); // Primary blue
  doc.text(title, 14, 18);

  const tableData = transactions.map((t) => [
    new Date(t.date).toLocaleDateString('id-ID'),
    t.description || '-',
    t.category,
    t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
    `Rp ${t.amount.toLocaleString('id-ID')}`,
  ]);

  autoTable(doc, {
    head: [['Tanggal', 'Deskripsi', 'Kategori', 'Tipe', 'Jumlah']],
    body: tableData,
    startY: 25,
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: [47, 109, 246], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [247, 248, 252] },
    didParseCell: function (data) {
      if (data.column.index === 3 && data.section === 'body') {
        if (data.cell.raw === 'Pemasukan') {
          data.cell.styles.textColor = [18, 183, 106]; // Green
          data.cell.styles.fontStyle = 'bold';
        } else if (data.cell.raw === 'Pengeluaran') {
          data.cell.styles.textColor = [255, 77, 109]; // Red
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  const totals = calculateTotal(transactions);
  const finalY = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text('RINGKASAN LAPORAN', 14, finalY);

  doc.setFontSize(12);
  doc.setTextColor(18, 183, 106); // Green
  doc.text(`Total Pemasukan: Rp ${totals.income.toLocaleString('id-ID')}`, 14, finalY + 8);
  
  doc.setTextColor(255, 77, 109); // Red
  doc.text(`Total Pengeluaran: Rp ${totals.expense.toLocaleString('id-ID')}`, 14, finalY + 14);
  
  doc.setTextColor(47, 109, 246); // Blue
  doc.setFont(undefined, 'bold');
  doc.text(`Sisa Saldo: Rp ${totals.balance.toLocaleString('id-ID')}`, 14, finalY + 22);

  doc.save(`${title.replace(/ /g, '_')}.pdf`);
};

// Export Excel
export const exportToExcel = async (transactions, fileName = 'Laporan_Keuangan_DanaDiri') => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Laporan');

  // 1. Judul Laporan
  worksheet.mergeCells('A1', 'E1');
  const titleRow = worksheet.getCell('A1');
  titleRow.value = `Laporan Keuangan - DanaDiri`;
  titleRow.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FF2F6DF6' } };
  titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

  worksheet.addRow([]); // Baris kosong pengganti spasi

  // 2. Header Tabel
  const headerRow = worksheet.getRow(3);
  headerRow.values = ['Tanggal', 'Deskripsi', 'Kategori', 'Tipe', 'Jumlah'];
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  
  ['A', 'B', 'C', 'D', 'E'].forEach((col) => {
    const cell = headerRow.getCell(col);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F6DF6' } };
    cell.border = {
      top: { style: 'thin' }, left: { style: 'thin' },
      bottom: { style: 'thin' }, right: { style: 'thin' }
    };
  });

  worksheet.columns = [
    { key: 'Tanggal', width: 15 },
    { key: 'Deskripsi', width: 35 },
    { key: 'Kategori', width: 20 },
    { key: 'Tipe', width: 18 },
    { key: 'Jumlah', width: 22 },
  ];

  // 3. Isi Data
  transactions.forEach((t) => {
    const isIncome = t.type === 'income';
    const row = worksheet.addRow({
      Tanggal: new Date(t.date).toLocaleDateString('id-ID'),
      Deskripsi: t.description || '-',
      Kategori: t.category,
      Tipe: isIncome ? 'Pemasukan' : 'Pengeluaran',
      Jumlah: t.amount,
    });

    const tipeCell = row.getCell('D');
    const jumlahCell = row.getCell('E');
    jumlahCell.numFmt = '"Rp"#,##0';

    if (isIncome) {
      tipeCell.font = { color: { argb: 'FF12B76A' }, bold: true };
      jumlahCell.font = { color: { argb: 'FF12B76A' }, bold: true };
    } else {
      tipeCell.font = { color: { argb: 'FFFF4D6D' }, bold: true };
      jumlahCell.font = { color: { argb: 'FFFF4D6D' }, bold: true };
    }
  });

  // 4. Ringkasan
  worksheet.addRow([]);
  
  const addSummary = (label, amount, color) => {
    const row = worksheet.addRow(['', '', '', label, amount]);
    row.getCell('D').font = { bold: true };
    const amtCell = row.getCell('E');
    amtCell.font = { bold: true, color: { argb: color } };
    amtCell.numFmt = '"Rp"#,##0';
  };

  const totals = calculateTotal(transactions);
  addSummary('TOTAL PEMASUKAN', totals.income, 'FF12B76A');
  addSummary('TOTAL PENGELUARAN', totals.expense, 'FFFF4D6D');
  addSummary('SISA SALDO', totals.balance, 'FF2F6DF6');

  // 5. Build File
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${fileName}.xlsx`);
};