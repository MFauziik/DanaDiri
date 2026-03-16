# 💰 DanaDiri

**DanaDiri** adalah aplikasi web pencatatan keuangan pribadi yang membantu pengguna mengelola pemasukan, pengeluaran, dan target tabungan secara terstruktur.  
Aplikasi ini dibuat menggunakan arsitektur **Fullstack Web Development** dengan integrasi **Frontend dan Backend melalui RESTful API**.

DanaDiri bertujuan membantu pengguna memahami kondisi keuangan mereka, mengontrol pengeluaran, serta merencanakan keuangan dengan lebih baik.

---

# 🚀 Fitur Utama

### 🔐 Autentikasi Pengguna
- Register akun
- Login menggunakan JWT
- Logout
- Proteksi endpoint menggunakan authentication middleware

### 📊 Dashboard Keuangan
- Ringkasan total pemasukan
- Ringkasan total pengeluaran
- Saldo saat ini
- Grafik pengeluaran berdasarkan kategori

### 💳 Manajemen Transaksi
- Menambahkan transaksi pemasukan
- Menambahkan transaksi pengeluaran
- Mengedit transaksi
- Menghapus transaksi
- Menyimpan kategori transaksi, deskripsi, dan tanggal

### 🎯 Target Tabungan (Saving Goals)
- Membuat target tabungan
- Menentukan jumlah target
- Menentukan deadline
- Menambahkan dana ke target
- Progress bar pencapaian target
- Status goal (aktif / selesai)

### 💵 Format Mata Uang
- Semua nilai uang diformat dalam **Rupiah (Rp)**

---

# 🏗️ Arsitektur Sistem

DanaDiri menggunakan arsitektur **Fullstack Web Application** dengan komunikasi antara frontend dan backend menggunakan **RESTful API**.

Frontend (React + Vite) │ │ Axios HTTP Request ▼ Backend (Node.js + Express) │ ▼ Database (MongoDB)

---

# 🧰 Tech Stack

## Frontend
- React (Vite)
- Tailwind CSS
- Axios
- Chart.js
- React Router DOM

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- CORS
- dotenv

## Tools
- Git & GitHub
- Postman (API testing)

---

# 📂 Struktur Proyek

danadiri/ │ ├── backend/ │   ├── src/ │   │   ├── config/ │   │   ├── controllers/ │   │   ├── middleware/ │   │   ├── models/ │   │   ├── routes/ │   │   ├── utils/ │   │   └── app.js │   └── server.js │ ├── frontend/ │   ├── src/ │   │   ├── pages/ │   │   ├── components/ │   │   ├── services/ │   │   ├── utils/ │   │   └── assets/ │   └── index.html │ └── README.md

---

# 🔗 API Endpoint

### Authentication

| Method | Endpoint | Description |
|------|------|------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile |

### Transactions

| Method | Endpoint | Description |
|------|------|------|
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Create transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| GET | `/api/transactions/summary` | Get transaction summary |

### Goals

| Method | Endpoint | Description |
|------|------|------|
| GET | `/api/goals` | Get all goals |
| POST | `/api/goals` | Create goal |
| PUT | `/api/goals/:id` | Update goal |
| DELETE | `/api/goals/:id` | Delete goal |
| PUT | `/api/goals/:id/add-funds` | Add funds to goal |
| GET | `/api/goals/summary` | Goals summary |

---

# ⚙️ Cara Menjalankan Proyek

## 1️⃣ Clone Repository

```bash
git clone https://github.com/username/danadiri.git
cd danadiri


---

2️⃣ Setup Backend

cd backend
npm install

Buat file .env

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

Jalankan backend

npm run dev


---

3️⃣ Setup Frontend

cd frontend
npm install

Jalankan frontend

npm run dev


---

👥 Tim Pengembang

Proyek ini dikembangkan sebagai Capstone Project oleh tim developer.

Kontributor:

Frontend Developer

Backend Developer

Project Manager



---

📌 Roadmap Pengembangan

Fitur yang direncanakan untuk pengembangan selanjutnya:

Budget Planning

Export laporan keuangan

Dark Mode

Kategori transaksi custom

Notifikasi pengeluaran

Statistik keuangan bulanan



---

📄 Lisensi

Project ini dibuat untuk tujuan pembelajaran dan pengembangan proyek capstone.


---

⭐ Kontribusi

Jika ingin berkontribusi:

1. Fork repository


2. Buat branch baru


3. Commit perubahan


4. Buat Pull Request




---

DanaDiri — Kelola keuanganmu dengan lebih cerdas.

---

💡 Kalau kamu mau, aku juga bisa buatkan **README versi yang jauh lebih keren seperti proyek GitHub profesional**, misalnya dengan:

- **Preview UI**
- **Architecture Diagram**
- **Tech stack badge**
- **Screenshots aplikasi**
- **Deployment link**
- **API documentation section**
