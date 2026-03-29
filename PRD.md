# PRD — Aplikasi Properti Marketing
**Versi**: 1.0
**Tanggal**: 2026-03-29
**Status**: Draft

---

## ⚠️ ATURAN WAJIB PENGEMBANGAN

> Wajib dibaca dan diterapkan oleh semua developer (termasuk AI assistant):
>
> - **PASTIKAN SEMUA SISTEM DAN FILE BERFUNGSI SEPENUHNYA**
> - **SELALU UJI COBA PROJEK DAN RE-CHECK SEBELUM KONFIRMASI SELESAI**
> - **JIKA MENEMUKAN KESALAHAN ATAU BUG, LANGSUNG DIPERBAIKI**
> - **TIDAK PERLU MINTA PERMISSION UNTUK COMMAND, EDIT, ATAU MODIFIKASI FILE — LANGSUNG DIKERJAKAN**
> - **JIKA SUDAH SELESAI MELAKUKAN PERUBAHAN, PUSH KE GITHUB AKUN "Yushan2008-alt" REPO https://github.com/Yushan2008-alt/App_Properti**

---

## 1. Overview

### Nama Produk
**PropVista** *(sementara — bisa diganti)*

### Tagline
*"Temukan properti impian Anda, dengan agen terpercaya."*

### Deskripsi Singkat
PropVista adalah platform marketplace properti dua sisi (two-sided marketplace) berbasis web yang menghubungkan pembeli/penyewa properti dengan agen dan developer terpercaya. Platform ini menggabungkan tampilan listing premium, sistem verifikasi agen, CRM terintegrasi, dan fitur analitik pasar — dalam satu antarmuka yang elegan dan modern.

### Masalah yang Diselesaikan
| Masalah di Pasar | Solusi PropVista |
|---|---|
| Platform kompetitor penuh bug (Rumah123 rating 1.70/5) | Arsitektur stabil, testing wajib sebelum deploy |
| Banyak agen dan listing palsu/fraud (OLX) | Sistem verifikasi agen wajib (KTP + lisensi) |
| Tidak ada konsolidasi lead masuk (semua platform) | Unified Lead Inbox — satu dashboard semua channel |
| Listing ditampilkan kronologis tanpa personalisasi | AI Property Match — rekomendasi berbasis preferensi |
| Tidak ada visualisasi harga per area | Market Price Heatmap interaktif |
| Desain terlihat template/kaku | Desain luxury custom, animasi smooth Framer Motion |

### Tujuan Bisnis
- Menjadi platform properti #1 pilihan agen profesional di Indonesia
- Memberikan pengalaman pencarian properti setara platform internasional kelas atas
- Menghasilkan revenue dari subscription agen (Verified Badge + fitur premium)

---

## 2. Target Pengguna

### 2.1 Buyer / Tenant (Pembeli & Penyewa)
- **Demografi**: 25–50 tahun, urban, income menengah ke atas
- **Kebutuhan**: Menemukan properti sesuai budget & preferensi, menghubungi agen terpercaya
- **Pain Point**: Tidak percaya listing online, terlalu banyak iklan palsu, UI berantakan

### 2.2 Agen / Broker / Developer
- **Demografi**: Agen properti profesional, developer perumahan, pemilik properti
- **Kebutuhan**: Memasarkan listing, mengelola lead, memantau performa iklan
- **Pain Point**: Lead masuk tidak terorganisir, platform tidak reliable, biaya promosi tidak transparan

### 2.3 Admin Platform
- **Kebutuhan**: Moderasi listing, verifikasi agen, analitik platform
- **Akses**: Dashboard admin terpisah

---

## 3. User Roles & Autentikasi

| Role | Akses |
|---|---|
| **Guest** | Browse listing, lihat detail properti, kirim inquiry/lead |
| **Agen / Developer** | Login, CRUD listing milik sendiri, dashboard lead, profil publik |
| **Admin** | Moderasi listing, verifikasi agen, analytics platform |

