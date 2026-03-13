export const successAnswers = [
  'Spot on! Keep that momentum going!',
  'Brilliant! You clearly know your stuff',
  "Nice work! You're cruising through this",
  'Boom! That’s exactly right',
  "Perfect! You've got a sharp eye for detail",
  'Excellent! One step closer to mastery',
  "Correct! You're making this look easy",
  'Great job! Your logic is flawless',
] as const;

export const errorAnswers = {
  required: 'Please select an answer',
  requiredQuestionId: 'Question id is missing',
  timeExpired: 'Time for an answer has expired',
} as const;
