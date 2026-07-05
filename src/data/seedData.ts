import type { Producer } from '../types';

export const producers: Producer[] = [
  {
    id: 'P001',
    name: 'Ahmet Yılmaz',
    location: 'Bursa / Karacabey',
    businessType: 'Süt Çiftliği',
    herd: {
      totalCattle: 150,
      milkingCows: 95,
      heifers: 30,
      calves: 20,
      dryCows: 5,
    },
    productionHistory: [
      { month: 'Oca 2026', totalLiters: 85500, averagePerCow: 30 },
      { month: 'Şub 2026', totalLiters: 86000, averagePerCow: 30.2 },
      { month: 'Mar 2026', totalLiters: 88000, averagePerCow: 30.5 },
      { month: 'Nis 2026', totalLiters: 87500, averagePerCow: 30.1 },
      { month: 'May 2026', totalLiters: 89000, averagePerCow: 30.8 },
      { month: 'Haz 2026', totalLiters: 88500, averagePerCow: 30.6 },
    ],
    financials: {
      monthlyMilkRevenue: 1327500, // 15 TL/Litre
      monthlyFeedCost: 600000,
      monthlyOtherCosts: 150000,
      currentLoanInstallments: 50000,
      requestedLoanAmount: 2000000,
    },
    riskNotes: [
      'Veteriner sağlık kayıtları düzenli.',
      'Sürü yenileme oranı sağlıklı seviyede.',
      'Yem stoğu önümüzdeki 6 ay için yeterli.'
    ],
    dataSources: [
      { name: 'Resmi Sürü Kayıt Örneği', status: 'doğrulandı', date: '2026-06-30', impact: 'Sürü varlığı teyit edildi.', description: 'Resmi tarımsal kayıt entegrasyonu (örnek).' },
      { name: 'Süt Kooperatifi Dökümleri', status: 'doğrulandı', date: '2026-07-02', impact: 'Aylık süt teslimat hacimleri teyit edildi.', description: 'Son 6 aya ait süt alım faturaları.' },
      { name: 'Banka Hesap Hareketleri', status: 'doğrulandı', date: '2026-07-01', impact: 'Nakit akışı ve yem giderleri uyumlu.', description: 'Banka hesap hareketleri örnek dökümü.' }
    ],
    farmMemory: 'Üretici son 5 yıldır aynı bölgede üretim yapıyor. Daha önce aldığı krediyi sorunsuz kapatmış.',
    verificationNotes: ['Risk düşük, belgeler tam ve güncel.']
  },
  {
    id: 'P002',
    name: 'Mehmet Demir',
    location: 'Balıkesir / Susurluk',
    businessType: 'Karma Çiftlik',
    herd: {
      totalCattle: 80,
      milkingCows: 50,
      heifers: 15,
      calves: 10,
      dryCows: 5,
    },
    productionHistory: [
      { month: 'Oca 2026', totalLiters: 42000, averagePerCow: 28 },
      { month: 'Şub 2026', totalLiters: 42500, averagePerCow: 28.3 },
      { month: 'Mar 2026', totalLiters: 43000, averagePerCow: 28.6 },
      { month: 'Nis 2026', totalLiters: 42000, averagePerCow: 28 },
      { month: 'May 2026', totalLiters: 41500, averagePerCow: 27.6 },
      { month: 'Haz 2026', totalLiters: 41000, averagePerCow: 27.3 },
    ],
    financials: {
      monthlyMilkRevenue: 615000,
      monthlyFeedCost: 350000,
      monthlyOtherCosts: 80000,
      currentLoanInstallments: 120000,
      requestedLoanAmount: 500000,
    },
    riskNotes: [
      'Yüksek borçluluk oranı.',
      'Son 2 ayda verimde hafif düşüş trendi.',
    ],
    dataSources: [
      { name: 'Resmi Sürü Kayıt Örneği', status: 'doğrulandı', date: '2026-06-25', impact: 'Sürü teyit edildi.', description: 'Sürü kayıt sistemi üzerinden alınan hayvan listesi örneği.' },
      { name: 'Mali Tablolar (Geçici Vergi)', status: 'bekliyor', date: '2026-03-31', impact: 'Karlılık durumu güncel belgelere göre netleşecek.', description: '2026/1. Dönem mali tablolar talep edildi.' },
      { name: 'Süt Sanayi Faturaları', status: 'doğrulandı', date: '2026-07-03', impact: 'Satışlar teyit edildi.', description: 'Ulusal bir süt markasına kesilen faturalar.' }
    ],
    farmMemory: 'Geçen yıl kapasite artırımı için yüksek borçlanmaya gitti. Ancak verim artışı hedeflenenin biraz gerisinde kaldı.',
    verificationNotes: ['Güncel mali tabloların sisteme yüklenmesi bekleniyor.']
  },
  {
    id: 'P003',
    name: 'Fatma Şahin',
    location: 'İzmir / Ödemiş',
    businessType: 'Süt Çiftliği',
    herd: {
      totalCattle: 200,
      milkingCows: 120,
      heifers: 50,
      calves: 20,
      dryCows: 10,
    },
    productionHistory: [
      { month: 'Oca 2026', totalLiters: 110000, averagePerCow: 31 },
      { month: 'Şub 2026', totalLiters: 112000, averagePerCow: 31.5 },
      { month: 'Mar 2026', totalLiters: 115000, averagePerCow: 32 },
      { month: 'Nis 2026', totalLiters: 114000, averagePerCow: 31.8 },
      { month: 'May 2026', totalLiters: 116000, averagePerCow: 32.2 },
      { month: 'Haz 2026', totalLiters: 118000, averagePerCow: 32.5 },
    ],
    financials: {
      monthlyMilkRevenue: 1770000,
      monthlyFeedCost: 1100000, // Yüksek yem maliyeti
      monthlyOtherCosts: 200000,
      currentLoanInstallments: 200000,
      requestedLoanAmount: 1500000,
    },
    riskNotes: [
      'Sürü varlığı çok güçlü.',
      'Yem maliyetleri gelir oranına göre yüksek, likidite sıkışıklığı yaratıyor.',
      'Planlı büyüme stratejisi uyguluyor.'
    ],
    dataSources: [
      { name: 'Sürü Yönetim Yazılımı Dökümü', status: 'doğrulandı', date: '2026-07-01', impact: 'İşletme dijital olarak kendi verilerini doğru tutuyor.', description: 'Çiftlikte kullanılan sürü yönetim programı API verisi.' },
      { name: 'Yem Alım Faturaları', status: 'doğrulandı', date: '2026-06-28', impact: 'Yem giderleri yüksek ancak belgeli.', description: 'Büyük ölçekli yem alımları sözleşmeleri.' },
      { name: 'Finansal Sicil Örnek Raporu', status: 'doğrulandı', date: '2026-07-04', impact: 'Gecikmiş borcu yok, kredibilitesi yüksek.', description: 'Finansal sicil raporu örneği.' }
    ],
    farmMemory: 'Modernizasyon yatırımlarını yeni tamamladı. İşletme kurumsallaşma sürecinde.',
    verificationNotes: ['Yüksek yem maliyetinin nedeni rasyon kalitesiyle ilgili olabilir, veteriner raporu incelenebilir.']
  },
  {
    id: 'P004',
    name: 'Ali Kaya',
    location: 'Çanakkale / Biga',
    businessType: 'Süt Çiftliği',
    herd: {
      totalCattle: 60,
      milkingCows: 35,
      heifers: 10,
      calves: 10,
      dryCows: 5,
    },
    productionHistory: [
      { month: 'Oca 2026', totalLiters: 28000, averagePerCow: 26.6 },
      { month: 'Şub 2026', totalLiters: 27500, averagePerCow: 26.1 },
      { month: 'Mar 2026', totalLiters: 25000, averagePerCow: 24.5 }, // Ani düşüş
      { month: 'Nis 2026', totalLiters: 23000, averagePerCow: 23 },
      { month: 'May 2026', totalLiters: 21000, averagePerCow: 21 },
      { month: 'Haz 2026', totalLiters: 19000, averagePerCow: 19 },
    ],
    financials: {
      monthlyMilkRevenue: 285000,
      monthlyFeedCost: 180000,
      monthlyOtherCosts: 50000,
      currentLoanInstallments: 40000,
      requestedLoanAmount: 300000,
    },
    riskNotes: [
      'Mastitis salgını nedeniyle sürü sağlığında problemler.',
      'Süt üretiminde son 4 ayda %30 üzeri sert düşüş.',
      'Risk düzeyi yüksek.'
    ],
    dataSources: [
      { name: 'Veteriner Müdahale Kayıtları', status: 'doğrulandı', date: '2026-05-15', impact: 'Hastalık salgını belgelendi.', description: 'İlçe tarım veya veteriner sağlık raporları.' },
      { name: 'Süt Teslim Fişleri', status: 'doğrulandı', date: '2026-06-30', impact: 'Üretimdeki ciddi düşüş teyit edildi.', description: 'Kooperatife teslim edilen süt miktarındaki azalma.' },
      { name: 'Banka Kredi Skoru', status: 'eksik', date: '2026-07-01', impact: 'Finansal ödeme alışkanlıkları belirsiz.', description: 'Kredi kartı/hesap gecikmeleri sorgulanamadı.' }
    ],
    farmMemory: 'Sürü hijyeni ve sağımhane problemleri nedeniyle 3 aydır ciddi bir üretim kaybı yaşıyor. Tedavi süreci devam ediyor.',
    verificationNotes: ['Kredi tahsisi öncesi veteriner hekimden "Sürü Sağlık Durumu İyileşme Raporu" istenmeli.']
  },
  {
    id: 'P005',
    name: 'Ayşe Çelik',
    location: 'Konya / Ereğli',
    businessType: 'Aile İşletmesi',
    herd: {
      totalCattle: 30,
      milkingCows: 20,
      heifers: 5,
      calves: 3,
      dryCows: 2,
    },
    productionHistory: [
      { month: 'Oca 2026', totalLiters: 15000, averagePerCow: 25 },
      { month: 'Şub 2026', totalLiters: 15200, averagePerCow: 25.3 },
      { month: 'Mar 2026', totalLiters: 15100, averagePerCow: 25.1 },
      { month: 'Nis 2026', totalLiters: 15000, averagePerCow: 25 },
      { month: 'May 2026', totalLiters: 15300, averagePerCow: 25.5 },
      { month: 'Haz 2026', totalLiters: 15400, averagePerCow: 25.6 },
    ],
    financials: {
      monthlyMilkRevenue: 231000,
      monthlyFeedCost: 90000,
      monthlyOtherCosts: 20000,
      currentLoanInstallments: 10000,
      requestedLoanAmount: 100000,
    },
    riskNotes: [
      'Küçük ama son derece istikrarlı üretim.',
      'Borç servis kapasitesi yüksek.',
      'Güvenli mikro-kredi profili.'
    ],
    dataSources: [
      { name: 'Hayvan Pasaportu Örneği', status: 'doğrulandı', date: '2026-06-20', impact: 'Sürü varlığı sabit ve belgeli.', description: 'Kulak küpe no üzerinden resmi kayıt doğrulaması.' },
      { name: 'Müstahsil Makbuzları', status: 'doğrulandı', date: '2026-07-02', impact: 'Gelir sürekliliği teyit edildi.', description: 'Düzenli gelir kanıtı.' }
    ],
    farmMemory: 'Kendi yeminin bir kısmını üreten, düşük maliyetli, şoka dayanıklı tipik bir aile işletmesi.',
    verificationNotes: ['Risk yok, mevcut belgeler mikro-kredilendirme için yeterli.']
  },
  {
    id: 'P006',
    name: 'Mustafa Yıldız',
    location: 'Tekirdağ / Malkara',
    businessType: 'Süt Çiftliği',
    herd: {
      totalCattle: 120,
      milkingCows: 70,
      heifers: 25,
      calves: 15,
      dryCows: 10,
    },
    productionHistory: [
      { month: 'Oca 2026', totalLiters: 65000, averagePerCow: 31 },
      { month: 'Şub 2026', totalLiters: 55000, averagePerCow: 28 },
      { month: 'Mar 2026', totalLiters: 68000, averagePerCow: 32 },
      { month: 'Nis 2026', totalLiters: 58000, averagePerCow: 29 },
      { month: 'May 2026', totalLiters: 70000, averagePerCow: 33 },
      { month: 'Haz 2026', totalLiters: 60000, averagePerCow: 29.5 },
    ],
    financials: {
      monthlyMilkRevenue: 900000,
      monthlyFeedCost: 450000,
      monthlyOtherCosts: 120000,
      currentLoanInstallments: 180000,
      requestedLoanAmount: 800000,
    },
    riskNotes: [
      'Aylık üretimde çok yüksek dalgalanma (Volatilite).',
      'Yem tedariğinde düzensizlikler kaydedildi.',
      'Nakit akışı düzensiz.'
    ],
    dataSources: [
      { name: 'Kooperatif Verileri', status: 'doğrulandı', date: '2026-07-01', impact: 'Dalgalı üretim tespit edildi.', description: 'Aydan aya değişen süt döküm hacmi.' },
      { name: 'Yem Firması Cari Hesap', status: 'bekliyor', date: '2026-06-15', impact: 'Yem tedarik kesintileri doğrulanacak.', description: 'Tedarikçilere olan güncel borç durumu.' }
    ],
    farmMemory: 'İşletme sermayesi yetersizliği nedeniyle kaliteli yeme düzenli ulaşamıyor, bu da üretimde zig-zag çizmesine neden oluyor.',
    verificationNotes: ['Yem kredisinin tedarikçiye doğrudan ödenmesi riski azaltabilir.']
  },
  {
    id: 'P007',
    name: 'Kemal Arslan',
    location: 'Aydın / Çine',
    businessType: 'Süt Çiftliği',
    herd: {
      totalCattle: 250,
      milkingCows: 140, // 3 ay önce 100'dü
      heifers: 80,
      calves: 30,
      dryCows: 0,
    },
    productionHistory: [
      { month: 'Oca 2026', totalLiters: 90000, averagePerCow: 30 },
      { month: 'Şub 2026', totalLiters: 95000, averagePerCow: 30.2 },
      { month: 'Mar 2026', totalLiters: 100000, averagePerCow: 30.5 },
      { month: 'Nis 2026', totalLiters: 115000, averagePerCow: 29.5 }, // Yeni hayvanlar eklendi
      { month: 'May 2026', totalLiters: 125000, averagePerCow: 29.8 },
      { month: 'Haz 2026', totalLiters: 130000, averagePerCow: 30.1 },
    ],
    financials: {
      monthlyMilkRevenue: 1950000,
      monthlyFeedCost: 1100000,
      monthlyOtherCosts: 300000,
      currentLoanInstallments: 400000, // Büyüme kaynaklı yüksek borç
      requestedLoanAmount: 1000000,
    },
    riskNotes: [
      'Agresif büyüme stratejisi. Hayvan sayısı hızla artıyor.',
      'Yatırım kaynaklı mevcut borç yükü çok yüksek.',
      'Kısa vadeli likidite riski, ancak uzun vadeli üretim potansiyeli güçlü.'
    ],
    dataSources: [
      { name: 'Kapasite Raporu', status: 'doğrulandı', date: '2026-06-10', impact: 'Büyüme potansiyeli tescillendi.', description: 'Bakanlık onaylı kapasite artırım raporu.' },
      { name: 'Banka Kredi Sicili', status: 'doğrulandı', date: '2026-07-02', impact: 'Kaldıraç oranı yüksek.', description: 'Yeni hayvan alımı için kullanılan son krediler.' },
      { name: 'Satış Sözleşmeleri', status: 'doğrulandı', date: '2026-01-10', impact: 'Gelir garantisi mevcut.', description: 'Ulusal bir markayla yıllık alım garantili sözleşme.' }
    ],
    farmMemory: 'Bölgedeki en hızlı büyüyen modern çiftliklerden biri. Karlılığı yatırıma döndürüyor.',
    verificationNotes: ['Risk skoru borçluluk nedeniyle baskılanıyor ancak teminat yapısı sağlamsa fonlanabilir.']
  },
  {
    id: 'P008',
    name: 'Hasan Erdoğan',
    location: 'Burdur / Bucak',
    businessType: 'Süt Çiftliği',
    herd: {
      totalCattle: 50,
      milkingCows: 30,
      heifers: 10,
      calves: 5,
      dryCows: 5,
    },
    productionHistory: [
      // Veri eksik
      { month: 'Oca 2026', totalLiters: 25000, averagePerCow: 27 },
      { month: 'Şub 2026', totalLiters: 25500, averagePerCow: 27.2 },
      { month: 'Haz 2026', totalLiters: 26000, averagePerCow: 27.5 },
    ],
    financials: {
      monthlyMilkRevenue: 390000,
      monthlyFeedCost: 200000,
      monthlyOtherCosts: 0, // Eksik veri
      currentLoanInstallments: 0, // Belirsiz
      requestedLoanAmount: 400000,
    },
    riskNotes: [
      'Mart, Nisan ve Mayıs süt üretim verileri sisteme girilmemiş.',
      'Diğer gider ve mevcut kredi bilgileri eksik.',
      'Sistem, veri güvenilirliği zayıf uyarısı veriyor.'
    ],
    dataSources: [
      { name: 'Süt Alım Fişleri (Son 3 Ay)', status: 'eksik', date: '-', impact: 'Gelir doğrulaması yapılamadı.', description: 'Mart, Nisan, Mayıs fişleri sisteme yüklenmedi.' },
      { name: 'Banka Hesap Ekstresi', status: 'eksik', date: '-', impact: 'Giderler belirsiz.', description: 'Operasyonel giderleri doğrulamak için ekstre bekleniyor.' },
      { name: 'Resmi Sürü Kayıt Örneği', status: 'bekliyor', date: '2025-12-30', impact: 'Hayvan varlığı güncelliğini yitirmiş.', description: 'Son doğrulama 6 ay öncesine ait.' }
    ],
    farmMemory: 'Dijital kayıt tutma alışkanlığı yok. Finansal veriler tahmini veya beyana dayalı.',
    verificationNotes: ['Veri güvenilirliği %40\'ın altında olduğu için kredi karar süreçleri otomatik işletilmemeli.']
  }
];