### Auth
- Email + Password
- Google OAuth (sign in with Google)
- Session management via Supabase Auth
- Protected routes dengan middleware Next.js

---

## 4. Fitur & Requirements

### 4.1 Listing Properti

**Untuk Agen (Create/Edit/Delete):**
- Form tambah listing: judul, deskripsi, tipe properti, status (jual/sewa), harga, luas tanah, luas bangunan, jumlah kamar tidur, jumlah kamar mandi, fasilitas (checkbox), lokasi (kota + alamat + koordinat), tahun dibangun
- Upload foto multiple (maks. 20 foto, via Supabase Storage)
- Set foto utama (thumbnail)
- Preview listing sebelum publish
- Draft & publish status

**Untuk Buyer (Read):**
- Halaman detail listing dengan galeri foto fullscreen
- Informasi lengkap properti
- Map embed (lokasi properti)
- Tombol "Hubungi Agen" (form inquiry / WhatsApp link)
- Share listing (copy link, WhatsApp, social media)
- Simpan ke favorit (untuk user yang login)

### 4.2 Pencarian & Filter

- Search bar: keyword bebas (nama, area, alamat)
- Filter tersedia:
  - Tipe properti: Rumah, Apartemen, Ruko, Tanah, Villa, Gudang, Kantor
  - Status: Dijual / Disewakan
  - Range harga (slider)
  - Luas tanah (min-max)
  - Luas bangunan (min-max)
  - Jumlah kamar tidur (1, 2, 3, 4, 5+)
  - Kota / Kabupaten
  - Kecamatan / Area
- Sorting: Terbaru, Harga Terendah, Harga Tertinggi, Relevan
- View mode: Grid cards / List view
- URL-based filter (shareable search results)

### 4.3 Manajemen Agen / Broker

**Profil Agen:**
- Foto profil, nama lengkap, nomor HP, email, bio singkat
- Area coverage (kota/wilayah yang dilayani)
- Verified Badge (muncul jika sudah diverifikasi admin)
- Statistik: jumlah listing aktif, total transaksi (v2)
- Halaman profil publik (`/agen/[slug]`)

