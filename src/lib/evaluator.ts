import { PromptCriteria } from '@/types';

export interface EvaluationResult {
  score: number; // 0-1
  criteriaResults: CriteriaResult[];
  responseVariant: 'excellent' | 'good' | 'needsWork';
}

export interface CriteriaResult {
  criteriaId: string;
  label: string;
  met: boolean;
  weight: number;
}

export function evaluatePrompt(
  userPrompt: string,
  criteria: PromptCriteria[]
): EvaluationResult {
  const normalizedPrompt = userPrompt.toLowerCase().trim();

  const criteriaResults: CriteriaResult[] = criteria.map((criterion) => {
    let met = false;

    // Check keywords (any match counts)
    if (criterion.keywords && criterion.keywords.length > 0) {
      met = criterion.keywords.some((keyword) =>
        normalizedPrompt.includes(keyword.toLowerCase())
      );
    }

    // Check regex patterns (any match counts)
    if (!met && criterion.patterns && criterion.patterns.length > 0) {
      met = criterion.patterns.some((pattern) => {
        try {
          const regex = new RegExp(pattern, 'i');
          return regex.test(userPrompt);
        } catch {
          return false;
        }
      });
    }

    return {
      criteriaId: criterion.id,
      label: criterion.label,
      met,
      weight: criterion.weight,
    };
  });

  // Calculate weighted score
  const totalWeight = criteriaResults.reduce((sum, c) => sum + c.weight, 0);
  const metWeight = criteriaResults
    .filter((c) => c.met)
    .reduce((sum, c) => sum + c.weight, 0);
  const score = totalWeight > 0 ? metWeight / totalWeight : 0;

  // Determine response variant
  let responseVariant: 'excellent' | 'good' | 'needsWork';
  if (score >= 0.8) {
    responseVariant = 'excellent';
  } else if (score >= 0.5) {
    responseVariant = 'good';
  } else {
    responseVariant = 'needsWork';
  }

  return { score, criteriaResults, responseVariant };
}

// Calculate exercise XP based on evaluation score
export function calculateExerciseXP(baseXP: number, score: number): number {
  if (score >= 0.8) return baseXP;
  if (score >= 0.5) return Math.round(baseXP * 0.7);
  return Math.round(baseXP * 0.3);
}
