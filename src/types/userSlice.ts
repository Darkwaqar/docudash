import { SignUpStackParamList } from './navigation';
import { notificationType } from './notification';
import { User } from './user';

export interface IUserSlice {
  accessToken: string | null;
  profile: User | null;
  wishList: Array<string>;
  userType: null | 'User' | 'Notary';
  userStep: number;
  notaryStep: number;
  signUpToken: string | null;
  notification:notificationType
}
