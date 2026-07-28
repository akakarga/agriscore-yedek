# Fırsat Eşleştirme Motoru

## Veri sınıfı

Mevcut dört fırsat `SYNTHETIC_SCENARIO_DATA` kapsamındadır. Aktif TKDK, banka veya bakanlık teklifi değildir.

## Yapılandırılmış kurallar

Her fırsat şu alanları taşır:

- Hedef işletme tipi
- Bölge
- Gerekli belgeler
- Minimum DSCR
- Minimum veri güvenilirliği
- İzin verilen risk sınıfları
- Minimum yem/gelir oranı
- Hariç tutulan operasyonel risk terimleri

Motor yalnızca `doğrulandı` durumundaki belge kaynaklarını mevcut kabul eder. `bekliyor` veya `eksik` belge uygunluk kanıtı değildir.

## Sonuç dili

En yüksek sonuç bile:

```text
Yüksek Uyum - Resmi Doğrulama Gerekli
```

“Ön onay”, “garanti” veya resmi kurum uygunluğu ifadesi kullanılmaz.

## Gerçek entegrasyon koşulu

Aktif programlar için çağrı metni, bölge, süre, bütçe, uygun sektör, yaş/cinsiyet önceliği ve belge listesi resmi kaynaktan tarih damgalı alınmalıdır. Değişen çağrılar son kullanma tarihi ve `STALE_DATA` durumu ile yönetilmelidir.
