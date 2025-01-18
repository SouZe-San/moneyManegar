import { StyleSheet, View, Text, Image, FlatList, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useState, useRef, useCallback } from "react";
import { PieChartPro } from "react-native-gifted-charts";
import { useSQLiteContext } from "expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

// Components
import SingleBox from "@/components/SingleBox";
import { ThemedText } from "@/components/ThemedText";
import MemberDetails from "@/components/details/MemberDetails";
import { HelloWave } from "@/components/animation/HelloWave";
import AnimateTabView from "@/components/animation/AnimateTabView";
import { globalStyles } from "@/constants/globalStyles";
import RedirectButton from "@/components/comp/RedirectButton";
import ColorLabeling from "@/components/comp/ColorLabeling";

import { totalBudget, expenseTypeData, groupData } from "@/constants/tempVar";
// Hooks
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { useExpense } from "@/context/ExpanseContext";

// Icons
import { DbIcon, StatsIcon } from "@/assets/icons/SVG/RandomIcons";

// Modal
import BottomSheetModal from "@/components/BottomSheetModal";
import { BottomSheetRefProps } from "@/components/BottomSheetView";

export default function HomeScreen() {
  // Colors
  const borderColor = useThemeColorWithName("borderColor");
  const expanseBg = useThemeColorWithName("expanseBg");
  const bg = useThemeColorWithName("blurBg");
  const darkTextColor = "#030f0e";
  const balanceBg = useThemeColorWithName("highLightBackground");
  const text = useThemeColorWithName("text");

  // States
  const [modalVisible, setModalVisible] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);

  // modal Reference
  const ref = useRef<BottomSheetRefProps>(null);

  const db = useSQLiteContext();
  useDrizzleStudio(db);

  const { totalIncome, totalExpense, leftBalance } = useExpense();

  // Router
  const router = useRouter();

  // Open Modal
  const onPress = useCallback((id: string) => {
    setModalVisible(true);
    console.log(id);
    setMemberId(id);
    const isActive = ref?.current?.isActive();
    if (isActive) {
      ref?.current?.scrollTo(20);
    } else {
      ref?.current?.scrollTo(-200);
    }
  }, []);

  return (
    <AnimateTabView style={[globalStyles.container, { paddingBottom: 100 }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedText
          type="title"
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          Hi,<Text style={{ fontSize: 28 }}>Souze</Text>
          <HelloWave />
        </ThemedText>
        {/* Cost View Section */}
        <View style={styles.costSection}>
          <View>
            <View
              style={[
                styles.costViewBox,
                { backgroundColor: balanceBg, borderColor: balanceBg, position: "relative" },
              ]}
            >
              <ThemedText type="defaultSemiBold" style={{ fontSize: 14, color: darkTextColor }}>
                Left Over
              </ThemedText>
              {leftBalance < 0 && (
                <ThemedText
                  type="default"
                  style={[styles.shortTag, { fontSize: 14, color: darkTextColor }]}
                >
                  You Brock &#59;&#40;ಥ⁠╭⁠╮⁠ಥ┐
                </ThemedText>
              )}

              {/* Balance */}
              <ThemedText type="subtitle" style={{ fontSize: 26, color: darkTextColor }}>
                {leftBalance.toFixed(2)} ₹
              </ThemedText>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <View style={[styles.costViewBox, { width: "49%", backgroundColor: expanseBg }]}>
              <ThemedText type="default" style={{ fontSize: 14 }}>
                Expanse
              </ThemedText>
              <ThemedText type="subtitle" style={{ fontSize: 26 }}>
                {totalExpense.toFixed(2)} ₹
              </ThemedText>
            </View>
            <View style={[styles.costViewBox, { width: "49%", borderColor }]}>
              <ThemedText type="default" style={{ fontSize: 14 }}>
                Income
              </ThemedText>
              <ThemedText type="subtitle" style={{ fontSize: 26 }}>
                {totalIncome.toFixed(2)} ₹
              </ThemedText>
            </View>
          </View>
        </View>

        {/* New User Image */}
        {!groupData && (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
            <Image
              source={require("@/assets/images/hero/heroImg.png")}
              style={{ opacity: 0.5, objectFit: "contain", width: "100%", height: "100%" }}
            />
          </View>
        )}

        {/*//^ All New Groups */}

        {/* Members */}
        <View style={[styles.groupContainer, { marginTop: 20 }]}>
          <ThemedText type="title" style={{ fontSize: 20 }}>
            Pals & Partners
          </ThemedText>
          <View
            style={{
              flexGrow: 0,
              marginVertical: 5,
              flexWrap: "wrap",
            }}
          >
            <FlatList
              data={groupData}
              keyExtractor={(item) => item.groupId}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <SingleBox
                  key={item.groupId}
                  label={item.groupName}
                  icon={item.groupIcon}
                  onPress={() => onPress(item.groupId)}
                />
              )}
            />
          </View>
        </View>
        {/* Groups */}
        <View style={styles.groupContainer}>
          <ThemedText type="title" style={{ fontSize: 20 }}>
            My Circles
          </ThemedText>
          <View
            style={{
              flexGrow: 0,
              marginVertical: 5,
              flexWrap: "wrap",
              flexDirection: "row",
            }}
          >
            <FlatList
              data={groupData}
              keyExtractor={(item) => item.groupId}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <SingleBox
                  key={item.groupId}
                  label={item.groupName}
                  icon={item.groupIcon}
                  onPress={() => router.push(`/groups/${item.groupId}`)}
                />
              )}
            />
          </View>
        </View>

        <RedirectButton
          icon={<DbIcon color={balanceBg} />}
          label="All Transactions"
          redirectUrl={"/allTransaction"}
        />
        <View style={{ position: "relative" }}>
          <BottomSheetModal isOpen={modalVisible} setIsOpen={setModalVisible} ref={ref}>
            <MemberDetails id={memberId} />
          </BottomSheetModal>
        </View>
        {/*//! Two Chart */}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 10,
            marginTop: 40,
            paddingHorizontal: 15,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <PieChartPro
              showText={false}
              textSize={0}
              data={expenseTypeData}
              radius={60}
              innerRadius={45}
              donut
            />
            {/* Color Labeling */}
            <View
              style={{
                marginTop: 10,
              }}
            >
              {expenseTypeData.map((item, index) => {
                return (
                  <ColorLabeling
                    color={item.color}
                    key={index.toString()}
                    label={item.text}
                    amount={item.value}
                    totalAmt={expenseTypeData.reduce((sum, item) => sum + item.value, 0)}
                  />
                );
              })}
            </View>
          </View>

          <View style={{ alignItems: "center" }}>
            <ThemedText type="subtitle" style={{ marginBottom: 10 }}>
              {new Date().toLocaleString("default", { month: "long" })}
            </ThemedText>
            <PieChartPro textSize={0} radius={50} innerRadius={35} donut data={totalBudget} />
            {/* Color Labeling */}
            <View
              style={{
                marginTop: 10,
              }}
            >
              {totalBudget.map((item, index) => {
                return (
                  <ColorLabeling
                    color={item.color}
                    key={index.toString()}
                    label={item.text}
                    amount={item.value}
                    totalAmt={totalBudget.reduce((sum, item) => sum + item.value, 0)}
                  />
                );
              })}
            </View>
          </View>
        </View>

        <RedirectButton
          icon={<StatsIcon color={balanceBg} />}
          label="Stats"
          redirectUrl={"/allStats"}
        />

        {/* MoDal */}
      </ScrollView>
    </AnimateTabView>
  );
}

const styles = StyleSheet.create({
  costSection: {
    marginTop: 20,
    width: "100%",
    gap: 8,
  },
  costViewBox: {
    width: "auto",
    borderWidth: 1,
    display: "flex",
    borderRadius: 10,
    borderColor: "transparent",
    justifyContent: "space-between",
    // justifyContent: "flex-end",
    paddingBottom: 15,
    height: 100,
    padding: 10,
  },
  groupContainer: {
    paddingHorizontal: 10,

    borderRadius: 10,
  },
  shortTag: {
    position: "absolute",
    top: 15,
    right: 15,
    textAlign: "right",
  },
});
