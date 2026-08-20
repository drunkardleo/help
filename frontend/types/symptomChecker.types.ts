export enum TriageSeverity {
  CRITICAL = 'CRITICAL',
  URGENT = 'URGENT',
  FIRST_AID = 'FIRST_AID'
}

export enum SymptomWeight {
  RED_FLAG = 3,
  SPECIFIC = 2,
  SUPPORTIVE = 1
}

export type SymptomId =
  | 'chestPain'
  | 'heavyBleeding'
  | 'breathingDifficulty'
  | 'unconscious'
  | 'burnInjury'
  | 'bonePain'
  | 'weakPulse'
  | 'dizziness'
  | 'vomitingBlood'
  | 'suddenWeakness'
  | 'coldSweating'
  | 'notBreathing'
  | 'noPulse'
  | 'radiatingPain'
  | 'nauseaVomiting'
  | 'extensiveBurn'
  | 'snakeBiteMarks'
  | 'swellingAtBiteSite'
  | 'numbnessOrTingling';

export type EmergencyId =
  | 'heart_attack'
  | 'bleeding'
  | 'shock'
  | 'burns'
  | 'cpr'
  | 'snake_bite';

export interface WeightedSymptom {
  id: SymptomId;
  weight: SymptomWeight;
}

export interface HardFlagRule {
  description?: string;
  requiredAll?: SymptomId[];
  requiredAny?: SymptomId[];
  forcedSeverity: TriageSeverity;
}

export interface EmergencyPattern {
  id: EmergencyId;
  symptoms: WeightedSymptom[];
  hardFlags: HardFlagRule[];
  defaultSeverity: TriageSeverity;
}

export interface SymptomMatch {
  emergencyId: EmergencyId;
  severity: TriageSeverity;
  confidence: number;
  matchedSymptoms: SymptomId[];
  hardFlagTriggered: boolean;
}

export interface SymptomCheckResult {
  primary: SymptomMatch | null;
  secondary: SymptomMatch[];
  isCritical: boolean;
  fallback: boolean;
}
