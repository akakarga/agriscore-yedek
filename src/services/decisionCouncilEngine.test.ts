import { describe, expect, it } from 'vitest';
import { producers } from '../data/seedData';
import { runDecisionCouncil } from './decisionCouncilEngine';
import {
  createDecisionReceipt,
  fingerprintProducer,
  mergeDecisionMemory,
} from './decisionMemory';
import type { DecisionReceipt } from './decisionMemory';

describe('runDecisionCouncil', () => {
  it('orchestrates five evidence-bound agents deterministically', () => {
    const first = runDecisionCouncil(producers[7]);
    const second = runDecisionCouncil(producers[7]);

    expect(first).toEqual(second);
    expect(first.orchestrationVersion).toBe('council-v1.0');
    expect(first.agents.map((agent) => agent.id)).toEqual([
      'evidence',
      'risk',
      'resilience',
      'opportunity',
      'recourse',
    ]);
    expect(first.trace).toHaveLength(3);
  });

  it('requires human review before interpreting a low-reliability profile', () => {
    const result = runDecisionCouncil(producers[7]);
    const evidenceAgent = result.agents.find(
      (agent) => agent.id === 'evidence'
    );

    expect(result.reviewPriority).toBe('Veri Tamamlama Öncelikli');
    expect(result.humanReviewRequired).toBe(true);
    expect(evidenceAgent?.status).toBe('requires_review');
    expect(evidenceAgent?.summary).toContain('güvenilirlik %5');
  });

  it('does not invent missing financial values while searching for an improvement path', () => {
    const producer = producers[7];
    const originalSnapshot = JSON.stringify(producer);
    const result = runDecisionCouncil(producer);
    const plan = result.counterfactualPlan;

    expect(JSON.stringify(producer)).toBe(originalSnapshot);
    expect(plan.achievable).toBe(false);
    expect(plan.actions).toHaveLength(0);
    expect(plan.disclaimer).toContain('Eksik finansal bilgiler');
  });

  it('does not invent an intervention for an already strong profile', () => {
    const result = runDecisionCouncil(producers[0]);

    expect(result.counterfactualPlan.achievable).toBe(true);
    expect(result.counterfactualPlan.actions).toHaveLength(0);
  });
});

describe('decision receipt memory', () => {
  it('creates a stable SHA-256 input fingerprint and versioned receipt', async () => {
    const producer = producers[7];
    const result = runDecisionCouncil(producer);
    const firstFingerprint = await fingerprintProducer(producer);
    const secondFingerprint = await fingerprintProducer(producer);
    const receipt = await createDecisionReceipt(
      producer,
      result,
      '2026-07-28T12:00:00.000Z'
    );

    expect(firstFingerprint).toBe(secondFingerprint);
    expect(firstFingerprint).toMatch(/^[a-f0-9]{64}$/);
    expect(receipt.schemaVersion).toBe(1);
    expect(receipt.inputFingerprint).toBe(firstFingerprint);
    expect(receipt.receiptId).toContain(producer.id);
  });

  it('keeps only the newest five unique receipts', async () => {
    const producer = producers[7];
    const result = runDecisionCouncil(producer);
    const receipts = await Promise.all(
      Array.from({ length: 6 }, (_, index) =>
        createDecisionReceipt(
          producer,
          result,
          `2026-07-28T12:00:0${index}.000Z`
        )
      )
    );
    const memory = receipts.reduce<DecisionReceipt[]>(
      (current, receipt) => mergeDecisionMemory(current, receipt),
      []
    );

    expect(memory).toHaveLength(5);
    expect(memory[0].receiptId).toBe(receipts[5].receiptId);
    expect(memory.some((item) => item.receiptId === receipts[0].receiptId)).toBe(false);
  });
});
