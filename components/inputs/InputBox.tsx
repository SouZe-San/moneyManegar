import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { ThemedText } from "../ThemedText";

type InputBoxProps = {
  placeholder: string;
  label?: string;
  keyboardType?: "numeric" | "default";
  value: string | undefined;
  setValue: (value: string) => void;
};

export function InputBox({
  placeholder,
  keyboardType = "numeric",
  value,
  setValue,
}: InputBoxProps) {
  const placeTextColor = useThemeColorWithName("tabIconDefault");
  const inputTextColor = useThemeColorWithName("text");

  return (
    <TextInput
      placeholder={placeholder}
      keyboardType={keyboardType}
      style={[styles.input, { color: inputTextColor }]}
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
    <View style={[styles.iconInputBox, { borderColor }]}>
      {icon}
      <InputBox
        placeholder={placeholder}
        keyboardType={keyboardType}
        value={value}
        setValue={setValue}
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
}: InputBoxProps) {
  return (
    <View style={styles.labelInputBox}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <InputBox
        placeholder={placeholder}
        keyboardType={keyboardType}
        value={value}
        setValue={setValue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    fontSize: 15,
    marginLeft: 5,
    marginVertical: 10,
    color: "white",
    paddingHorizontal: 5,
    width: "70%",
  },
  icon: {
    width: 40,
    height: 30,
    borderWidth: 1,
    borderColor: "red",
  },
  label: {
    fontSize: 14,
    marginBottom: 10,
  },
  iconInputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    justifyContent: "flex-start",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  labelInputBox: {
    flexDirection: "column",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "white",
  },
});
