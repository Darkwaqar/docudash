export interface Recipient {
  id: string;
  recName: string;
  recEmail: string;
  sign_type: string;
  hostName: string;
  hostEmail: string;
  access_code: string;
  private_message: string;
  recipients_update_id: string;
  showDropDown: boolean;
  visible: boolean;
  showAccessCode: boolean;
  showPrivateMessage: boolean;
  isValid: boolean;
}
