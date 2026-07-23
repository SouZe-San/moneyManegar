import { View } from "react-native";

// components
import AnimatedStackView from "@/components/animation/AnimatedStackView";
import AnimateTabView from "@/components/animation/AnimateTabView";
import BudgetCreate from "@/components/budget/BudgetCreate";
import BudgetSummaryCard from "@/components/budget/BudgetSummaryCard";
import BottomSheetModal from "@/components/BottomSheetModal";
import { globalStyles } from "@/constants/globalStyles";
import ImageHeader from "@/components/comp/ImageHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import RedirectButton from "@/components/comp/RedirectButton";
import SubmitButton from "@/components/inputs/SubmitButton";

// hooks
import { openBottomSheetModal, showToast } from "@/hooks/useFunc";

import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { useCallback, useEffect, useRef, useState } from "react";
import { BottomSheetRefProps } from "@/components/BottomSheetView";
import { fetchThisMonthBudget, isBudgetHave } from "@/hooks/queries/budget";
import { useSQLiteContext } from "expo-sqlite";
import { StatsIcon } from "@/assets/icons/SVG/RandomIcons";
import { useHeaderImage } from "@/context/HeaderImageContext";

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
const headerImg = useHeaderImage("budget");
  // modal Reference
  const ref = useRef<BottomSheetRefProps>(null);

  const db = useSQLiteContext();

  // Colors
  const backgroundColor = useThemeColorWithName("background");

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
      <ImageHeader url={headerImg} />
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
                <ThemedText type="subtitle" style={{ textAlign: "center" }}>
                  No budgets yet
                </ThemedText>
                <ThemedText
                  colorName="textMuted"
                  style={{ textAlign: "center", fontSize: 13, marginTop: 6 }}
                >
                  Set a budget for your wallet or your month.
                </ThemedText>
              </View>
            ) : (
              <View style={{ width: "100%", gap: 10 }}>
                {!budget ? (
                  <View
                    style={{
                      width: "100%",
                      paddingVertical: 46,
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <ThemedText type="subtitle" style={{ textAlign: "center" }}>
                      No budget this month
                    </ThemedText>
                    <ThemedText
                      colorName="textMuted"
                      style={{ textAlign: "center", fontSize: 13 }}
                    >
                      Set one and track it as you spend.
                    </ThemedText>
                  </View>
                ) : (
                  <BudgetSummaryCard
                    month={budget.month}
                    budget_amount={budget.budget_amount}
                    total_expense={budget.total_expense}
                  />
                )}
                <View
                  style={{
                    width: "100%",
                    marginTop: 15,
                  }}
                >
                  <RedirectButton
                    icon={<StatsIcon color="#38BDF8" />}
                    label="View all"
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
        <View style={{ position: "relative" }}>
          <BottomSheetModal
            isOpen={modalVisible}
            setIsOpen={setModalVisible}
            ref={ref}
          >
            <BudgetCreate setModalVisibility={setModalVisible} />
          </BottomSheetModal>
        </View>
      </View>
    </ThemedView>
  );
}

export default budget;
