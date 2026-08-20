import {
  EmergencyPattern,
  SymptomWeight,
  TriageSeverity
} from '../types/symptomChecker.types';

export const EMERGENCY_PATTERNS: EmergencyPattern[] = [
  {
    id: 'cpr',
    defaultSeverity: TriageSeverity.CRITICAL,
    symptoms: [
      { id: 'unconscious', weight: SymptomWeight.RED_FLAG },
      { id: 'notBreathing', weight: SymptomWeight.RED_FLAG },
      { id: 'noPulse', weight: SymptomWeight.RED_FLAG }
    ],
    hardFlags: [
      {
        description: 'Unconscious and not breathing requires immediate CPR',
        requiredAll: ['unconscious', 'notBreathing'],
        forcedSeverity: TriageSeverity.CRITICAL
      },
      {
        description: 'Unconscious with no pulse requires immediate CPR',
        requiredAll: ['unconscious', 'noPulse'],
        forcedSeverity: TriageSeverity.CRITICAL
      }
    ]
  },
  {
    id: 'heart_attack',
    defaultSeverity: TriageSeverity.URGENT,
    symptoms: [
      { id: 'chestPain', weight: SymptomWeight.RED_FLAG },
      { id: 'radiatingPain', weight: SymptomWeight.RED_FLAG },
      { id: 'breathingDifficulty', weight: SymptomWeight.SPECIFIC },
      { id: 'suddenWeakness', weight: SymptomWeight.SPECIFIC },
      { id: 'coldSweating', weight: SymptomWeight.SUPPORTIVE },
      { id: 'dizziness', weight: SymptomWeight.SUPPORTIVE },
      { id: 'nauseaVomiting', weight: SymptomWeight.SUPPORTIVE }
    ],
    hardFlags: [
      {
        description: 'Chest pain with secondary cardiac symptoms indicates critical acute coronary syndrome',
        requiredAll: ['chestPain'],
        requiredAny: [
          'breathingDifficulty',
          'radiatingPain',
          'coldSweating',
          'suddenWeakness'
        ],
        forcedSeverity: TriageSeverity.CRITICAL
      }
    ]
  },
  {
    id: 'bleeding',
    defaultSeverity: TriageSeverity.URGENT,
    symptoms: [
      { id: 'heavyBleeding', weight: SymptomWeight.RED_FLAG },
      { id: 'vomitingBlood', weight: SymptomWeight.RED_FLAG },
      { id: 'weakPulse', weight: SymptomWeight.SPECIFIC },
      { id: 'dizziness', weight: SymptomWeight.SUPPORTIVE },
      { id: 'coldSweating', weight: SymptomWeight.SUPPORTIVE }
    ],
    hardFlags: [
      {
        description: 'Heavy external bleeding is a critical emergency requiring immediate hemorrhage control',
        requiredAll: ['heavyBleeding'],
        forcedSeverity: TriageSeverity.CRITICAL
      },
      {
        description: 'Vomiting blood indicates severe internal gastrointestinal hemorrhage',
        requiredAll: ['vomitingBlood'],
        forcedSeverity: TriageSeverity.CRITICAL
      }
    ]
  },
  {
    id: 'shock',
    defaultSeverity: TriageSeverity.URGENT,
    symptoms: [
      { id: 'unconscious', weight: SymptomWeight.RED_FLAG },
      { id: 'weakPulse', weight: SymptomWeight.RED_FLAG },
      { id: 'heavyBleeding', weight: SymptomWeight.SPECIFIC },
      { id: 'coldSweating', weight: SymptomWeight.SUPPORTIVE },
      { id: 'dizziness', weight: SymptomWeight.SUPPORTIVE },
      { id: 'suddenWeakness', weight: SymptomWeight.SUPPORTIVE }
    ],
    hardFlags: [
      {
        description: 'Weak pulse with cold sweating indicates decompensated hypoperfusion / shock',
        requiredAll: ['weakPulse', 'coldSweating'],
        forcedSeverity: TriageSeverity.CRITICAL
      },
      {
        description: 'Unconscious state with weak pulse indicates critical circulatory collapse',
        requiredAll: ['unconscious', 'weakPulse'],
        forcedSeverity: TriageSeverity.CRITICAL
      }
    ]
  },
  {
    id: 'snake_bite',
    defaultSeverity: TriageSeverity.URGENT,
    symptoms: [
      { id: 'snakeBiteMarks', weight: SymptomWeight.RED_FLAG },
      { id: 'swellingAtBiteSite', weight: SymptomWeight.SPECIFIC },
      { id: 'numbnessOrTingling', weight: SymptomWeight.SPECIFIC },
      { id: 'breathingDifficulty', weight: SymptomWeight.SPECIFIC },
      { id: 'dizziness', weight: SymptomWeight.SUPPORTIVE },
      { id: 'weakPulse', weight: SymptomWeight.SUPPORTIVE }
    ],
    hardFlags: [
      {
        description: 'Bite marks combined with systemic or local envenomation signs is critical',
        requiredAll: ['snakeBiteMarks'],
        requiredAny: [
          'swellingAtBiteSite',
          'numbnessOrTingling',
          'breathingDifficulty',
          'dizziness',
          'weakPulse'
        ],
        forcedSeverity: TriageSeverity.CRITICAL
      }
    ]
  },
  {
    id: 'burns',
    defaultSeverity: TriageSeverity.FIRST_AID,
    symptoms: [
      { id: 'extensiveBurn', weight: SymptomWeight.RED_FLAG },
      { id: 'burnInjury', weight: SymptomWeight.SPECIFIC },
      { id: 'breathingDifficulty', weight: SymptomWeight.SPECIFIC }
    ],
    hardFlags: [
      {
        description: 'Extensive or deep burn is a critical trauma emergency',
        requiredAll: ['extensiveBurn'],
        forcedSeverity: TriageSeverity.CRITICAL
      },
      {
        description: 'Burn injury with breathing difficulty indicates potential inhalation airway burn',
        requiredAll: ['burnInjury', 'breathingDifficulty'],
        forcedSeverity: TriageSeverity.CRITICAL
      }
    ]
  }
];
