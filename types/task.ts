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
}
export type UserDataType = {
    name:string;
    image?:any;
}
export type UserType = {
    name: string | null;
    email: string | null;
    image?: any;
    uid: string;
}
export type ResponseType = {
  success: boolean;
  data?: any;
  message?: string;
}
export type AuthContextType = { 
  user: UserType | null;
  setUser: Function;
  login:(
    email: string,
    password: string
  )=>Promise<{
    success: boolean;
    msg?: string;
  }>;
  register:(
    email: string,
    password: string,
    name:string
  )=>Promise<{
    success: boolean;
    msg?: string;
  }>;
  updateUserData:(userId:string)=>Promise<void>;
};

export type WalletType = {
  id?: string;
  name: string;
  amount?: number;
  totalIncome?: number;
  totalExpenses?: number;
  image: any;
  uid?: string;
  created?: Date;
}

export type ImageUplaodProps = {
  file?: any;
  onSelect: (file: any) => void;
  onClear?: () => void;
  conrainerStyle?: ViewStyle;
  imageStyle?: ViewStyle;
  placeholder?: string;
}
export type TransactionListType = {
  data: TransactionType[];
  title?: string;
  loading?: boolean;
  emptyListMessage?: string;
}
export type TransactionItemProps = {
  item: TransactionType;
  index: number;
  handleClick: Function
}
export type TransactionType = {
  id?: string;
  amount: number;
  category?: string;
  date: Date;
  description?: string;
  image?: any;
  type: string;
  uid?: string;
  walletId?: string;
}
export type CategoryType = {
  label: string;
  value: string;
  icon: Icon;
  bgColor: string;

}

export type ExpenseCategoriesType = {
  [key:string]:CategoryType
}