import type { Opportunity } from '../types';

export const opportunities: Opportunity[] = [
  {
    id: 'OPT-001',
    title: 'Modernizasyon ve Ekipman Kredisi',
    type: 'Kredi',
    targetProducerType: ['Süt Çiftliği', 'Karma Çiftlik'],
    region: ['Tümü'],
    requiredDocuments: ['Çiftçi Kayıt Belgesi (ÇKS)', 'Proforma Fatura', 'Mali Tablolar'],
    eligibilityRules: 'DSCR > 1.25 ve Kredi Notu "Yüksek" veya "Orta" olan işletmeler.',
    sourceNote: 'Senaryolaştırılmış finansal kredi fırsatı örneğidir.'
  },
  {
    id: 'OPT-002',
    title: 'Kırsal Kalkınma Hibe Desteği',
    type: 'Hibe',
    targetProducerType: ['Aile İşletmesi', 'Süt Çiftliği'],
    region: ['Bursa', 'Balıkesir', 'Çanakkale', 'Tekirdağ', 'Konya', 'Burdur', 'Aydın', 'İzmir'],
    requiredDocuments: ['Yatırım Projesi', 'Tapu/Kira Sözleşmesi', 'İşletme Tescil Belgesi'],
    eligibilityRules: 'Kapasite artırımı planlayan ve veri güvenilirliği yüksek olan üreticiler.',
    sourceNote: 'Senaryolaştırılmış hibe programı örneğidir. Resmi kurumlardan doğrulanmalıdır.'
  },
  {
    id: 'OPT-003',
    title: 'Yem Maliyeti Sübvansiyonu',
    type: 'Teşvik',
    targetProducerType: ['Tümü'],
    region: ['Tümü'],
    requiredDocuments: ['Süt Döküm Faturaları', 'Yem Alım Faturaları'],
    eligibilityRules: 'Aylık yem gideri toplam gelirinin %50\'sini aşan üreticiler önceliklidir.',
    sourceNote: 'Senaryolaştırılmış devlet teşvik örneğidir. Tarım Bakanlığı açıklamaları esastır.'
  },
  {
    id: 'OPT-004',
    title: 'Sıfır Faizli Sürü Büyütme Kredisi',
    type: 'Faiz Desteği',
    targetProducerType: ['Süt Çiftliği'],
    region: ['İzmir', 'Aydın', 'Burdur', 'Konya'],
    requiredDocuments: ['Kapasite Raporu', 'Hayvan Alım Sözleşmesi'],
    eligibilityRules: 'Sürü sağlığı iyi (mastitis vb. salgın yok) ve nakit akışı güçlü olanlar.',
    sourceNote: 'Senaryolaştırılmış kredi teşvik örneğidir.'
  }
];
