// Format angka ke format Rupiah
export const formatRupiah = (angka) => {
  if (!angka && angka !== 0) return '';
  
  // Pastikan angka adalah number
  const number = typeof angka === 'string' ? parseFloat(angka) : angka;
  
  // Format dengan pemisah ribuan
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

// Parse string Rupiah ke number
export const parseRupiah = (rupiahString) => {
  if (!rupiahString) return 0;
  
  // Hapus semua karakter non-digit
  const number = parseInt(rupiahString.replace(/[^0-9]/g, ''));
  return isNaN(number) ? 0 : number;
};

// Format angka ke string tanpa simbol (untuk input)
export const formatNumber = (angka) => {
  if (!angka && angka !== 0) return '';
  
  const number = typeof angka === 'string' ? parseFloat(angka) : angka;
  return new Intl.NumberFormat('id-ID').format(number);
};