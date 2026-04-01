export interface UserAiSettingsRow {
  userId: string;
  providerId: string;
  model: string | null;
  apiKey: string | null;
  createdAt: Date;
  updatedAt: Date;
}
