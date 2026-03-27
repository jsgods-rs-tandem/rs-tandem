export interface ChatHistoryRow extends Record<string, unknown> {
  id: number;
  role: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
