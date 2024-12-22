import {
  ResetIcon,
  DeleteIcon,
  LeftRightArrowIcon,
  OnlineIcon,
} from "@/assets/icons/SVG/RandomIcons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { globalStyles } from "@/constants/globalStyles";
import { useExpense } from "@/context/ExpanseContext";

import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { View, StyleSheet, TouchableOpacity } from "react-native";

const setting = () => {
  const iconColor = useThemeColorWithName("icon");
  const bg = useThemeColorWithName("blurBg");
  const color = useThemeColorWithName("highLightBackground");

  const { reset } = useExpense();

  return (
    <ThemedView style={[globalStyles.mainContainer, { gap: 15 }]}>
      <ThemedText style={{ paddingLeft: 10, color }} type="title">
        Settings
      </ThemedText>
      <View>
        <ThemedText type="subtitle">🌐 Go Online & Sync</ThemedText>
        <ThemedText type="smallText">
          Log in to stay in sync! Tap to update your data in real-time—it's like magic! ✨
        </ThemedText>

        {/* Log in ANd Sign In  */}
        <TouchableOpacity style={[styles.btn, { backgroundColor: bg }]}>
          <OnlineIcon color={iconColor} />
          <ThemedText>Go Online</ThemedText>
        </TouchableOpacity>
        {/* Sync Features */}
        <TouchableOpacity style={[styles.btn, { backgroundColor: bg }]}>
          <LeftRightArrowIcon color={iconColor} />
          <ThemedText>Unification</ThemedText>
        </TouchableOpacity>
      </View>
      <View>
        <ThemedText type="subtitle">🔄 Reset : Forget Past</ThemedText>
        {/* Track Reset */}
        <ThemedText type="smallText">
          Time to clear the slate! Hit reset for a fresh start—no strings attached. Letting go feels
          great! 😎
        </ThemedText>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: bg }]}
          onPress={() => {
            reset();
          }}
        >
          <ResetIcon color={iconColor} />
          <ThemedText>Reset</ThemedText>
        </TouchableOpacity>
      </View>
      <View>
        <ThemedText type="subtitle">⚙️ Account Setting</ThemedText>
        <ThemedText type="smallText">
          Take control of your account! Log out to step away or delete it entirely for a fresh
          start. Your account, your choice.💪
        </ThemedText>
        {/* Log Out  */}
        <TouchableOpacity style={[styles.btn, styles.logoutBtn, { backgroundColor: bg }]}>
          <ThemedText style={{ color: "#bababad3" }}>Log Out</ThemedText>
        </TouchableOpacity>
        {/* Account Delete */}
        <TouchableOpacity style={[styles.btn, styles.deleteButton]}>
          <DeleteIcon color="#de0000ce" />
          <ThemedText style={{ color: "gray" }}>Delete Account</ThemedText>
        </TouchableOpacity>
        <ThemedText type="smallText">
          Deleting your account erases all your digital traces. Make sure you're 100% sure—it&#39;s
          the ultimate reset! 🗑️
        </ThemedText>
      </View>
    </ThemedView>
  );
};

export default setting;
const styles = StyleSheet.create({
  btn: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    width: "60%",

    marginVertical: 10,
  },
  btnText: {
    display: "flex",

    alignItems: "center",
    gap: 10,
  },
  logoutBtn: {
    paddingHorizontal: 30,
    backgroundColor: "#0000002a",

    marginTop: 20,
  },
  deleteButton: {
    borderWidth: 2,
    backgroundColor: "#5604042a",
    marginTop: 30,
    borderColor: "#de0000ff",
  },
});
