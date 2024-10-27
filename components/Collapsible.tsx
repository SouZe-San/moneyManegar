import { PropsWithChildren, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import {
  MailIcon,
  HelpIcon,
  PrivacyIcon,
  ServiceIcon,
  SettingIcon,
  TermsIcon,
} from "@/assets/icons/SVG/RandomIcons";
import { UserIcon } from "@/assets/icons/SVG/NavIcon";

export function Collapsible({
  children,
  title,
  iconName,
}: PropsWithChildren & { title: string; iconName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const iconColor = useThemeColorWithName("icon");
  const selectIconColor = useThemeColorWithName("tabIconSelected");
  const bg = useThemeColorWithName("blurBg");

  const collapseIcons = {
    mailIcon: <MailIcon color={isOpen ? selectIconColor : iconColor} isFocused={isOpen} />,
    helpIcon: <HelpIcon color={isOpen ? selectIconColor : iconColor} isFocused={isOpen} />,
    privacyIcon: <PrivacyIcon color={isOpen ? selectIconColor : iconColor} isFocused={isOpen} />,
    serviceIcon: <ServiceIcon color={isOpen ? selectIconColor : iconColor} isFocused={isOpen} />,
    settingIcon: <SettingIcon color={isOpen ? selectIconColor : iconColor} isFocused={isOpen} />,
    termsIcon: <TermsIcon color={isOpen ? selectIconColor : iconColor} isFocused={isOpen} />,
    userIcon: <UserIcon color={isOpen ? selectIconColor : iconColor} isFocused={isOpen} />,
  };

  return (
    <ThemedView>
      <View style={[styles.titleBox, { borderColor: bg, backgroundColor: bg }]}>
        <TouchableOpacity
          style={styles.heading}
          onPress={() => setIsOpen((value) => !value)}
          activeOpacity={0.8}
        >
          {collapseIcons[iconName as keyof typeof collapseIcons]}

          <ThemedText type="defaultSemiBold">{title}</ThemedText>
        </TouchableOpacity>
      </View>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleBox: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
