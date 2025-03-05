import { useThemeColorWithName } from "@/hooks/useThemeColor";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  type TextProps,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ThemedText } from "../ThemedText";

type InputBoxProps = {
  placeholder: string;
  keyboardType?: "numeric" | "default";
  value: string | undefined;
  setValue: (value: string) => void;
  maxLength?: number;
};

export function InputBox({
  placeholder,
  keyboardType = "numeric",
  value,
  setValue,
  style,
  maxLength = 50,
}: InputBoxProps & TextProps) {
  const placeTextColor = useThemeColorWithName("tabIconDefault");
  const inputTextColor = useThemeColorWithName("text");

  return (
    <TextInput
      placeholder={placeholder}
      keyboardType={keyboardType}
      style={[styles.input, { color: inputTextColor }, style]}
      placeholderTextColor={placeTextColor}
      value={value}
      onChangeText={setValue}
      maxLength={maxLength}
    />
  );
}

export function InputWithIcon({
  placeholder,
  keyboardType = "numeric",
  icon,
  value,
  setValue,
  maxLength,
}: InputBoxProps & { icon: React.JSX.Element }) {
  const borderColor = useThemeColorWithName("borderColor");
  return (
    <KeyboardAvoidingView
      style={[styles.iconInputBox, { borderColor, borderWidth: 1, paddingHorizontal: 10 }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={30}
      enabled
    >
      {icon}
      <InputBox
        placeholder={placeholder}
        keyboardType={keyboardType}
        value={value}
        setValue={setValue}
        maxLength={maxLength}
        style={{ marginLeft: 5, marginVertical: 10 }}
      />
    </KeyboardAvoidingView>
  );
}

export function SmallInputBox({
  placeholder,
  keyboardType = "default",
  value,
  setValue,
  icon,
}: InputBoxProps & { icon: React.JSX.Element }) {
  const borderColor = useThemeColorWithName("borderColor");

  return (
    <KeyboardAvoidingView
      style={[styles.iconInputBox, { borderColor, borderWidth: 1, paddingLeft: 10, width: "70%" }]}
      enabled
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {icon}
      <InputBox
        placeholder={placeholder}
        keyboardType={keyboardType}
        value={value}
        setValue={setValue}
        style={{ marginLeft: 5, marginTop: 10, marginBottom: 5 }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    fontSize: 15,

    color: "white",
    paddingHorizontal: 5,
    width: "80%",
  },
  icon: {
    width: 40,
    height: 30,
    borderWidth: 1,
    borderColor: "red",
  },
  label: {
    fontSize: 18,
    marginBottom: -6,
  },
  iconInputBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 10,
  },
  labelInputBox: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "white",
    paddingHorizontal: 10,
  },
});
