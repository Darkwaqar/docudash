export interface LocationUpdateResponse {
  NotaryRequests?: NotaryRequests;
  NotaryRequestsDetails?: NotaryRequestsDetails;
  NotaryRequestsDetailsDocuments?: NotaryRequestsDetailsDocument[];
  NotaryRequestsReturnID?: string;
  NotaryReviewCount?: number;
  message?: string;
  status?: boolean;
  success?: boolean;
}

export interface NotaryRequests {
  amount?: string;
  client_secret?: string;
  created_at?: string;
  created_by?: number;
  deleted?: number;
  draggedElArr?: string;
  id?: number;
  individual_details?: Details;
  lat?: null;
  long?: null;
  notary_details?: Details;
  notary_id?: number;
  notary_request_status?: number;
  numOfRecipients?: number;
  pending_payment_id?: string;
  read_status?: number;
  reasonOfRequest?: string;
  requestDate?: string;
  requestLocation?: number;
  requestMessage?: string;
  requestTime?: number;
  request_location_list?: RequestLocationList;
  status?: number;
  stripe_payment_info?: string;
  uniqid?: string;
  updated_at?: string;
  updated_by?: number;
}

export interface Details {
  BannerImage?: null;
  BioDescription?: null;
  LicenseDocument?: null | string;
  ProofOfEmployes?: number;
  ProofOfEmployesDoc?: null;
  ShortDescription?: null;
  VerifyIdentityDocument?: null | string;
  about_notary?: null;
  account_type?: number;
  address1?: null | string;
  address2?: null | string;
  bussiness_start_up_date?: null;
  city?: null | string;
  company?: null;
  country?: null | string;
  created_at?: string;
  created_by?: number;
  deleted?: number;
  device_token?: string;
  email?: string;
  email_verified_at?: null;
  first_name?: string;
  govt_notary_id?: null | string;
  hired_time?: null;
  id?: number;
  image?: string;
  industry_id?: number;
  ip_sign_in?: string;
  ip_sign_up?: null | string;
  last_name?: string;
  lat?: null | string;
  licence_number?: null;
  location_sign_in?: string;
  location_sign_up?: null | string;
  logged_in?: number;
  logged_in_at?: string;
  logged_out_at?: string;
  long?: null | string;
  mobile?: null;
  name?: string;
  notary_document?: null | string;
  notary_document_staus?: number;
  phone?: string;
  profile_photo_url?: string;
  sign_up_reasons_id?: number;
  state?: null | string;
  status?: number;
  steps?: number;
  trial_account?: number;
  trial_account_expired?: number;
  updated_at?: string;
  updated_by?: number;
  user_logged_device_info?: string;
  user_type?: number;
  verification_code?: string;
  verification_code_expire_at?: string;
  verification_date?: string;
  verification_status?: number;
  video_call?: null;
  voxi_user_id?: number;
  zip_code?: number;
}

export interface RequestLocationList {
  address?: string;
  city?: string;
  country?: string;
  created_at?: string;
  created_by?: number;
  deleted?: number;
  id?: number;
  lat?: string;
  long?: string;
  name?: string;
  state?: string;
  status?: number;
  updated_at?: string;
  updated_by?: number;
  user_id?: number;
  uuid?: string;
  zip_code?: string;
}

export interface NotaryRequestsDetails {
  NotaryRequestsReturnID?: number;
  complete_incomplete?: number;
  created_at?: string;
  created_by?: number;
  deleted?: number;
  hostEmail?: null;
  hostName?: null;
  id?: number;
  notary_id?: number;
  recEmail?: string;
  recName?: string;
  recipient_id?: number;
  sign_type?: number;
  status?: number;
  uniqid?: string;
  unique_id?: string;
  updated_at?: string;
  updated_by?: number;
  view_final_response?: null;
}

export interface NotaryRequestsDetailsDocument {
  NotaryRequestsReturnID?: number;
  created_at?: string;
  created_by?: number;
  deleted?: number;
  document?: string;
  id?: number;
  notary_id?: number;
  status?: number;
  uniqid?: null;
  updated_at?: string;
  updated_by?: number;
}
