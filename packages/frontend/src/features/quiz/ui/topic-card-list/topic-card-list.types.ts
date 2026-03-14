interface TopicCardListItem {
  id: string;
  name: string;
  description: string;
  questionsCount: number;
  score: number | null;
  inProgress: boolean;
}

export type { TopicCardListItem };
