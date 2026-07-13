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
  const placeTextColor = useThemeColorWithName("textMuted");
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
  hero = false,
}: InputBoxProps & { icon: React.JSX.Element; hero?: boolean }) {
  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");
  const inputTextColor = useThemeColorWithName("text");
  const accent = useThemeColorWithName("button");
  return (
    <View style={{ width: "100%" }}>
      <KeyboardAvoidingView
        style={[
          styles.field,
          { backgroundColor: surface, borderColor: cardBorder },
        ]}
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
          style={[
            styles.fieldInput,
            hero && styles.heroInput,
            { color: hero ? accent : inputTextColor },
          ]}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

export function SmallInputBox({
  placeholder,
  keyboardType = "default",
  value,
  setValue,
  icon,
}: InputBoxProps & { icon: React.JSX.Element }) {

  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");
  const inputTextColor = useThemeColorWithName("text");
  return (
    <KeyboardAvoidingView
      style={[
        styles.field,
        {
          backgroundColor: surface,
          borderColor: cardBorder,
          width: "70%",
          paddingLeft: 10,
        },
      ]}
      enabled
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {icon}
      <InputBox
        placeholder={placeholder}
        keyboardType={keyboardType}
        value={value}
        setValue={setValue}
        style={[styles.fieldInput, { color: inputTextColor }]}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    minHeight: 54,
  },
  fieldInput: { flex: 1, fontSize: 15, height: 52 },
  heroInput: { fontSize: 28, fontWeight: "600", height: 60 },
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
