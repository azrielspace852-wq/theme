# Special For Zura

Situs spesial ulang tahun ke-20 untuk Zura, persembahan dari AZRIEL.
© AXION Neuralis & AZRIEL SPACE — Special Zura Birthday.

## Struktur

```
special-for-zura/
├── index.html      # halaman utama
├── css/
│   └── style.css   # seluruh styling (tema malam romantis rose-gold)
├── js/
│   └── script.js   # partikel, amplop interaktif, typewriter, reveal, burst hati
└── README.md
```

## Cara deploy ke Cloudflare Pages

### Opsi 1 — Dashboard (tanpa Git)
1. Login ke https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
2. Nama project: `special-for-zura` (atau bebas).
3. Zip folder `special-for-zura`, lalu upload / drag-and-drop seluruh isi folder (index.html, css/, js/) ke dalam kolom upload.
4. Klik **Deploy**. Situs langsung live di `https://<nama-project>.pages.dev`.

### Opsi 2 — Connect ke Git (GitHub/GitLab)
1. Push isi folder ini ke repository.
2. Di Cloudflare Pages → **Connect to Git** → pilih repository.
3. **Build command**: kosongkan. **Build output directory**: `/` (atau biarkan default root).
4. **Save and Deploy**.

Tidak perlu build step apa pun — ini situs statis murni (HTML + CSS + JS vanilla).

## Catatan
- Dibuka di browser butuh koneksi internet (Google Fonts dimuat dari CDN).
- Semua animasi aman untuk `prefers-reduced-motion`.
- Tidak ada emoji di UI; ikon menggunakan SVG inline.
