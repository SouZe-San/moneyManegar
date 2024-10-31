import { Pressable, StyleSheet } from "react-native";
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
    <Pressable style={[styles.button, { backgroundColor: buttonBgColor }]} onPress={props.onPress}>
      <ThemedText style={{ color: buttonTextColor }} type="defaultSemiBold">
        {" "}
        {props.button_label}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    width: "100%",
    height: 50,
  },
});
export default SubmitButton;
