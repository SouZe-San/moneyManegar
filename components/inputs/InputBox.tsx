import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { Text, View, StyleSheet, TextInput, type TextProps } from "react-native";
import { ThemedText } from "../ThemedText";

type InputBoxProps = {
  placeholder: string;
  keyboardType?: "numeric" | "default";
  value: string | undefined;
  setValue: (value: string) => void;
};

export function InputBox({
  placeholder,
  keyboardType = "numeric",
  value,
  setValue,
  style,
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
    />
  );
}

export function InputWithIcon({
  placeholder,
  keyboardType = "numeric",
  icon,
  value,
  setValue,
}: InputBoxProps & { icon: React.JSX.Element }) {
  const borderColor = useThemeColorWithName("borderColor");
  return (
    <View style={[styles.iconInputBox, { borderColor, borderWidth: 1, paddingHorizontal: 10 }]}>
      {icon}
      <InputBox
        placeholder={placeholder}
        keyboardType={keyboardType}
        value={value}
        setValue={setValue}
        style={{ marginLeft: 5, marginVertical: 10 }}
      />
    </View>
  );
}

export function InputWithLabel({
  placeholder,
  label,
  keyboardType = "numeric",
  value,
  setValue,
}: InputBoxProps & { label: string }) {
  const borderColor = useThemeColorWithName("borderColor");
  const labelColor = useThemeColorWithName("text");
  return (
    <View style={[styles.labelInputBox, { borderColor }]}>
      <ThemedText style={styles.label} type="subtitle">
        {label}
      </ThemedText>
      <InputBox
        placeholder={placeholder}
        keyboardType={keyboardType}
        value={value}
        setValue={setValue}
        style={{ marginTop: 10, marginBottom: 5 }}
      />
    </View>
  );
}

export function InputWithLabel_Icon({
  placeholder,
  label,
  keyboardType = "numeric",
  value,
  setValue,
  icon,
}: InputBoxProps & { label: string } & { icon: React.JSX.Element }) {
  const borderColor = useThemeColorWithName("borderColor");

  return (
    <View style={[styles.labelInputBox, { borderColor }]}>
      <ThemedText style={styles.label} type="subtitle">
        {label}
      </ThemedText>
      <View style={[styles.iconInputBox]}>
        {icon}
        <InputBox
          placeholder={placeholder}
          keyboardType={keyboardType}
          value={value}
          setValue={setValue}
          style={{ marginLeft: 5, marginTop: 10, marginBottom: 5 }}
        />
      </View>
    </View>
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
