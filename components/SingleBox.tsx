import { View, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "./ThemedText";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

type SingleBoxProps = {
  icon: string;
  label: string;
  isSelected?: boolean;
};

const SingleBox = ({ icon, label, isSelected = false }: SingleBoxProps) => {
  const borderColor = useThemeColorWithName("borderColor");
  const buttonBgColor = useThemeColorWithName("highLightBackground");

  return (
    <View style={[styles.expenseTypeButton]}>
      <Pressable
        style={[
          styles.expenseTypeButton_btn,
          {
            borderColor,
            backgroundColor: isSelected ? buttonBgColor : "transparent",
          },
        ]}
        onPress={() => console.warn("pressed")}
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
