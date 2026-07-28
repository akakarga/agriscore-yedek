import { describe, expect, it } from 'vitest';
import { producers } from '../data/seedData';
import type { Producer } from '../types';
import { getLocalCopilotReply } from './localCopilot';
import { calculateOpportunityMatch } from './opportunityEngine';
import { calculatePortfolioStress } from './portfolioStressEngine';
import { calculateAgriScore } from './scoreEngine';
import { opportunities } from '../data/seedData';

describe('calculateAgriScore', () => {
  it('calculates new-installment capacity from the DSCR protection threshold', () => {
    const producer = producers[0];
    const result = calculateAgriScore(producer);
    const operatingIncome = 1_327_500 - 600_000 - 150_000;

    expect(result.methodologyVersion).toBe('rules-v2.0');
    expect(result.operatingIncome).toBe(operatingIncome);
    expect(result.currentDscr).toBe(operatingIncome / 50_000);
    expect(result.safeInstallmentRange).toEqual({
      min: Math.round(operatingIncome / 1.5 - 50_000),
      max: Math.round(operatingIncome / 1.25 - 50_000),
    });
  });

  it('does not divide by zero for an empty herd', () => {
    const producer: Producer = {
      ...producers[0],
      herd: {
        totalCattle: 0,
        milkingCows: 0,
        heifers: 0,
        calves: 0,
        dryCows: 0,
      },
    };

    const result = calculateAgriScore(producer);
    expect(Number.isFinite(result.overallScore)).toBe(true);
    expect(result.subScores.herdStrength).toBe(0);
  });

  it('does not treat missing costs and installments as zero', () => {
    const result = calculateAgriScore(producers[7]);

    expect(result.overallScore).toBeNull();
    expect(result.riskLevel).toBeNull();
    expect(result.assessmentStatus).toBe('Eksik Bilgi');
    expect(result.reliabilityResult.score).toBe(5);
    expect(result.operatingIncome).toBeNull();
    expect(result.currentDscr).toBeNull();
    expect(result.safeInstallmentRange).toEqual({ min: null, max: null });
    expect(result.riskWarnings).toEqual(
      expect.arrayContaining([
        expect.stringContaining('nakit akışı tamamlanamadı'),
        expect.stringContaining('ödeme gücü hesaplanamadı'),
      ])
    );
  });

  it('keeps economic risk separate from document reliability', () => {
    const verified = calculateAgriScore(producers[0]);
    const incompleteDocuments: Producer = {
      ...producers[0],
      dataSources: producers[0].dataSources.map((source, index) => ({
        ...source,
        status: index === 0 ? 'eksik' : source.status,
      })),
    };
    const incomplete = calculateAgriScore(incompleteDocuments);

    expect(incomplete.reliabilityResult.score).toBeLessThan(
      verified.reliabilityResult.score
    );
    expect(incomplete.overallScore).toBe(verified.overallScore);
  });
});

describe('truthful decision support', () => {
  it('uses actual computed producer values in local Co-Pilot mode', () => {
    const producer = producers[0];
    const score = calculateAgriScore(producer);
    const response = getLocalCopilotReply('Kredi riski ve ödeme kapasitesi nedir?', producer);

    expect(response.mode).toBe('local_deterministic');
    expect(response.text).toContain(`${score.overallScore}/100`);
    expect(response.text).toContain(`%${score.reliabilityResult.score}`);
    expect(response.text).toContain('kredi onayı veya reddi değildir');
  });

  it('does not treat unverified or differently named documents as verified', () => {
    const match = calculateOpportunityMatch(producers[0], opportunities[0]);

    expect(match.verificationStatus).toBe('Eksik Belge');
    expect(match.missingRequirements.some((item) => item.includes('Çiftçi Kayıt Belgesi'))).toBe(true);
    expect(match.verificationStatus).not.toContain('Ön Onay');
  });

  it('calculates deterministic portfolio stress results', () => {
    const first = calculatePortfolioStress(producers, 'feed20');
    const second = calculatePortfolioStress(producers, 'feed20');

    expect(first).toEqual(second);
    expect(first.impacts).toHaveLength(3);
    expect(first.desc).toContain('yeniden hesaplandı');
  });
});
