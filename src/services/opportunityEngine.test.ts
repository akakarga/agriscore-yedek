import { describe, expect, it } from 'vitest';
import { opportunities, producers } from '../data/seedData';
import { calculateOpportunityMatch } from './opportunityEngine';

describe('calculateOpportunityMatch', () => {
  it('does not treat missing scenario documents as verified eligibility', () => {
    const result = calculateOpportunityMatch(producers[0], opportunities[0]);

    expect(result.isHighlyEligible).toBe(false);
    expect(result.verificationStatus).toBe('Eksik Belge');
    expect(result.missingRequirements).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Çiftçi Kayıt Belgesi (ÇKS)'),
        expect.stringContaining('Proforma Fatura'),
        expect.stringContaining('Mali Tablolar'),
      ])
    );
  });

  it('does not accept a pending document as verified', () => {
    const result = calculateOpportunityMatch(producers[1], opportunities[0]);

    expect(result.missingRequirements).toEqual(
      expect.arrayContaining([expect.stringContaining('Mali Tablolar')])
    );
    expect(result.verificationStatus).toBe('Eksik Belge');
  });

  it('enforces structured regional rules', () => {
    const result = calculateOpportunityMatch(producers[0], opportunities[3]);

    expect(result.missingRequirements).toEqual(
      expect.arrayContaining([expect.stringContaining('Bursa')])
    );
    expect(result.isHighlyEligible).toBe(false);
  });

  it('does not treat an unknown installment amount as no debt', () => {
    const result = calculateOpportunityMatch(producers[7], opportunities[0]);

    expect(result.missingRequirements).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Mevcut taksit bilgisi eksik'),
      ])
    );
    expect(result.isHighlyEligible).toBe(false);
  });
});
