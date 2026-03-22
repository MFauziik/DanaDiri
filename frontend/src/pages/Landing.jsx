import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconArrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconWallet = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
    <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
  </svg>
);
const IconChart = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6"  y1="20" x2="6"  y2="14" />
  </svg>
);
const IconShield = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconTarget = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const IconTwitter = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);
const IconFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const startTime = Date.now();
        const tick = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * end));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".fade-in-section");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const problems = [
    {
      img: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80",
      title: "Boros Tanpa Sadar",
      desc: "Pengeluaran kecil yang sering tak terdeteksi bisa menguras tabungan Anda tanpa disadari.",
    },
    {
      img: "https://images.unsplash.com/photo-1554224155-1696413565d3?w=400&q=80",
      title: "Tabungan Stagnan",
      desc: "Tanpa strategi yang tepat, tabungan Anda hanya diam dan tidak berkembang optimal.",
    },
    {
      img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80",
      title: "Bingung Alur Kas",
      desc: "Sulit memahami ke mana uang pergi setiap bulan membuat perencanaan menjadi mustahil.",
    },
  ];

  const solutions = [
    { icon: <IconWallet />, color: "#3B82F6", title: "Pencatatan Transaksi", desc: "Catat setiap transaksi otomatis dan kategorikan pengeluaran dengan cerdas." },
    { icon: <IconTarget />, color: "#8B5CF6", title: "Anggaran Otomatis",    desc: "Buat anggaran bulanan yang realistis berdasarkan pola keuangan Anda." },
    { icon: <IconChart  />, color: "#10B981", title: "Grafik Visual",        desc: "Visualisasi data keuangan yang mudah dipahami dalam satu dashboard." },
    { icon: <IconShield />, color: "#F59E0B", title: "Target Tabungan",      desc: "Tetapkan tujuan finansial dan pantau progresnya secara real-time." },
  ];

  const steps = [
    { num: "1", title: "Buat Akun",        desc: "Daftar gratis dalam 30 detik. Tidak perlu kartu kredit untuk memulai." },
    { num: "2", title: "Catat Transaksi",  desc: "Mulai tambahkan pemasukan dan pengeluaran harian Anda dengan mudah." },
    { num: "3", title: "Lihat Insight",    desc: "Dapatkan analisis mendalam tentang kondisi finansial dan saran pintar." },
  ];

  const statsData = [
    { num: 12000, suffix: "+",     label: "Pengguna Aktif"    },
    { num: 98,    suffix: "%",     label: "Tingkat Kepuasan"  },
    { num: 4500,  suffix: "+",     label: "Transaksi / Hari"  },
    { num: 3,     suffix: " Tahun",label: "Pengalaman"        },
  ];

  return (
    <>
      {/* ── Navbar ── */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <div className="nav-logo">Dana<span>Fit</span></div>
          <ul className="nav-links">
            <li><a href="#masalah">Masalah</a></li>
            <li><a href="#solusi">Solusi</a></li>
            <li><a href="#cara-kerja">Cara Kerja</a></li>
          </ul>
          <button className="nav-cta" onClick={() => navigate("/register")}>
            Mulai Gratis
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-inner">
          {/* Left */}
          <div className="fade-in-section">
            <div className="hero-badge">Platform Keuangan Cerdas</div>
            <h1 className="hero-title">
              Kenal uang,<br />
              <span>Kenal diri.</span>
            </h1>
            <p className="hero-desc">
              Platform keuangan pribadi yang dirancang untuk membantu mahasiswa
              dan profesional muda dalam merencanakan masa depan finansial mereka.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate("/register")}>
                Mulai Sekarang <IconArrow />
              </button>
              <button className="btn-secondary" onClick={() => navigate("/login")}>
                Masuk
              </button>
            </div>
            <div className="hero-trust">
              <div className="hero-trust-dots">
                {["A","B","C","D"].map((l, i) => (
                  <div className="trust-dot" key={i}>{l}</div>
                ))}
              </div>
              <span>Dipercaya <strong>12,000+</strong> pengguna aktif</span>
            </div>
          </div>

          {/* Right – visual card */}
          <div className="hero-visual fade-in-section">
            <div className="hero-card">
              <div className="hero-card-header">
                <span className="hero-card-title">Total Tabungan</span>
                <span style={{ fontSize: 12, color: "#10B981", fontWeight: 600 }}>▲ 12.4%</span>
              </div>
              <div className="hero-card-amount">Rp 8.400.000</div>
              <div className="hero-card-sub">↑ Rp 340.000 bulan ini</div>
              <div className="hero-bars">
                {[0,1,2,3,4,5].map(i => <div className="hero-bar" key={i} />)}
              </div>
              <div className="hero-months">
                {["Okt","Nov","Des","Jan","Feb","Mar"].map(m => <span key={m}>{m}</span>)}
              </div>
            </div>
            <div className="hero-float-card top-left">
              <div className="float-label">Pengeluaran</div>
              <div className="float-value red">Rp 2.1jt</div>
            </div>
            <div className="hero-float-card bot-right">
              <div className="float-label">Pemasukan</div>
              <div className="float-value green">Rp 5.5jt</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats">
        <div className="stats-inner">
          {statsData.map((s, i) => (
            <div key={i} className="fade-in-section">
              <div className="stat-num"><Counter end={s.num} suffix={s.suffix} /></div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Problems ── */}
      <section className="section problems" id="masalah">
        <div className="section-inner">
          <div className="section-header fade-in-section">
            <span className="section-tag">Masalah Umum</span>
            <h2 className="section-title">Masalah yang Sering Dihadapi</h2>
            <p className="section-desc">
              Banyak orang mengalami tantangan finansial yang sama.
              Kami hadir untuk membantu Anda mengatasinya.
            </p>
          </div>
          <div className="problems-grid">
            {problems.map((p, i) => (
              <div className="problem-card fade-in-section" key={i}>
                <img src={p.img} alt={p.title} className="problem-img" />
                <div className="problem-body">
                  <div className="problem-title">{p.title}</div>
                  <div className="problem-desc">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solutions ── */}
      <section className="section" id="solusi">
        <div className="section-inner">
          <div className="section-header fade-in-section">
            <span className="section-tag">Solusi Kami</span>
            <h2 className="section-title">Solusi Cerdas untuk Anda</h2>
            <p className="section-desc">
              Fitur lengkap yang dirancang khusus untuk membantu Anda
              menguasai keuangan pribadi dengan lebih mudah.
            </p>
          </div>
          <div className="solutions-grid">
            {solutions.map((s, i) => (
              <div className="solution-card fade-in-section" key={i}>
                <div className="solution-icon" style={{ background: `${s.color}18` }}>
                  <span style={{ color: s.color }}>{s.icon}</span>
                </div>
                <div className="solution-title">{s.title}</div>
                <div className="solution-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section howitworks" id="cara-kerja">
        <div className="section-inner">
          <div className="section-header fade-in-section">
            <span className="section-tag">Cara Kerja</span>
            <h2 className="section-title">Cara Kerja</h2>
            <p className="section-desc">
              Hanya 3 langkah sederhana untuk mulai mengelola keuangan
              Anda dengan lebih bijak.
            </p>
          </div>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div className="step-card fade-in-section" key={i}>
                <div className="step-num">{s.num}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta">
        <div className="cta-inner fade-in-section">
          <h2 className="cta-title">Siap untuk Mengatur Masa Depan Finansialmu?</h2>
          <p className="cta-desc">
            Bergabunglah dengan ribuan pengguna yang telah mempercayakan
            perencanaan keuangan mereka kepada kami. Mulai gratis hari ini.
          </p>
          <button className="btn-white" onClick={() => navigate("/register")}>
            Mulai Gratis Sekarang <IconArrow />
          </button>
          <div className="cta-features">
            {["Gratis Selamanya", "Tanpa Kartu Kredit", "Data Aman & Terenkripsi"].map((f, i) => (
              <div className="cta-feat" key={i}>
                <div className="cta-feat-check"><IconCheck /></div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-logo">Dana<span>Fit</span></div>
              <p className="footer-about">
                Platform keuangan pribadi yang membantu Anda merencanakan
                masa depan finansial dengan lebih cerdas dan terorganisir.
              </p>
              <div className="footer-social">
                <button className="social-btn"><IconInstagram /></button>
                <button className="social-btn"><IconTwitter /></button>
                <button className="social-btn"><IconFacebook /></button>
              </div>
            </div>
            <div>
              <div className="footer-col-title">Fitur</div>
              <ul className="footer-links">
                {["Pencatatan","Anggaran","Grafik","Tabungan"].map(l => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Produk</div>
              <ul className="footer-links">
                {["Web App","Mobile","API","Integrasi"].map(l => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="footer-col-title">Sosial Media</div>
              <ul className="footer-links">
                {["Instagram","Twitter","LinkedIn","YouTube"].map(l => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 DanaFit. Semua hak dilindungi.</span>
            <span>Dibuat dengan  di Indonesia</span>
          </div>
        </div>
      </footer>
    </>
  );
}
