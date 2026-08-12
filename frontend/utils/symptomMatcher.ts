
export interface SymptomMatch {
  emergencyId: string;
  confidence: number;
}

export const matchSymptomsToEmergency = (symptoms: string[]): SymptomMatch | null => {
  if (symptoms.length === 0) return null;

  const patterns: Record<string, { symptoms: string[]; id: string }> = {
    heart_attack: {
      symptoms: ['chestPain', 'suddenWeakness', 'coldSweating', 'dizziness'],
      id: 'heart_attack'
    },
    bleeding: {
      symptoms: ['heavyBleeding', 'vomitingBlood'],
      id: 'bleeding'
    },
    choking: {
      symptoms: ['breathingDifficulty'],
      id: 'choking'
    },
    shock: {
      symptoms: ['unconscious', 'weakPulse', 'coldSweating'],
      id: 'shock'
    },
    burns: {
      symptoms: ['burnInjury'],
      id: 'burns'
    },
    fracture: {
      symptoms: ['bonePain'],
      id: 'fracture'
    }
  };

  const scores: { id: string; score: number }[] = [];

  Object.entries(patterns).forEach(([key, pattern]) => {
    const matchCount = symptoms.filter(s => pattern.symptoms.includes(s)).length;
    if (matchCount > 0) {
      const confidence = (matchCount / pattern.symptoms.length) * 100;
      scores.push({ id: pattern.id, score: confidence });
    }
  });

  if (scores.length > 0) {
    scores.sort((a, b) => b.score - a.score);
    return {
      emergencyId: scores[0].id,
      confidence: scores[0].score
    };
  }

  return null;
};