# AgriScore rules-v2.0

## Amaç

Motor kredi kararı vermez. Sentetik veya ileride doğrulanmış üretici girdilerini açıklanabilir bir 0-100 karar destek skoruna dönüştürür.

Kanonik implementasyonlar:

- Frontend: `src/services/scoreEngine.ts`
- Backend: `backend/main.py`

## Ağırlıklar

| Bileşen | Ağırlık |
|---|---:|
| Üretim istikrarı | %20 |
| Nakit akışı gücü | %20 |
| Sürü gücü | %15 |
| Borç yükü | %15 |
| Gelir düzenliliği | %15 |
| Operasyonel risk | %15 |

Toplam: %100.

## Veri güvenilirliği cezası

- Güvenilirlik `< 50`: toplam skor `0,60` ile çarpılır.
- Güvenilirlik `< 80`: toplam skor `0,90` ile çarpılır.
- Aksi halde ceza yoktur.

Bu bir “eksik puan kadar düşürme” değildir.

## Risk sınıfları

- 75-100: Düşük
- 50-74: Orta
- 0-49: Yüksek

## DSCR ve yeni taksit aralığı

İşletme geliri:

```text
aylık süt geliri - yem gideri - diğer giderler
```

Mevcut DSCR:

```text
işletme geliri / mevcut aylık taksit
```

Yeni taksit kapasitesi, mevcut taksitler sonrası toplam borç servisinin en az 1,25 DSCR koruması hedefiyle hesaplanır:

```text
alt sınır = max(0, işletme geliri / 1,50 - mevcut taksit)
üst sınır = max(alt sınır, işletme geliri / 1,25 - mevcut taksit)
```

Bu aralık kredi teklifi değildir; faiz, vade, teminat, vergiler ve kurum politikası ayrıca değerlendirilmelidir.

## Bilinen sınırlamalar

- Gerçek temerrüt etiketiyle kalibre edilmemiştir.
- Bölgesel fiyat, mevsim, teminat ve makro şoklar ana skora otomatik girmez.
- Risk notları anahtar kelime kurallarıyla işlenir.
- Bileşen eşikleri uzman/pilot doğrulaması gerektirir.

Model kartı ve gerçek veri kalibrasyonu tamamlanmadan “doğruluk oranı” iddiası yapılamaz.
