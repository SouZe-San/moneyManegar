import { TouchableOpacity, View } from "react-native";
import { RightArrowIcon } from "@/assets/icons/SVG/RandomIcons";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { ThemedText } from "../ThemedText";
import { Href, useRouter } from "expo-router";

interface RedirectButtonProps {
  label: string;
  icon: React.JSX.Element;
  redirectUrl?: Href;
}

const RedirectButton = ({ label, icon, redirectUrl = "/(tabs)" }: RedirectButtonProps) => {
  const bg = useThemeColorWithName("blurBg");
  const balanceBg = useThemeColorWithName("highLightBackground");
  const text = useThemeColorWithName("text");
  const router = useRouter();
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: bg,
        backgroundColor: bg,
        marginVertical: 5,
      }}
    >
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
        onPress={() => router.push(redirectUrl)}
        activeOpacity={0.5}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {icon}
          <ThemedText type="defaultSemiBold">{label}</ThemedText>
        </View>
        <RightArrowIcon color={text} />
      </TouchableOpacity>
    </View>
  );
};

export default RedirectButton;
