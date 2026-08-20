import {
  EmergencyId,
  SymptomCheckResult,
  SymptomId,
  SymptomMatch,
  SymptomWeight,
  TriageSeverity
} from '../types/symptomChecker.types';
import { EMERGENCY_PATTERNS } from '../data/symptomMatrix';

const SEVERITY_RANK: Record<TriageSeverity, number> = {
  [TriageSeverity.CRITICAL]: 3,
  [TriageSeverity.URGENT]: 2,
  [TriageSeverity.FIRST_AID]: 1
};

export const matchSymptomsToEmergencies = (
  symptomIds: SymptomId[]
): SymptomMatch[] => {
  if (!symptomIds || symptomIds.length === 0) {
    return [];
  }

  const matches: SymptomMatch[] = [];

  for (const pattern of EMERGENCY_PATTERNS) {
    const matchedWeighted = pattern.symptoms.filter((s) =>
      symptomIds.includes(s.id)
    );

    if (matchedWeighted.length === 0) {
      continue;
    }

    const matchedSymptoms = matchedWeighted.map((s) => s.id);
    const matchedWeight = matchedWeighted.reduce((sum, s) => sum + s.weight, 0);
    const totalWeight = pattern.symptoms.reduce((sum, s) => sum + s.weight, 0);
    const confidence = totalWeight > 0 ? (matchedWeight / totalWeight) * 100 : 0;

    let hardFlagTriggered = false;
    let severity = pattern.defaultSeverity;

    for (const rule of pattern.hardFlags) {
      const allPassed =
        !rule.requiredAll ||
        rule.requiredAll.every((id) => symptomIds.includes(id));
      const anyPassed =
        !rule.requiredAny ||
        rule.requiredAny.some((id) => symptomIds.includes(id));

      if (allPassed && anyPassed) {
        hardFlagTriggered = true;
        severity = rule.forcedSeverity;
        break;
      }
    }

    const hasSufficientWeight = matchedWeighted.some(
      (s) => s.weight >= SymptomWeight.SPECIFIC
    );

    if (hardFlagTriggered || hasSufficientWeight) {
      matches.push({
        emergencyId: pattern.id,
        severity,
        confidence: Math.round(confidence),
        matchedSymptoms,
        hardFlagTriggered
      });
    }
  }

  matches.sort((a, b) => {
    const rankDiff = SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity];
    if (rankDiff !== 0) return rankDiff;
    return b.confidence - a.confidence;
  });

  return matches;
};

export const checkSymptoms = (symptomIds: SymptomId[]): SymptomCheckResult => {
  if (!symptomIds || symptomIds.length === 0) {
    return {
      primary: null,
      secondary: [],
      isCritical: false,
      fallback: false
    };
  }

  const matches = matchSymptomsToEmergencies(symptomIds);

  if (matches.length === 0) {
    return {
      primary: null,
      secondary: [],
      isCritical: false,
      fallback: true
    };
  }

  const primary = matches[0];

  const secondary = matches
    .slice(1)
    .filter(
      (m) =>
        m.severity === TriageSeverity.CRITICAL ||
        m.confidence >= 40 ||
        (m.severity === primary.severity && m.confidence >= 35)
    )
    .slice(0, 2);

  const isCritical = matches.some((m) => m.severity === TriageSeverity.CRITICAL);

  return {
    primary,
    secondary,
    isCritical,
    fallback: false
  };
};

export const matchSymptomsToEmergency = (
  symptoms: string[]
): { emergencyId: string; confidence: number } | null => {
  const result = checkSymptoms(symptoms as SymptomId[]);
  if (result.primary) {
    return {
      emergencyId: result.primary.emergencyId,
      confidence: result.primary.confidence
    };
  }
  return null;
};