import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

interface SubmitButtonProps {
  onPress?: () => void;
  button_label: string;
}

const SubmitButton = (props: SubmitButtonProps) => {
  const buttonBgColor = useThemeColorWithName("button");
  const buttonTextColor = useThemeColorWithName("background");
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[styles.button, { backgroundColor: buttonBgColor }]}
      onPress={props.onPress}
    >
      <ThemedText style={{ color: buttonTextColor }} type="defaultSemiBold">
        {" "}
        {props.button_label}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,

    width: "100%",
    height: 50,
  },
});
export default SubmitButton;
