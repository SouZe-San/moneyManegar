import { View, StyleSheet } from "react-native";

// components
import AnimatedStackView from "@/components/animation/AnimatedStackView";
import { globalStyles } from "@/constants/globalStyles";
import ImageHeader from "@/components/comp/ImageHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import SubmitButton from "@/components/inputs/SubmitButton";
import BudgetCreate from "@/components/budget/BudgetCreate";

// hooks
import { openBottomSheetModal, showToast } from "@/hooks/useFunc";

import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { useCallback, useEffect, useRef, useState } from "react";
import { BottomSheetRefProps } from "@/components/BottomSheetView";
import BottomSheetModal from "@/components/BottomSheetModal";
import { fetchThisMonthBudget, isBudgetHave } from "@/hooks/useQueries";
import { useSQLiteContext } from "expo-sqlite";
import AnimateTabView from "@/components/animation/AnimateTabView";
import RedirectButton from "@/components/comp/RedirectButton";
import { DbIcon } from "@/assets/icons/SVG/RandomIcons";

type Budget = {
  month: string;
  budget_amount: number;
  total_expense: number;
} | null;

export function budget() {
  // States or Input Variables
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState<Budget>(null);
  const [isHaveManyBudget, setManyBudget] = useState(false);

  // modal Reference
  const ref = useRef<BottomSheetRefProps>(null);

  const db = useSQLiteContext();

  // Colors
  const backgroundColor = useThemeColorWithName("background");
  const borderColor = useThemeColorWithName("borderColor");
  const expanseBg = useThemeColorWithName("expanseBg");
  const iconColor = useThemeColorWithName("icon");

  const createNew = useCallback(() => {
    openBottomSheetModal(ref, setModalVisible);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchThisMonthBudget(db);
      const bugets = await isBudgetHave(db);
      setManyBudget(bugets.length > 0);
      setBudget(data);
    } catch (error) {
      showToast("ERROR");
      console.error("Error Budget fetching data: ", error);
      // Handle error state if needed
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

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
        <ThemedText type="title">Loading... </ThemedText>
      </AnimateTabView>
    );
  }

  return (
    <ThemedView style={globalStyles.entriesViewContainer}>
      <ImageHeader url={require("@/assets/images/entries/mony.webp")} />
      <ThemedText
        type="title"
        style={{
          marginTop: 40,
          textAlign: "center",
          width: "100%",
          textShadowColor: backgroundColor,
          textShadowOffset: { width: 1.4, height: 1 },
          textShadowRadius: 4,

          fontSize: 36,
          lineHeight: 40,
        }}
      >
        Tight Life {"(⁠￣⁠ヘ⁠￣⁠)⁠ "}
      </ThemedText>
      <View style={[globalStyles.inputContainer, { backgroundColor }]}>
        <AnimatedStackView style={globalStyles.animated_stackContainer}>
          <View
            style={{
              width: "100%",
              gap: 10,
              alignItems: "center",
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            {!isHaveManyBudget ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ThemedText
                  colorName="tabIconDefault"
                  style={{ textAlign: "center" }}
                >
                  Set budget for{" "}
                </ThemedText>
                <ThemedText
                  colorName="tabIconDefault"
                  style={{ textAlign: "center" }}
                >
                  your wallet OR your month{" "}
                </ThemedText>
              </View>
            ) : (
              <View style={{ width: "100%", gap: 10 }}>
                {!budget ? (
                  <View
                    style={{
                      height: 500,
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ThemedText
                      colorName="tabIconDefault"
                      style={{ textAlign: "center", letterSpacing: 2 }}
                    >
                      No Budget yet
                    </ThemedText>
                    <ThemedText
                      colorName="tabIconDefault"
                      style={{ textAlign: "center", letterSpacing: 5 }}
                    >
                      For This Month
                    </ThemedText>
                  </View>
                ) : (
                  <>
                    <View style={[styles.costViewBox, { borderColor }]}>
                      <ThemedText type="default" style={{ fontSize: 14 }}>
                        {new Date(
                          2020,
                          parseInt(budget.month, 10) - 1,
                          1,
                        ).toLocaleString("en-US", { month: "long" })}
                        's Budget
                      </ThemedText>
                      <ThemedText type="subtitle" style={{ fontSize: 26 }}>
                        {budget.budget_amount.toFixed(2)} ₹
                      </ThemedText>
                    </View>
                    <View
                      style={[
                        styles.costViewBox,
                        { backgroundColor: expanseBg },
                      ]}
                    >
                      <ThemedText type="default" style={{ fontSize: 14 }}>
                        {new Date(
                          2020,
                          parseInt(budget.month, 10) - 1,
                          1,
                        ).toLocaleString("en-US", { month: "long" })}
                        's Expanse
                      </ThemedText>
                      <ThemedText type="subtitle" style={{ fontSize: 26 }}>
                        {budget.total_expense.toFixed(2)} ₹
                      </ThemedText>
                    </View>
                  </>
                )}
                <View
                  style={{
                    width: "100%",
                    // paddingHorizontal: "4%",
                    marginTop: 15,
                  }}
                >
                  <RedirectButton
                    icon={<DbIcon color={iconColor} />}
                    label="All Budgets"
                    redirectUrl={"/allBudgets"}
                  />
                </View>
              </View>
            )}

            <View style={[globalStyles.submit_btn_container]}>
              <SubmitButton button_label="New Budget" onPress={createNew} />
            </View>
          </View>
        </AnimatedStackView>

          <BottomSheetModal
            isOpen={modalVisible}
            setIsOpen={setModalVisible}
            ref={ref}
          >
            <BudgetCreate setModalVisibility={setModalVisible} />
          </BottomSheetModal>
      </View>
    </ThemedView>
  );
}

export default budget;

const styles = StyleSheet.create({
  costViewBox: {
    borderWidth: 1,
    display: "flex",
    borderRadius: 10,
    borderColor: "transparent",
    justifyContent: "space-between",
    width: "100%",
    paddingBottom: 15,
    height: 100,
    padding: 10,
  },
});
