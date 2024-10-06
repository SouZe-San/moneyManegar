import {
  MenuIcon,
  MoneyScreenIcon,
  CameraIcon,
  WalletIcon,
  UserIcon,
} from "@/assets/icons/SVG/NavIcon";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

export const navIcons = (iconName: string, isFocused: boolean) => {
  var iconColor = useThemeColorWithName("tabIconDefault");
  var focusedIconColor = useThemeColorWithName("tabIconSelected");

  const icons = {
    index: <MenuIcon color={isFocused ? focusedIconColor : iconColor} isFocused={isFocused} />,
    capture: <CameraIcon color={isFocused ? focusedIconColor : iconColor} isFocused={isFocused} />,
    explore: <UserIcon color={isFocused ? focusedIconColor : iconColor} isFocused={isFocused} />,
    transaction: (
      <MoneyScreenIcon color={isFocused ? focusedIconColor : iconColor} isFocused={isFocused} />
    ),
    money: (
      // <Ionicons
      //   name={focused ? "wallet" : "wallet-outline"}
      //   size={24}
      //   color={focused ? "#00df81" : "#2cc295"}
      // />
      <WalletIcon color={isFocused ? focusedIconColor : iconColor} isFocused={isFocused} />
    ),
  };
  // const icons = {
  //   index: (focused: boolean) => (
  //     <MenuIcon color={focused ? focusedIconColor : iconColor} isFocused={focused} />
  //   ),
  //   capture: (focused: boolean) => (
  //     <CameraIcon color={focused ? "#00df81" : iconColor} isFocused={focused} />
  //   ),
  //   explore: (focused: boolean) => (
  //     <UserIcon color={focused ? focusedIconColor : "#2cc295"} isFocused={focused} />
  //   ),
  //   transaction: (focused: boolean) => (
  //     <MoneyScreenIcon color={focused ? "#00df81" : "#2cc295"} isFocused={focused} />
  //   ),
  //   money: (focused: boolean) => (
  //     // <Ionicons
  //     //   name={focused ? "wallet" : "wallet-outline"}
  //     //   size={24}
  //     //   color={focused ? "#00df81" : "#2cc295"}
  //     // />
  //     <WalletIcon color={focused ? "#00df81" : "#2cc295"} isFocused={focused} />
  //   ),
  // };
  return icons[iconName as keyof typeof icons];
};

// export const navIcons = {
//   index: (focused: boolean) => (
//     <MenuIcon color={focused ? focusedIconColor : iconColor} isFocused={focused} />
//   ),
//   capture: (focused: boolean) => (
//     <CameraIcon color={focused ? "#00df81" : iconColor} isFocused={focused} />
//   ),
//   explore: (focused: boolean) => (
//     <UserIcon color={focused ? focusedIconColor : "#2cc295"} isFocused={focused} />
//   ),
//   transaction: (focused: boolean) => (
//     <MoneyScreenIcon color={focused ? "#00df81" : "#2cc295"} isFocused={focused} />
//   ),
//   money: (focused: boolean) => (
//     // <Ionicons
//     //   name={focused ? "wallet" : "wallet-outline"}
//     //   size={24}
//     //   color={focused ? "#00df81" : "#2cc295"}
//     // />
//     <WalletIcon color={focused ? "#00df81" : "#2cc295"} isFocused={focused} />
//   ),
// };

{
  /* <FontAwesome
  name={focused ? "user" : "user-o"}
  size={24}
  color={focused ? "#00df81" : "#2cc295"}
/> */
}
