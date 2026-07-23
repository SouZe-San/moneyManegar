import { Pressable, Text, View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import {  useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

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
import SubmitButton from "@/components/inputs/SubmitButton";

// hooks
import { openBottomSheetModal, showToast } from "@/hooks/useFunc";

import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { BottomSheetRefProps } from "@/components/BottomSheetView";
import { fetchThisMonthBudget, isBudgetHave } from "@/hooks/queries/budget";
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
    const router = useRouter();
  // Colors
  const backgroundColor = useThemeColorWithName("background");
  const textMuted = useThemeColorWithName("textMuted");
  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");

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
      <View
        style={[
          globalStyles.inputContainer,
          { justifyContent: "center", alignItems: "center", backgroundColor },
        ]}
      >
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
                  type="subtitle"
                  style={{
                    color: textMuted + "70",
                    textAlign: "center",
                  }}
                >
                  No budgets yet
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: 15,
                    color: textMuted + "50",
                    textAlign: "center",
                    marginTop: 4,
                  }}
                >
                  Set a budget for your wallet or your month.
                </ThemedText>
              </View>
            ) : (
              <View style={{ width: "100%", gap: 10, flex: 1 }}>
                {!budget ? (
                  <View
                    style={{
                      width: "100%",
                      paddingVertical: 46,
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      flex: 1,
                    }}
                  >
                    <ThemedText
                      colorName="textMuted"
                      style={{ textAlign: "center" }}
                    >
                      No budget this month
                    </ThemedText>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 13,
                        color: textMuted + "70",
                      }}
                    >
                      Set one and track it as you spend.
                    </Text>
                  </View>
                ) : (
                  <BudgetSummaryCard
                    month={budget.month}
                    budget_amount={budget.budget_amount}
                    total_expense={budget.total_expense}
                  />
                )}
              </View>
            )}
          </View>
        </AnimatedStackView>
        <View
          style={[
            globalStyles.submit_btn_container,
            {
              gap: 10,
              zIndex: 7,
            },
          ]}
        >
          {isHaveManyBudget && (
            <Pressable
              android_ripple={{ color: "#38BDF8" + "22" }}
              onPress={() => router.push("/allBudgets")}
              style={({ pressed }) => ({
                width: "100%",
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: cardBorder,
                alignSelf: "center",
                backgroundColor: pressed ? surface + "70" : surface + "10",
                opacity: pressed ? 0.92 : 1,
              })}
            >
              <ThemedText
                colorName="text"
                style={{ fontWeight: 400, letterSpacing: 1.5 }}
              >
                View all
              </ThemedText>
            </Pressable>
          )}
          <SubmitButton button_label="New Budget" onPress={createNew} />
        </View>
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
