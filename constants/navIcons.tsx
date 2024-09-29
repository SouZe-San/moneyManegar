import {
  MenuIcon,
  MoneyScreenIcon,
  CameraIcon,
  WalletIcon,
  UserIcon,
} from "@/assets/icons/SVG/NavIcon";

export const navIcons = {
  index: (focused: boolean) => (
    <MenuIcon color={focused ? "#00df81" : "#2cc295"} isFocused={focused} />
  ),
  capture: (focused: boolean) => (
    <CameraIcon color={focused ? "#00df81" : "#2cc295"} isFocused={focused} />
  ),
  explore: (focused: boolean) => (
    <UserIcon color={focused ? "#00df81" : "#2cc295"} isFocused={focused} />
  ),
  transaction: (focused: boolean) => (
    <MoneyScreenIcon color={focused ? "#00df81" : "#2cc295"} isFocused={focused} />
  ),
  money: (focused: boolean) => (
    // <Ionicons
    //   name={focused ? "wallet" : "wallet-outline"}
    //   size={24}
    //   color={focused ? "#00df81" : "#2cc295"}
    // />
    <WalletIcon color={focused ? "#00df81" : "#2cc295"} isFocused={focused} />
  ),
};

{
  /* <FontAwesome
  name={focused ? "user" : "user-o"}
  size={24}
  color={focused ? "#00df81" : "#2cc295"}
/> */
}
