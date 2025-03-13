import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import * as SecureStore from "expo-secure-store";
// components
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { globalStyles } from "@/constants/globalStyles";

// hooks
import { resetDb } from "@/hooks/useQueries";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

// icons
import {
  ResetIcon,
  DeleteIcon,
  LeftRightArrowIcon,
  OnlineIcon,
} from "@/assets/icons/SVG/RandomIcons";
import { useRouter } from "expo-router";
import { showToast, showToastWithMsg } from "@/hooks/useFunc";
import { useExpense } from "@/context/ExpanseContext";

const setting = () => {
  // Colors
  const iconColor = useThemeColorWithName("icon");
  const bg = useThemeColorWithName("blurBg");

  const sqlDb = useSQLiteContext();
  const router = useRouter();
  const { onRefresh } = useExpense();

  const reset = async () => {
    try {
      await resetDb(sqlDb);
      onRefresh();
      showToast("CLEAR");
    } catch (error) {
      showToast("ERROR");
      console.log("Error Resetting Data", error);
    }
  };

  const cleanHandler = async () => {
    await reset();
    router.push("/(tabs)");
  };

  const deleteAccount = async () => {
    try {
      await reset();
      await SecureStore.deleteItemAsync("onboarding");
      await SecureStore.deleteItemAsync("user");
      await SecureStore.deleteItemAsync("email");
      await SecureStore.deleteItemAsync("dir");
      await SecureStore.deleteItemAsync("profile");
      router.navigate("/onboarding");
    } catch (error) {
      showToastWithMsg("😹 Failed !! ");
      console.log("Error Deleting Account", error);
    }
  };
  return (
    <ThemedView style={[globalStyles.mainContainer, { gap: 15 }]}>
      <ThemedText style={{ paddingLeft: 10 }} type="title">
        Settings
      </ThemedText>
      <View>
        <ThemedText type="subtitle" colorName="mountainMeadow">
          🌐 Go Online & Sync
        </ThemedText>
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
        <ThemedText type="subtitle" colorName="mountainMeadow">
          🔄 Reset : Forget Past
        </ThemedText>
        {/* Track Reset */}
        <ThemedText type="smallText">
          Time to clear the slate! Hit reset for a fresh start—no strings attached. Letting go feels
          great! 😎
        </ThemedText>

        <TouchableOpacity style={[styles.btn, { backgroundColor: bg }]} onPress={cleanHandler}>
          <ResetIcon color={iconColor} />
          <ThemedText>Reset</ThemedText>
        </TouchableOpacity>
      </View>
      <View>
        <ThemedText type="subtitle" colorName="mountainMeadow">
          ⚙️ Account Setting
        </ThemedText>
        <ThemedText type="smallText">
          Take control of your account! Log out to step away or delete it entirely for a fresh
          start. Your account, your choice.💪
        </ThemedText>
        {/* Log Out  */}
        <TouchableOpacity style={[styles.btn, styles.logoutBtn, { backgroundColor: bg }]}>
          <ThemedText style={{ color: "#bababad3" }}>Log Out</ThemedText>
        </TouchableOpacity>
        {/* Account Delete */}
        <TouchableOpacity style={[styles.btn, styles.deleteButton]} onPress={deleteAccount}>
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
