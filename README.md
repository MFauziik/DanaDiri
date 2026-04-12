# 💰 DanaDiri

**DanaDiri** adalah aplikasi web pencatatan keuangan pribadi yang membantu pengguna mengelola pemasukan, pengeluaran, transaksi berulang, dan target tabungan secara terstruktur. Dibuat dengan antarmuka yang modern dan responsif untuk memberikan pengalaman pengguna yang premium.

Aplikasi ini dibangun menggunakan arsitektur **MERN Stack (MongoDB, Express.js, React.js, Node.js)** dengan integrasi Frontend dan Backend melalui RESTful API.

---

## 🚀 Fitur Utama

- 🔐 **Autentikasi & Keamanan**: Register, Login, Logout dengan enkripsi password (bcrypt) dan tokenisasi JWT.
- 📊 **Dashboard & Visualisasi Data**: Ringkasan total keuangan (saldo, pemasukan, pengeluaran) dan grafik analitik dengan Chart.js.
- 💳 **Manajemen Transaksi Terpadu**: Catat pemasukan dan pengeluaran. Dilengkapi dengan pagination server-side, custom kategori, dan filter transaksi.
- 🔄 **Transaksi Berulang (Recurring Transactions)**: Penjadwalan otomatis untuk tagihan rutin (harian, mingguan, bulanan, tahunan) di-handle di server menggunakan cron job.
- 🎯 **Target Tabungan (Saving Goals)**: Tentukan target tabungan, kelola setoran dana (add funds), dan pantau progress bar pencapaian target.
- 📸 **Manajemen Profil**: Ganti foto profil dengan fitur upload gambar yang aman menggunakan integrasi **Cloudinary**.
- 📄 **Export Laporan Keuangan**: Unduh laporan pengeluaran & pemasukan secara dinamis ke dalam format **PDF (jsPDF)** dan **Excel (ExcelJS)**.
- 🎨 **UI/UX Premium**: Desain modern, clean, dan layar responsif dengan Tailwind CSS.

---

## 🏗️ Arsitektur Sistem

Frontend (React + Vite)  <─── Axios HTTP Requests ───>  Backend (Node.js + Express)  <───>  Database (MongoDB)  
*(Menyertakan Cloudinary untuk penyimpanan aset gambar secara awan)*

---

## 🧰 Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Charts**: Chart.js & react-chartjs-2
- **Icons**: Lucide React
- **Exporting**: jsPDF, jsPDF-AutoTable, ExcelJS, FileSaver

### Backend
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose ORM
- **Authentication**: JsonWebToken (JWT) & bcryptjs
- **Upload File**: Multer & Cloudinary
- **Cron Jobs**: node-cron (Untuk pemrosesan transaksi berulang)
- **CORS & Environment Variables**: cors, dotenv

---

## 🔗 Struktur API Endpoint Utama

### Authentication & Profile
| Method | Endpoint | Deskripsi |
|------|------|------|
| POST | `/api/auth/register` | Mendaftarkan akun pengguna baru |
| POST | `/api/auth/login` | Login akun pengguna dan mendapatkan JWT |
| POST | `/api/auth/logout` | Logout pengguna |
| GET | `/api/auth/profile` | Mendapatkan data profil pengguna |
| PUT | `/api/auth/profile` | Memperbarui profil (termasuk upload foto ke Cloudinary) |

### Transaksi Reguler
| Method | Endpoint | Deskripsi |
|------|------|------|
| GET | `/api/transactions` | Mengambil seluruh data transaksi (beserta server-side pagination) |
| POST | `/api/transactions` | Menambahkan catatan transaksi baru |
| PUT | `/api/transactions/:id` | Memperbarui nominal, kategori, atau deskripsi transaksi |
| DELETE | `/api/transactions/:id` | Menghapus data transaksi |
| GET | `/api/transactions/summary` | Mendapatkan simpulan dan metrik keuangan untuk Dashboard |

### Transaksi Berulang (Recurring)
| Method | Endpoint | Deskripsi |
|------|------|------|
| GET | `/api/recurring-transactions` | Menampilkan transaksi yang berulang |
| POST | `/api/recurring-transactions` | Menambahkan jadwal transaksi rutin baru |
| PUT | `/api/recurring-transactions/:id` | Memperbarui aturan berulang (mis. ganti jumlah/frekuensi) |
| DELETE| `/api/recurring-transactions/:id`| Menghapus jadwal transaksi berulang |

### Target Tabungan (Goals)
| Method | Endpoint | Deskripsi |
|------|------|------|
| GET | `/api/goals` | Menampilkan seluruh target tabungan |
| POST | `/api/goals` | Membuat target tabungan baru (deadline, alokasi target) |
| PUT | `/api/goals/:id/add-funds` | Menambahkan progres (dana) ke target tabungan |
| PUT | `/api/goals/:id` | Edit detail target tabungan |
| DELETE | `/api/goals/:id` | Menghapus target |

---

## ⚙️ Cara Menjalankan Proyek Secara Lokal

### 1️⃣ Clone Repository
```bash
git clone https://github.com/MFauziik/DanaDiri.git
cd DanaDiri
```

### 2️⃣ Setup Backend
```bash
cd backend
npm install
```

Buat file `.env` pada direktori `backend/` dengan spesifikasi berikut:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<nama-database>
JWT_SECRET=rahasiasuperkuat

# Konfigurasi Cloudinary (Untuk Foto Profil)
CLOUDINARY_CLOUD_NAME=nama_cloud_anda
CLOUDINARY_API_KEY=kunci_api_anda
CLOUDINARY_API_SECRET=rahasia_api_anda
```

Jalankan server backend:
```bash
npm run dev
```
*(Server akan berjalan di `http://localhost:5000`)*

### 3️⃣ Setup Frontend
Buka terminal baru:
```bash
cd frontend
npm install
```

Buat file `.env` pada direktori `frontend/` jika dibutuhkan (opsional jika sudah tersetting proxy di vite):
```env
VITE_API_URL=http://localhost:5000
```

Jalankan server aplikasi frontend:
```bash
npm run dev
```
*(Aplikasi akan berjalan di `http://localhost:5173`)*

---

## 👥 Tim Pengembang
Proyek ini dirancang dan dikembangkan sebagai bagian dari **Capstone Project** oleh Tim Kolaborator. Segala bentuk masukan sangat diapresiasi!

---

## 📄 Lisensi
Proyek ini dibuat untuk tujuan edukasi dan portofolio pengembangan web full-stack. Setiap bagian dari kode ini terbuka untuk dieksplorasi.

---
**DanaDiri** — *Kenal Uang, Kenal Diri* 🚀
