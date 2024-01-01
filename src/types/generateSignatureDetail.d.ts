import { User } from './user';

export interface GenerateSignatureDetail {
  id: number;
  signature_id: number;
  uniqid: string;
  recName: string;
  recEmail: string;
  sign_type: string;
  emailSubject: string;
  emailMessage: string;
  access_code: string;
  generateSignatureDetailsID: number;
  private_message: string;
  hostName: string;
  hostEmail: string;
  recipient_id: number;
  trash: number;
  deleted_by: number;
  draft_status: number;
  complete_incomplete: number;
  status: number;
  created_by: number;
  updated_by: number;
  deleted: number;
  created_at: string;
  updated_at: string;
  user: User;
}
