import { View, StyleSheet, Pressable, ScrollView } from "react-native";
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
  OnlineIcon,ExportIcon,ImportIcon,
  LogoutIcon
} from "@/assets/icons/SVG/RandomIcons";
import { useRouter } from "expo-router";
import { exportExpensesToCSV, showToast, showToastWithMsg,importDataFromZip } from "@/hooks/useFunc";
import { useExpense } from "@/context/ExpanseContext";
import { WarBonnetIcon } from "@/assets/icons/SVG/ExpanseIcons";
import { useState } from "react";
import AnimateTabView from "@/components/animation/AnimateTabView";

const setting = () => {
  // Colors
   const surface = useThemeColorWithName("surface");
   const cardBorder = useThemeColorWithName("cardBorder");
   const textMuted = useThemeColorWithName("textMuted");


  const [loading, setLoader] = useState(false)
  const [progress, setProgress] = useState(0)

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
      await SecureStore.deleteItemAsync("durationType");
      router.navigate("/onboarding");
    } catch (error) {
      showToastWithMsg("😹 Failed !! ");
      console.log("Error Deleting Account", error);
    }
  };

  const exportDb = async () =>{
    setLoader(true)
    try {
      await exportExpensesToCSV(sqlDb,setProgress);
      showToastWithMsg("Successfully Export ❇️");
    } catch (error) {
      showToastWithMsg("😹 Failed !! ");
      console.log("Error Deleting Account", error);
    }finally{
      setLoader(false)
    }
  }

  const importDb = async () => {
    setLoader(true);
    try {
      const summary = await importDataFromZip(sqlDb, setProgress);
      if (!summary) return; // user cancelled the picker
      onRefresh(); // refresh dashboard totals with the imported data
      showToastWithMsg(
        `Imported ✅ ${summary.expenses + summary.udhar} trans · ${summary.members} members · ${summary.groups} groups · ${summary.budgets} budgets`,
      );
    } catch (error) {
      showToastWithMsg("😹 Import Failed !!");
      console.log("Error importing data", error);
    } finally {
      setProgress(0);
      setLoader(false);
    }
  };
    const SectionTitle = ({ text, color }: { text: string, color?:string }) => (
      <ThemedText
        type="subtitle"
        style={[{ fontSize: 17, marginBottom: 4 , },color ? {color}:{}]}
        colorName="text"
      >
        {text}
      </ThemedText>
    );
    const Desc = ({ text }: { text: string }) => (
      <ThemedText
      colorName="textMuted"
        style={{
          fontSize: 13,
          lineHeight: 19,
          marginBottom: 12,
        }}
      >
        {text}
      </ThemedText>
    );

    if (loading) {
    return (
      <AnimateTabView
        style={[
          globalStyles.container,
          {
            paddingBottom: "20%",
            justifyContent: "center",
            alignItems: "center",

          },
        ]}
      >
        <ThemedText type="title">Progress... {progress}% </ThemedText>
      </AnimateTabView>
    );
  }
  return (
    <ThemedView style={[globalStyles.mainContainer, { gap: 15 }]}>
      <ThemedText
        style={{ paddingLeft: 4 }}
        type="title"
        colorName="antiFlashWhite"
      >
        Settings
      </ThemedText>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 24, paddingBottom: 120, paddingTop: 10 }}
      >
        <View>
          <SectionTitle text="Go Online & Sync" />
          <Desc text="Log in to keep your data synced in real-time — it's like magic ✨" />

          {/* Log in ANd Sign In  */}
          <View style={styles.buttonContainer}>
            <Pressable
              android_ripple={{ color: "#34D399" + "22" }}
              style={({ pressed }) => [
                styles.btn,
                {
                  backgroundColor: surface,
                  borderColor: pressed ? "#34D399" + "55" : cardBorder,
                  opacity: pressed ? 0.94 : 1,
                },
              ]}
            >
              <View
                style={[styles.chip, { backgroundColor: "#34D399" + "22" }]}
              >
                <OnlineIcon color="#34D399" />
              </View>
              <ThemedText
                type="defaultSemiBold"
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: "#ced1d0",
                }}
              >
                Go Online
              </ThemedText>
            </Pressable>
            {/* Sync Features */}
            <Pressable
              android_ripple={{ color: "#38BDF8" + "22" }}
              style={({ pressed }) => [
                styles.btn,
                {
                  backgroundColor: surface,
                  borderColor: pressed ? "#38BDF8" + "55" : cardBorder,
                  opacity: pressed ? 0.94 : 1,
                },
              ]}
            >
              <View
                style={[styles.chip, { backgroundColor: "#38BDF8" + "22" }]}
              >
                <LeftRightArrowIcon color="#38BDF8" />
              </View>
              <ThemedText
                type="defaultSemiBold"
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: "#ced1d0",
                }}
              >
                Unification
              </ThemedText>
            </Pressable>
          </View>
        </View>
        <View>
          {/* Import */}
          <SectionTitle text="Data & Backup" />
          <Desc text="Save all your data to a file, or restore it from a backup zip." />
          <View style={styles.buttonContainer}>
            <Pressable
              android_ripple={{ color: "#FBBF24" + "22" }}
              style={({ pressed }) => [
                styles.btn,
                {
                  backgroundColor: surface,
                  borderColor: pressed ? "#FBBF24" + "55" : cardBorder,
                  opacity: pressed ? 0.94 : 1,
                },
              ]}
              onPress={exportDb}
            >
              <View
                style={[styles.chip, { backgroundColor: "#FBBF24" + "22" }]}
              >
                <ExportIcon color="#FBBF24" />
              </View>
              <ThemedText
                type="defaultSemiBold"
                style={{
                  flex: 1,
                  color: "#ced1d0",
                  fontSize: 15,
                }}
              >
                Export
              </ThemedText>
            </Pressable>
            <Pressable
              android_ripple={{ color: "#A855F7" + "22" }}
              style={({ pressed }) => [
                styles.btn,
                {
                  backgroundColor: surface,
                  borderColor: pressed ? "#A855F7" + "55" : cardBorder,
                  opacity: pressed ? 0.94 : 1,
                },
              ]}
              onPress={importDb}
            >
              <View
                style={[styles.chip, { backgroundColor: "#A855F7" + "22" }]}
              >
                <ImportIcon color="#A855F7" />
              </View>
              <ThemedText
                type="defaultSemiBold"
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: "#ced1d0",
                }}
              >
                Import
              </ThemedText>
            </Pressable>
          </View>
        </View>
        <View>
          <SectionTitle text="Reset" />
          <Desc text="Clear all transactions and start fresh. No strings attached 😎" />

          <View style={styles.buttonContainer}>
            <Pressable
              android_ripple={{ color: "#fd850d" + "22" }}
              onPress={cleanHandler}
              style={({ pressed }) => [
                styles.btn,
                {
                  backgroundColor: surface,
                  borderColor: pressed ? "#fd850d" + "55" : cardBorder,
                  opacity: pressed ? 0.94 : 1,
                },
              ]}
            >
              <View
                style={[styles.chip, { backgroundColor: "#fd850d" + "22" }]}
              >
                <ResetIcon color="#fd850d" />
              </View>
              <ThemedText
                type="defaultSemiBold"
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: "#ced1d0",
                }}
              >
                Reset
              </ThemedText>
            </Pressable>
          </View>
        </View>

        <View>
          <SectionTitle text="Account" />
          <Desc text="Log out to step away, or delete everything permanently. Your account, your choice 💪" />
          {/* Log Out  */}
          <View style={styles.buttonContainer}>
            <Pressable
              android_ripple={{ color: "#8A9B96" + "22" }}
              style={({ pressed }) => [
                styles.btn,
                {
                  backgroundColor: surface,
                  borderColor: pressed ? "#8A9B96" + "55" : cardBorder,
                  opacity: pressed ? 0.94 : 1,
                },
              ]}
            >
              <View
                style={[styles.chip, { backgroundColor: "#8A9B96" + "22" }]}
              >
                <LogoutIcon color="#8A9B96" />
              </View>
              <ThemedText
                type="defaultSemiBold"
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: "#ced1d0",
                }}
              >
                Log Out
              </ThemedText>
            </Pressable>
            {/* Account Delete */}
            <Pressable
              android_ripple={{ color: "#FB7185" + "22" }}
              style={({ pressed }) => [
                styles.btn,
                {
                  backgroundColor: "#2a0f1198",
                  borderColor: pressed ? "#4307109b" : "#fb7186aa",
                  opacity: pressed ? 0.94 : 1,
                },
              ]}
              onPress={deleteAccount}
            >
              <View
                style={[styles.chip, { backgroundColor: "#FB7185" + "22" }]}
              >
                <DeleteIcon color="#FB7185" />
              </View>
              <ThemedText
                type="defaultSemiBold"
                style={{
                  flex: 1,
                  fontSize: 15,
                  color: "#FB7185",
                }}
              >
                Delete Account
              </ThemedText>
            </Pressable>
          </View>
          <ThemedText
            style={{
              fontSize: 12,
              color: textMuted,
              lineHeight: 18,
              marginTop: 10,
            }}
          >
            Deleting your account erases all your digital traces. Make sure
            you're 100% sure—it&#39;s the ultimate reset! 🗑️
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default setting;
const styles = StyleSheet.create({
  btn: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth:"40%",
    marginVertical: 10,
    flex:1
  },
  buttonContainer:{ flexDirection: "row", gap: 10},
  chip: {
    width: 40,
    height: 40,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
});
