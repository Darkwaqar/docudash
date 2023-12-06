import { RequestList } from '@screens/Request/List';
import { NotaryOrUser } from '@screens/SignUp1/NotaryOrUser';
import { AddContact } from '@screens/Contact/AddContact';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
  DrawerScreenProps,
} from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { pet } from './pet';
import { Envelope } from './envelope';
import { Recipient } from './recipient';
import { Contact } from './contact';
import { Addresses } from './AddressList';

export type RootStackParamList = {
  Home: NavigatorScreenParams<HomeDrawerParamList>;
  NotFound: undefined;
  Browser: { url: string; heading: string };
  Signatures: {} | undefined;
  AddSignature: { SignaturePreview?: SignaturePreview };
  Inbox: { heading: string };
  Edit:
    | undefined
    | {
        Envelope?: Partial<Envelope>;
        files?: DocumentPickerOptions.DocumentResult[];
        images?: ImagePicker.ImagePickerAsset[];
        Recipients?: Recipient[];
        activeIndex: number;
      };
  DocumentEditor: {
    Envelope: GenerateSignature;
    emailSubject: string;
  };
  Details: {
    Envelope: Envelope;
    heading: string;
  };
  Stamps: {} | undefined;
  AddStamp: { Stamp?: StampPreview };
  Profile: undefined;
  SignUpIndex: undefined;
  NotaryLoginStackNavigator: undefined;
  Template: undefined;
  DocumentViewer: { Envelope: envelope; item?: SignaturePreview; stamp?: StampPreview };
  SignatureSelection: envelope;
  StampSelection: envelope;
  AddRecipient: { Recipients?: Recipient[]; Recipient?: Recipient; Contact?: Contact };
  Contacts: { From?: string };
  AddContact: { Contact?: Contact };
  NotaryOrUser: undefined;
  Map: { details: NotaryRequests };
  NotaryProfile: { item: any };
  Addresses: { From: Addresses };
  AddAddress: { Address?: Address; From?: string; Notary?: string };
  CreateARequest: { email?: string; From?: string; Notary?: string };
  RequestList: { heading: string };
  RequestDetails: { id: number };
  ApproveRequest: undefined | number;
};

export type SignUpStackParamList = {
  NotaryOrUser: undefined;
  Index: { type: string };
  Step1: { api: string };
  Step2: { api: string };
  Step3: { api: string };
  Step4: { industry: Industry[]; signUpReasons: Industry[] };
  Step5: { token: string | undefined; email: string };
  Step6: { token: string | undefined; email: string };
  Browser: { url: string; heading: string };
  Address: { From: Addresses };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<
  RootStackParamList,
  T
>;

export type HomeDrawerParamList = {
  HomeScreen: undefined;
  Latest: undefined;
  INBOX: { heading: string };
};

export type HomeDrawerScreenProps<T extends keyof HomeDrawerParamList> = CompositeScreenProps<
  DrawerScreenProps<HomeDrawerParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

export type SignUpStackScreenProps<T extends keyof SignUpStackParamList> = CompositeScreenProps<
  StackScreenProps<SignUpStackParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
