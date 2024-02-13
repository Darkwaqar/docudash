import { GenerateSignature } from './generateSignature';
import { GenerateSignatureDetail } from './generateSignatureDetail';

export interface ViewDocument {
  success: boolean;
  message: string;
  generateSignature: GenerateSignature;
  generateSignatureDetails: GenerateSignatureDetail[];
  generateSignatureDetailsFinalise: GenerateSignatureDetailsFinalise;
}
