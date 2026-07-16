import { Pressable, View } from "react-native";
import { RightArrowIcon } from "@/assets/icons/SVG/RandomIcons";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { ThemedText } from "../ThemedText";
import { Href, useRouter } from "expo-router";

interface RedirectButtonProps {
  label: string;
  icon: React.JSX.Element;
  redirectUrl?: Href;
}

const RedirectButton = ({
  label,
  icon,
  redirectUrl = "/(tabs)",
}: RedirectButtonProps) => {
  const accent = useThemeColorWithName("button");
  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");
  const text = useThemeColorWithName("text");
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(redirectUrl)}
      android_ripple={{ color: accent + "22" }}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: pressed ? accent + "25" : cardBorder,
        backgroundColor: surface,
        marginVertical: 5,
        overflow: "hidden",
        opacity: pressed ? 0.92 : 1,
      })}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View
          style={{
            width: 42,
            aspectRatio: 1,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: accent + "22",
          }}
        >
          {icon}
        </View>
        <ThemedText type="defaultSemiBold" colorName="antiFlashWhite">
          {label}
        </ThemedText>
      </View>
      <RightArrowIcon color={text} />
    </Pressable>
  );
};

export default RedirectButton;
