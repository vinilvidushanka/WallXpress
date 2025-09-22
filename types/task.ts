import { User } from "firebase/auth";
import { Icon } from "phosphor-react-native";
import { ViewStyle } from "react-native";

export type ScreenWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
};

export type accountOptionType = {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  routeName: any;
};

export type UserDataType = {
  name: string;
  image?: ImageUploadType; // uploaded profile image
};

export type UserType = {
  name: string | null;
  email: string | null;
  image?: ImageUploadType; // uploaded profile image
  uid: string;
};

export type ResponseType = {
  success: boolean;
  data?: any;
  message?: string;
};

export type AuthContextType = {
  user: UserType | null;
  setUser: Function;
  login: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    msg?: string;
  }>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<{
    success: boolean;
    msg?: string;
  }>;
  updateUserData: (userId: string) => Promise<void>;
};

export type WalletType = {
  id?: string;
  name: string;
  amount?: number;
  totalIncome?: number;
  totalExpenses?: number;
  image?: ImageUploadType; // wallet image
  uid?: string;
  created?: Date;
};

export type ImageUploadProps = {
  file?: any;
  onSelect: (file: any) => void;
  onClear?: () => void;
  conrainerStyle?: ViewStyle;
  imageStyle?: ViewStyle;
  placeholder?: string;
};

// 🔥 new type for image uploads (store metadata in DB)
export type ImageUploadType = {
  url: string; // firebase storage URL
  path: string; // storage path for delete/update
  name?: string; // original file name
  size?: number; // file size
  type?: string; // mime type
};

export type TransactionListType = {
  data: TransactionType[];
  title?: string;
  loading?: boolean;
  emptyListMessage?: string;
};

export type TransactionItemProps = {
  item: TransactionType;
  index: number;
  handleClick: Function;
};

export type TransactionType = {
  id?: string;
  amount: number;
  category?: string;
  date: Date;
  description?: string;
  image?: ImageUploadType; // transaction bill / receipt image
  type: string;
  uid?: string;
  walletId?: string;
};

export type CategoryType = {
  label: string;
  value: string;
  icon: Icon;
  bgColor: string;
};

export type ExpenseCategoriesType = {
  [key: string]: CategoryType;
};
