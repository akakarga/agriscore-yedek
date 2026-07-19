# AgriScore AI - AI Agent Architecture

## Genel BakÄ±ÅŸ
Sistemde "Humanizer" adÄ± verilen AI ajan mimarisi, deterministik motorlardan gelen ham sayÄ±sal skorlarÄ± ve risk metriklerini insanlarÄ±n ve finans uzmanlarÄ±nÄ±n okuyabileceÄŸi profesyonel metinlere dÃ¶nÃ¼ÅŸtÃ¼rÃ¼r.

## Mimari Prensipler
- **Objektif ve Profesyonel Dil:** Sistem heyecanlÄ±, abartÄ±lÄ± veya "kesin onay/ret" iÃ§eren cÃ¼mleler kurmaz. Tamamen objektif bir veri sunumu yapar.
- **Finansal Terminoloji:** "SÃ¼t dÃ¼ÅŸtÃ¼" yerine "Ãœretim hacminde dÃ¶nemsel daralma gÃ¶zlemlendi" gibi profesyonel bankacÄ±lÄ±k ve finans baÄŸlamÄ±na uygun terminoloji kullanÄ±lÄ±r.
- **ÅeffaflÄ±k:** Yapay zeka Ã§Ä±ktÄ±sÄ±, hangi veriye dayanarak yorum yaptÄ±ÄŸÄ±nÄ± aÃ§Ä±klar. (Ã–rn: "Yem maliyetlerinin gelire oranÄ±nÄ±n %50'yi aÅŸmasÄ± nakit akÄ±ÅŸÄ± riski oluÅŸturmaktadÄ±r.")

## Servis KatmanÄ± (`aiAgentService.ts`)
- `generateAINarrative(producer, score, forecast)` fonksiyonu Ã¼zerinden Ã§alÄ±ÅŸÄ±r.
- Skor 75 Ã¼zerindeyse gÃ¼Ã§lÃ¼ yÃ¶nleri Ã¶ne Ã§Ä±karÄ±rken, 50 altÄ±ndaysa risk sinyallerini (DSCR dÃ¼ÅŸÃ¼klÃ¼ÄŸÃ¼, veri eksikliÄŸi) vurgular.
- Dinamik prompt/template bazlÄ± Ã§alÄ±ÅŸÄ±r. (GerÃ§ek bir dÄ±ÅŸ LLM API'si yarÄ±ÅŸma demosu olduÄŸu iÃ§in simÃ¼le edilmiÅŸtir, deterministik ÅŸablonlarla gÃ¼venli Ã§Ä±ktÄ± saÄŸlar).
