// Html Editor

export interface HtmlEditorAPI {
  status: boolean;
  message: string;
  generateSignatureDetails: GenerateSignatureDetail[];
  generateSignatureDetailsFinalise: GenerateSignatureDetails;
  generateSignatureDetailsImages: GenerateSignatureDetails[];
  uniqid: string;
  signature_id: string;
}

export interface GenerateSignatureDetails {
  id: number;
  signature_id: number;
  uniqid: string;
  getEditorContent?: string;
  draggedElArr?: DraggedElArr;
  status: number;
  created_by: number;
  updated_by: number;
  deleted: number;
  created_at: string;
  updated_at: string;
  image?: string;
  base64_encode_image?: null;
  filesArr: [string];
}

export interface DraggedElArr {
  signature: DraggedElement[];
  initial: DraggedElement[];
  stamp: DraggedElement[];
  date: DraggedElement[];
  name: DraggedElement[];
  email: DraggedElement[];
  company: DraggedElement[];
  title: DraggedElement[];
}

export interface DraggedElement {
  type: string;
  icon: string;
  name: string;
  uuid: string;
  left: string;
  top: string;
  element_container_id: string;
  selected_user_id: string;
  selected_user_id_1: string;
  colors: Colors;
  background?: string;
  content?: string;
}

export interface Colors {
  primary: string;
  bg: string;
}
