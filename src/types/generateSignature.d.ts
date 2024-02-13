import { User } from './user';

export interface GenerateSignature {
  id?: number;
  signature_id: number;
  signature?: string;
  uniqid: string;
  emailSubject?: string;
  emailMessage?: string;
  trash?: number;
  draft_status?: number;
  complete_incomplete?: number;
  status?: number;
  created_by?: number;
  updated_by?: number;
  deleted?: number;
  created_at?: date;
  updated_at?: date;
  email: string;
  user?: User;
}
