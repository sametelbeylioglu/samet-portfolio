# Samet Elbeylioğlu - Kişisel Portfolyo

Kendinizi tanıtacağınız, projelerinizi sergileyebileceğiniz, blog yazabileceğiniz ve güncel haberleri paylaşabileceğiniz kişisel portfolyo sitesi.

## Özellikler

- **Hakkımda** - Kendinizi tanıtın
- **Projeler** - Portfolyo projelerinizi ekleyin (görsel, link, GitHub)
- **Blog** - Zengin metin editörü ile blog yazıları
- **Haberler** - Takip ettiğiniz güncel haberleri paylaşın
- **Yetkinlikler & Sertifikalar** - Beceriler ve sertifikalar
- **Hizmetler** - Sunduğunuz hizmetler
- **Eğitim & Deneyim** - CV bilgileriniz
- **İletişim** - E-posta, sosyal medya, iletişim formu

## Kurulum

```bash
npm install
```

## Geliştirme

```bash
npm run dev
```

http://localhost:3000 adresinde çalışır.

## Build

```bash
npm run build
```

Statik dosyalar `out/` klasörüne export edilir.

## Supabase (Opsiyonel)

Veriler varsayılan olarak `localStorage`'da saklanır. Supabase kullanmak için:

1. [Supabase](https://supabase.com) projesi oluşturun
2. SQL Editor'de `supabase-setup.sql` dosyasını çalıştırın
3. `.env.local` oluşturup şu değişkenleri ekleyin:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

## Admin Paneli

`/admin` adresinden tüm içeriği yönetebilirsiniz:
- Profil & Hero
- Hizmetler, Projeler, Yetkinlikler, Sertifikalar
- Eğitim, Deneyim
- Blog, Haberler
- İletişim bilgileri
- Ayarlar (bölüm görünürlüğü, site başlığı, favicon)

## Teknolojiler

- Next.js 16 (App Router, Static Export)
- React 19
- Tailwind CSS v4
- Supabase (opsiyonel backend)
- TypeScript
