import User from './user.d.ts';

export interface DashboardAPI {
  message: string;
  signature: Signature;
  status: boolean;
  user: User;
  WaitingForOthers: number;
  CompletedEmails: number;
  expiredEmails: number;
  Requests: number;
  AcceptedList: number;
  Rejected: number;
  Done: number;
}
