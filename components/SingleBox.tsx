import { View, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "./ThemedText";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

type SingleBoxProps = {
  icon: string | React.JSX.Element;
  label: string;
  isSelected?: boolean;
  onPress?: () => void;
};

const SingleBox = ({
  icon,
  label,
  isSelected = false,
  onPress = () => console.warn("pressed"),
}: SingleBoxProps) => {
  const borderColor = useThemeColorWithName("buttonBg");
  const selectedBorderColor = useThemeColorWithName("borderColor");
  const unSelectedButtonBgColor = useThemeColorWithName("blurBg");
  const selectedButtonBgColor = useThemeColorWithName("toggleButton");

  return (
    <View style={[styles.expenseTypeButton]}>
      <Pressable
        style={[
          styles.expenseTypeButton_btn,
          {
            borderColor: isSelected ? selectedBorderColor : borderColor,
            backgroundColor: isSelected ? selectedButtonBgColor : unSelectedButtonBgColor,
          },
        ]}
        onPress={onPress}
      >
        <ThemedText style={styles.buttonLabel}>{icon}</ThemedText>
      </Pressable>
      <ThemedText style={styles.buttonSubLabel} colorName="buttonBg">
        {label}
      </ThemedText>
    </View>
  );
};

export default SingleBox;
const styles = StyleSheet.create({
  expenseTypeButton: {
    // width: 60,
    height: 90,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  expenseTypeButton_btn: {
    backdropFilter: "blur(10px)",
    backgroundColor: "#bababa93",
    width: 60,
    aspectRatio: 1,
    display: "flex",
    borderWidth: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonLabel: {
    fontSize: 20,
  },
  buttonSubLabel: {
    fontSize: 12,
  },
});
