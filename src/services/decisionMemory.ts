import type { Producer, RiskLevel } from '../types';
import type { DecisionCouncilResult } from './decisionCouncilEngine';

export const DECISION_MEMORY_KEY = 'agriscore.decision-memory.v1';
export const DECISION_MEMORY_SCHEMA = 1;
const MEMORY_LIMIT = 5;

export interface DecisionReceipt {
  schemaVersion: 1;
  receiptId: string;
  createdAt: string;
  producerId: string;
  producerName: string;
  inputFingerprint: string;
  methodologyVersion: 'rules-v2.0';
  orchestrationVersion: 'council-v1.0';
  overallScore: number | null;
  riskLevel: RiskLevel | null;
  reliabilityScore: number;
  reviewPriority: DecisionCouncilResult['reviewPriority'];
  humanReviewRequired: boolean;
  disagreementCount: number;
  counterfactualActionCount: number;
}

const canonicalProducerInput = (producer: Producer) => ({
  id: producer.id,
  location: producer.location,
  businessType: producer.businessType,
  herd: producer.herd,
  productionHistory: producer.productionHistory,
  financials: producer.financials,
  riskNotes: producer.riskNotes,
  dataSources: producer.dataSources.map((source) => ({
    name: source.name,
    status: source.status,
    date: source.date,
  })),
});

export async function fingerprintProducer(producer: Producer): Promise<string> {
  const payload = JSON.stringify(canonicalProducerInput(producer));
  const digest = await globalThis.crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(payload)
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function createDecisionReceipt(
  producer: Producer,
  result: DecisionCouncilResult,
  createdAt = new Date().toISOString()
): Promise<DecisionReceipt> {
  const inputFingerprint = await fingerprintProducer(producer);
  return {
    schemaVersion: DECISION_MEMORY_SCHEMA,
    receiptId: `${producer.id}-${inputFingerprint.slice(0, 12)}-${createdAt}`,
    createdAt,
    producerId: producer.id,
    producerName: producer.name,
    inputFingerprint,
    methodologyVersion: result.methodologyVersion,
    orchestrationVersion: result.orchestrationVersion,
    overallScore: result.score.overallScore,
    riskLevel: result.score.riskLevel,
    reliabilityScore: result.score.reliabilityResult.score,
    reviewPriority: result.reviewPriority,
    humanReviewRequired: result.humanReviewRequired,
    disagreementCount: result.disagreements.length,
    counterfactualActionCount: result.counterfactualPlan.actions.length,
  };
}

export function mergeDecisionMemory(
  current: DecisionReceipt[],
  receipt: DecisionReceipt,
  limit = MEMORY_LIMIT
): DecisionReceipt[] {
  return [
    receipt,
    ...current.filter((item) => item.receiptId !== receipt.receiptId),
  ].slice(0, limit);
}

export function readDecisionMemory(
  storage: Pick<Storage, 'getItem'> = window.localStorage
): DecisionReceipt[] {
  try {
    const raw = storage.getItem(DECISION_MEMORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is DecisionReceipt =>
        typeof item === 'object'
        && item !== null
        && (item as DecisionReceipt).schemaVersion === DECISION_MEMORY_SCHEMA
        && typeof (item as DecisionReceipt).receiptId === 'string'
    ).slice(0, MEMORY_LIMIT);
  } catch {
    return [];
  }
}

export function saveDecisionMemory(
  receipts: DecisionReceipt[],
  storage: Pick<Storage, 'setItem'> = window.localStorage
): void {
  storage.setItem(
    DECISION_MEMORY_KEY,
    JSON.stringify(receipts.slice(0, MEMORY_LIMIT))
  );
}

export function clearDecisionMemory(
  storage: Pick<Storage, 'removeItem'> = window.localStorage
): void {
  storage.removeItem(DECISION_MEMORY_KEY);
}