**Verifikasi Agen (Unique Feature #1):**
- Agen upload scan KTP + SIU/SIK (Surat Izin Agen Properti) saat registrasi
- Admin review di dashboard dan approve/reject
- Badge "Agen Terverifikasi" otomatis muncul setelah approval
- Tujuan: eliminasi fraud, bangun kepercayaan buyer

### 4.4 CRM / Lead Management

**Lead Masuk (dari Buyer):**
- Form "Hubungi Agen" di halaman listing: nama, nomor HP, email, pesan
- WhatsApp link generator (tombol WA langsung ke agen)
- Lead tersimpan otomatis di database

**Unified Lead Inbox (Unique Feature #2):**
- Dashboard agen: semua lead masuk dari semua channel (form website, WA link, email)
- Setiap lead menampilkan: nama buyer, kontak, properti yang diminati, tanggal masuk, pesan
- Tidak dimiliki kompetitor manapun — semua hanya redirect ke WA

**Kanban Pipeline:**
- Status lead: **Baru → Dihubungi → Survei → Negosiasi → Closed → Batal**
- Drag-and-drop antar kolom
- Notes per lead (catatan internal agen)
- Filter lead by status, properti, tanggal

**Notifikasi:**
- Email notifikasi saat ada lead baru (via Supabase Edge Functions + Resend)

### 4.5 AI Property Match (Unique Feature #3)

- Saat pertama kali buka (atau setelah login), buyer diminta isi preferensi singkat:
  - Budget maksimum
  - Tipe properti yang dicari
  - Kota/area pilihan
  - Jumlah kamar tidur minimum
  - Tujuan: beli atau sewa
- Algoritma: rule-based scoring — listing diberi skor berdasarkan kecocokan dengan preferensi
- Hasil: section "Properti Direkomendasikan untuk Anda" di homepage
- Preferensi disimpan di localStorage (guest) atau database (logged in)
- Buyer bisa update preferensi kapan saja

### 4.6 Market Price Heatmap (Unique Feature #4)

- Halaman `/market` — peta interaktif Indonesia (Mapbox GL JS)
- Overlay warna per kecamatan/kota berdasarkan harga rata-rata listing aktif:
  - Hijau = harga di bawah rata-rata nasional
  - Kuning = rata-rata
  - Merah = di atas rata-rata
- Filter: tipe properti (rumah/apartemen/tanah), status (jual/sewa)
- Klik area → popup statistik: harga rata-rata, jumlah listing, range harga
- Data dihitung otomatis dari agregasi listing di database (Supabase computed view)

---

## 5. Tech Stack

| Layer | Teknologi |
|---|---|
| **Frontend** | Next.js 14 (App Router) + TypeScript |
| **Styling** | Tailwind CSS (kustomisasi penuh, tidak menggunakan preset default) |
| **Animasi** | Framer Motion + CSS custom transitions |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (Email + Google OAuth) |
| **Storage** | Supabase Storage (foto listing, dokumen verifikasi agen) |
| **Maps** | Mapbox GL JS (listing detail + heatmap) |
| **Email** | Supabase Edge Functions + Resend |
| **Deployment** | Vercel (CI/CD otomatis dari GitHub) |
| **Repo** | GitHub — `Yushan2008-alt/App_Properti` |

---

## 6. Database Schema

### Tabel Utama

```sql
-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT DEFAULT 'buyer' CHECK (role IN ('buyer', 'agent', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Agent profiles
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) UNIQUE,
  bio TEXT,
  coverage_areas TEXT[], -- array of cities
  ktp_url TEXT,          -- Supabase Storage path
  license_url TEXT,      -- Supabase Storage path
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  slug TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Property listings
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('rumah','apartemen','ruko','tanah','villa','gudang','kantor')),
  status TEXT CHECK (status IN ('jual','sewa')),
  price BIGINT,          -- in IDR
  land_area INT,         -- m2
  building_area INT,     -- m2
  bedrooms INT,
  bathrooms INT,
  city TEXT,
  district TEXT,
  address TEXT,
  latitude FLOAT,
  longitude FLOAT,
  amenities TEXT[],
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Property images
CREATE TABLE property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0
);

-- Leads (inquiries)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  agent_id UUID REFERENCES agents(id),
  buyer_name TEXT,
  buyer_phone TEXT,
  buyer_email TEXT,
  message TEXT,
  channel TEXT DEFAULT 'form' CHECK (channel IN ('form','whatsapp','email')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','survey','negotiation','closed','cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Lead status history
CREATE TABLE lead_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT,
  changed_at TIMESTAMPTZ DEFAULT now()
);

-- Buyer preferences (for AI Match)
CREATE TABLE buyer_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  max_budget BIGINT,
  property_type TEXT,
  city TEXT,
  min_bedrooms INT,
  purpose TEXT CHECK (purpose IN ('beli','sewa')),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Row Level Security (RLS)
- `properties`: agen hanya bisa CRUD listing milik sendiri; semua bisa SELECT yang published
- `leads`: agen hanya bisa lihat lead milik mereka sendiri
- `agents`: hanya admin yang bisa update `is_verified`
- `profiles`: user hanya bisa update profil sendiri

---

## 7. Desain & UI/UX

### 7.1 Design Philosophy
**Warm Neutral Luxury** — Terinspirasi Sotheby's International Realty, Christie's Real Estate, The Agency.

Tidak ada template jadi. Setiap komponen didesain dari nol dengan kepribadian visual yang konsisten.

### 7.2 Color Palette

| Token | Hex | Penggunaan |
|---|---|---|
| `--bg-primary` | `#FAFAF7` | Background utama halaman |
| `--bg-secondary` | `#F5F0E8` | Background section/card |
| `--bg-dark` | `#1C1917` | Footer, dark section |
| `--accent-gold` | `#C9A96E` | CTA utama, badge, highlight |
| `--accent-gold-hover` | `#B8935A` | Hover state CTA |
| `--text-primary` | `#1C1917` | Teks utama |
| `--text-secondary` | `#78716C` | Teks sekunder, caption |
| `--text-on-dark` | `#FAF9F7` | Teks di atas background gelap |
| `--border` | `#E7E5E4` | Border card, input |
| `--success` | `#4A7C59` | Status closed, verified |
| `--error` | `#9B3A3A` | Error, cancelled |

### 7.3 Typography

| Jenis | Font | Contoh |
|---|---|---|
| **Display / Headline** | Cormorant Garamond (serif) | H1 halaman utama, judul hero |
| **Sub-heading** | Playfair Display (serif) | H2, H3 section titles |
| **Body / UI** | Inter (sans-serif) | Paragraf, label, tombol, form |
| **Numbers** | Inter Tabular | Harga, statistik |

### 7.4 Animasi & Interaksi

**Prinsip**: Smooth, purposeful, tidak berlebihan. Semua animasi menggunakan Framer Motion.

| Elemen | Animasi |
|---|---|
| **Tombol CTA** | Scale 1→1.02 pada hover, gold glow box-shadow, durasi 200ms ease-out |
| **Klik tombol** | Scale 1→0.97 (press feel), warna gelap 20ms, kembali 150ms |
| **Card properti** | translateY(0→-4px) + shadow elevation pada hover |
| **Page transition** | Fade in + slide up (y: 20→0, opacity: 0→1, 400ms) |
| **Scroll reveal** | Staggered fade-in: setiap elemen muncul dengan delay 100ms berurutan |
| **Modal/Drawer** | Scale 0.95→1 + fade in, backdrop blur |
| **Loading skeleton** | Shimmer gradient warm neutral (cream → light gold → cream) |
| **Navigation link** | Underline slide dari kiri ke kanan pada hover |
| **Image gallery** | Smooth zoom + crossfade antar foto |
| **Kanban drag** | Shadow besar + slight rotation saat di-drag |

**Global Transition Default:**
```css
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
```

### 7.5 Layout & Responsivitas

- **Breakpoints**: 375px (mobile), 768px (tablet), 1280px (desktop), 1920px (wide)
- **Container max-width**: 1400px, centered
- **Grid listing**: 1 col (mobile) → 2 col (tablet) → 3 col (desktop) → 4 col (wide)
- **Spacing scale**: 4, 8, 12, 16, 24, 32, 48, 64, 96px

---

## 8. Halaman & Navigasi

### Halaman Publik
| Route | Deskripsi |
|---|---|
| `/` | Homepage: hero, AI match results, featured listings, agents |
| `/properti` | Halaman listing semua properti + search & filter |
| `/properti/[id]` | Detail listing + foto gallery + kontak agen + map |
| `/agen` | Direktori semua agen terverifikasi |
| `/agen/[slug]` | Profil publik agen + listing milik agen |
| `/market` | Market Price Heatmap interaktif |
| `/login` | Halaman login (email + Google) |
| `/register` | Registrasi (buyer atau agen) |

### Halaman Agen (Protected)
| Route | Deskripsi |
|---|---|
| `/dashboard` | Overview: listing aktif, lead terbaru, statistik |
| `/dashboard/listing` | Daftar semua listing milik agen |
| `/dashboard/listing/baru` | Form tambah listing baru |
| `/dashboard/listing/[id]/edit` | Edit listing |
| `/dashboard/leads` | Unified Lead Inbox (kanban + tabel) |
| `/dashboard/profil` | Edit profil & upload dokumen verifikasi |

### Halaman Admin (Protected)
| Route | Deskripsi |
|---|---|
| `/admin` | Dashboard admin: statistik platform |
| `/admin/agen` | Daftar agen menunggu verifikasi + approved |
| `/admin/listing` | Moderasi listing |

---

## 9. Analisis Kompetitor

### Perbandingan Platform

| Platform | Kekuatan | Kelemahan Utama | Rating App |
|---|---|---|---|
| **Rumah123** | Market leader, lead tools | App crash, OTP gagal, login berulang | 1.70/5 |
| **OLX Properti** | Mudah posting, direct buyer | Fraud bebas, tidak ada verifikasi | N/A |
| **Lamudi** | Price analytics, UI bersih | Search mobile ≠ web, inkonsistensi | 3.93/5 |
| **99.co** | UX terbaik, natural language search | Session crash, listing tidak visible tanpa bayar | 4.6/5 |
| **Ray White** | Brand premium, franchise nasional | Bukan marketplace, komisi tinggi | N/A |

### Gap yang Diisi PropVista

| Gap Kompetitor | Solusi PropVista |
|---|---|
| Semua platform punya bug serius | Arsitektur stabil, zero-bug policy sebelum release |
| Model booster/premium tidak transparan | Pricing transparan — agen bayar flat subscription |
| Tidak ada unified lead management | Unified Lead Inbox (first in Indonesia) |
| Semua platform redirect ke WA saja | CRM terintegrasi dengan pipeline & history |
| Tidak ada personalisasi listing | AI Property Match berbasis preferensi |
| Tidak ada visualisasi harga per area | Market Price Heatmap interaktif |
| OLX: fraud bebas | Verified Agent Badge + review admin |
| Mobile-web tidak konsisten (Lamudi) | Satu codebase Next.js — parity dijamin |

---

## 10. Non-Functional Requirements

| Aspek | Target |
|---|---|
| **Performance** | LCP < 2.5s, FID < 100ms, CLS < 0.1 (Core Web Vitals hijau) |
| **SEO** | SSR untuk halaman listing, meta tags dinamis, sitemap.xml |
| **Keamanan** | RLS Supabase, HTTPS only, input sanitization, rate limiting |
| **Aksesibilitas** | WCAG 2.1 AA, contrast ratio minimum 4.5:1, keyboard navigable |
| **Mobile** | Fully responsive, touch-friendly, no horizontal scroll |
| **Browser Support** | Chrome, Firefox, Safari, Edge (2 versi terakhir) |

---

## 11. Deployment & DevOps

| Aspek | Detail |
|---|---|
| **Platform** | Vercel (frontend) |
| **Database** | Supabase Cloud (PostgreSQL) |
| **Repository** | `https://github.com/Yushan2008-alt/App_Properti` |
| **CI/CD** | Push ke `main` → auto-deploy ke Vercel production |
| **Branching** | `main` (production), `dev` (development), `feature/*` |
| **Environment Variables** | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_MAPBOX_TOKEN`, `RESEND_API_KEY` |

---

## 12. Roadmap

### v1.0 — MVP (Foundation)
- [ ] Setup Next.js + Supabase + Tailwind + Framer Motion
- [ ] Auth (email + Google OAuth)
- [ ] CRUD listing properti
- [ ] Upload foto ke Supabase Storage
- [ ] Halaman listing publik (browse + filter + detail)
- [ ] Form kontak / inquiry
- [ ] Profil agen (publik + dashboard)
- [ ] Verified Agent Badge (upload dokumen + admin approval)
- [ ] Deployment ke Vercel

### v1.1 — CRM & Leads
- [ ] Unified Lead Inbox (dashboard kanban)
- [ ] Status pipeline drag-and-drop
- [ ] Notifikasi email lead baru (Resend)
- [ ] Lead notes & history

### v1.2 — Intelligence
- [ ] AI Property Match (rule-based recommendation)
- [ ] Market Price Heatmap (Mapbox heatmap layer)
- [ ] Buyer preferences onboarding flow

### v1.3 — Trust & Analytics
- [ ] Rating & ulasan agen (buyer bisa beri review)
- [ ] Dashboard analytics agen (views, leads, conversion)
- [ ] Admin analytics dashboard

### v2.0 — Growth
- [ ] KPR Calculator terintegrasi (partner bank)
- [ ] Notifikasi realtime (Supabase Realtime)
- [ ] Mobile app (React Native / PWA)
- [ ] Virtual tour integration (360° photo)
- [ ] Natural language search

---

*Dokumen ini adalah living document — update setiap kali ada keputusan desain atau fitur baru.*
