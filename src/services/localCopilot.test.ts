import { describe, expect, it } from 'vitest';
import { producers } from '../data/seedData';
import { getLocalCopilotReply } from './localCopilot';

describe('getLocalCopilotReply', () => {
  it('returns the aggregate distribution for a portfolio risk-distribution question', () => {
    const response = getLocalCopilotReply(
      'Portföy risk dağılımı nedir?',
      producers
    );

    expect(response.mode).toBe('local_deterministic');
    expect(response.text).toContain('8 örnek işletme profili');
    expect(response.text).toContain('Risk dağılımı: düşük 5, orta 2, yüksek 0');
    expect(response.text).toContain('hesaplanamayan 1');
    expect(response.text).not.toContain('İnceleme önceliği');
  });

  it('returns a review list for an explicit priority question', () => {
    const response = getLocalCopilotReply(
      'Hangi profiller inceleme öncelikli?',
      producers
    );

    expect(response.text).toContain('İnceleme önceliği');
    expect(response.text).toContain('Hasan Erdoğan');
  });

  it('explains the file evaluation with computed results', () => {
    const response = getLocalCopilotReply(
      'Kanıt Konseyi ajanları neden uzman incelemesi istiyor?',
      producers[7]
    );

    expect(response.mode).toBe('local_deterministic');
    expect(response.text).toContain('Dosya değerlendirme özeti');
    expect(response.text).toContain('Veri Tamamlama Öncelikli');
    expect(response.text).toMatch(/\d\/5 değerlendirme alanı ayrıntılı inceleme istiyor/);
    expect(response.text).toContain('Eksik finansal bilgiler');
  });
});
