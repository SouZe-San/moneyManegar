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
    money: <WalletIcon color={isFocused ? focusedIconColor : iconColor} isFocused={isFocused} />,
  };

  return icons[iconName as keyof typeof icons];
};
