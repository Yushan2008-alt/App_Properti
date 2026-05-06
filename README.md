# PropVista — Platform Properti Premium Indonesia

> *"Temukan properti impian Anda, dengan agen terpercaya."*

PropVista adalah marketplace properti dua sisi berbasis web yang menghubungkan pembeli/penyewa dengan agen dan developer terpercaya. Platform ini menggabungkan tampilan listing premium, sistem verifikasi agen, CRM terintegrasi, dan fitur analitik pasar.

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS (custom design system) |
| Animasi | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Email + Google OAuth) |
| Storage | Supabase Storage |
| Maps | Mapbox GL JS |
| Email | Resend |
| Deployment | Vercel |

## Fitur Utama

- **Listing Properti** — Browse, search, dan filter ribuan properti premium
- **Agen Terverifikasi** — Setiap agen telah melalui verifikasi KTP & lisensi resmi
- **Unified Lead Inbox** — Dashboard CRM terintegrasi untuk manajemen lead
- **AI Property Match** — Rekomendasi properti berbasis preferensi buyer
- **Market Price Heatmap** — Visualisasi harga properti per area secara interaktif

## Cara Menjalankan

### 1. Clone & Install

```bash
git clone https://github.com/Yushan2008-alt/App_Properti.git
cd App_Properti
npm install
```

### 2. Konfigurasi Environment Variables

Salin `.env.example` menjadi `.env.local` dan isi dengan kredensial Anda:

```bash
cp .env.example .env.local
```

| Variable | Keterangan |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase Anda |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key dari Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (untuk admin functions) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Token Mapbox untuk fitur peta |
| `RESEND_API_KEY` | API key Resend untuk notifikasi email |

> **Catatan:** Aplikasi dapat dijalankan **tanpa** environment variables — data demo akan otomatis ditampilkan sehingga semua halaman dapat di-preview.

### 3. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### 4. Build untuk Production

```bash
npm run build
npm run start
```

## Struktur Halaman

### Halaman Publik

| Route | Deskripsi |
|---|---|
| `/` | Homepage: hero, statistik, featured listings |
| `/properti` | Daftar semua properti + search & filter |
| `/properti/[id]` | Detail listing + galeri foto + kontak agen |
| `/agen` | Direktori agen terverifikasi |
| `/agen/[slug]` | Profil publik agen |
| `/login` | Halaman login |
| `/register` | Registrasi (buyer atau agen) |

### Halaman Dashboard Agen (Protected)

| Route | Deskripsi |
|---|---|
| `/dashboard` | Overview statistik |
| `/dashboard/listing` | Manajemen listing |
| `/dashboard/listing/baru` | Tambah listing baru |
| `/dashboard/leads` | Unified Lead Inbox (Kanban) |
| `/dashboard/profil` | Edit profil & verifikasi |

## Database Setup (Supabase)

Lihat `PRD.md` untuk skema database lengkap. Jalankan SQL berikut di Supabase SQL Editor untuk setup tabel:

```sql
-- Lihat bagian "Database Schema" di PRD.md
```

Pastikan Row Level Security (RLS) diaktifkan sesuai ketentuan di PRD.

## Deployment

Proyek ini siap di-deploy ke [Vercel](https://vercel.com):

1. Push ke GitHub
2. Import repository di Vercel
3. Set environment variables di Vercel dashboard
4. Deploy otomatis dari branch `main`

---

*Dibuat dengan ❤️ untuk industri properti Indonesia*
