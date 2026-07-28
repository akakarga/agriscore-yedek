export const OFFICIAL_MARKET_CONTEXT = {
  status: 'VERIFIED_OFFICIAL_SNAPSHOT',
  verifiedAt: '2026-07-28',
  scoringImpact: 'NONE',
  records: [
    {
      id: 'usk-raw-milk-price',
      label: 'Çiğ süt tavsiye fiyatı',
      value: '24,30 TL/L',
      period: '1 Mayıs 2026’dan itibaren',
      sourceName: 'Ulusal Süt Konseyi',
      sourceUrl: 'https://ulusalsutkonseyi.org.tr/ulusal-sut-konseyi-cig-sut-tavsiye-fiyati-13-5140/',
    },
    {
      id: 'tuik-milk-collected',
      label: 'Toplanan inek sütü',
      value: '1.022.587 ton',
      period: 'Mayıs 2026',
      sourceName: 'TÜİK',
      sourceUrl: 'https://veriportali.tuik.gov.tr/tr/press/58076',
    },
    {
      id: 'tkdk-ipard-budget',
      label: 'IPARD III 2026 çağrı bütçesi',
      value: '241 milyon €',
      period: '2026 çağrı takvimi',
      sourceName: 'TKDK',
      sourceUrl: 'https://www.tkdk.gov.tr/Haber/bakan-yumakli-241-milyon-avro-butceli-2026-cagri-takvimimiz-hayirli-olsun-13038?lang=tr',
    },
  ],
} as const;
