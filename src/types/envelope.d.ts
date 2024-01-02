export interface Envelope {
  id: number;
  signature_id: number;
  signature: string;
  uniqid: string;
  emailSubject: string;
  emailMessage: string;
  trash: number;
  draft_status: number;
  complete_incomplete: string;
  status: number;
  created_by: number;
  updated_by: number;
  deleted: number;
  created_at: string;
  updated_at: string;
  view_btn: string;
  download_btn: string;
  action: string;
  DT_RowIndex: number;
  recEmail: string;
}
