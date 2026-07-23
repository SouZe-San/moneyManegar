import { ScrollView, View } from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

import { globalStyles } from "@/constants/globalStyles";
import ImageHeader from "@/components/animation/ImageHeader";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

import {
  fetchMonthlyExpense,
  fetchMonthlyIncome,
} from "@/hooks/queries/transaction";
import { fetchAllBudgets } from "@/hooks/queries/budget";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { Budget } from "@/types/expanse";
import { useHeaderImage } from "@/context/HeaderImageContext";

type Pt = { value: number; label?: string };
type Bar = {
  value: number;
  frontColor: string;
  spacing?: number;
  label?: string;
};

const Legend = ({ items }: { items: { c: string; t: string }[] }) => (
  <View style={{ flexDirection: "row", gap: 16, marginBottom: 12 }}>
    {items.map((i) => (
      <View
        key={i.t}
        style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
      >
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 3,
            backgroundColor: i.c,
          }}
        />
        <ThemedText style={{ fontSize: 12, color: "#8A9B96" }}>
          {i.t}
        </ThemedText>
      </View>
    ))}
  </View>
);


export default function allStats() {
  const imageUrl = useHeaderImage("allStats");
  const headerTitle = "Statistical Analysis";

  const expenseColor = useThemeColorWithName("expense");
  const incomeColor = useThemeColorWithName("income");
const surface = useThemeColorWithName("surface");
const cardBorder = useThemeColorWithName("cardBorder");
const textMuted = useThemeColorWithName("textMuted");

  interface ChartItem {
    value: number;
    frontColor: string;
    gradientColor: string;
    spacing?: number;
    label?: string;
  }

  const [expenseData, setExpenseData] = useState<Pt[]>([]);
  const [incomeData, setIncomeData] = useState<Pt[]>([]);
  const [budgets, setBudgets] = useState<ChartItem[]>([]);
  const [budgetMax, setBudgetMax] = useState(0);  const [lineMax, setLineMax] = useState(0);
const [cardWidth, setCardWidth] = useState(0);
  const sqlDb = useSQLiteContext();

  const fetch = async () => {
    try {
       const exp = await fetchMonthlyExpense(sqlDb);
       const inc = await fetchMonthlyIncome(sqlDb);
       setExpenseData(exp);
       setIncomeData(inc);
       setLineMax(
         Math.max(0, ...exp.map((d) => d.value), ...inc.map((d) => d.value)),
       );

      const budgetData: Budget[] = await fetchAllBudgets(sqlDb);
       const last4 = budgetData.slice(-4);
      const chartData = last4.flatMap((item) => [
        // 1st Item: Budget Amount
        {
          value: item.budget_amount,
          frontColor: "#38BDF8",
          gradientColor: "#acfc6a",
          spacing: 4,
          label: new Date(2020, parseInt(item.month, 10) - 1, 1).toLocaleString(
            "en-US",
            { month: "short" },
          ),
        },
        // 2nd Item: Total Expense
        {
          value: item.total_expense,
          frontColor: "#FBBF24",
          gradientColor: "#ffed4e",
        },
      ]);



      setBudgets(chartData);
      setBudgetMax(Math.max(...chartData.map((item) => item.value)));
    } catch (error) {
      console.log("ERROR :", error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetch();
    }, []),
  );
  const empty = expenseData.length === 0 && incomeData.length === 0;
  const card = {
    padding: 16,
    borderRadius: 16,
    backgroundColor: surface,
    borderWidth: 1,
    borderColor: cardBorder,
    marginBottom: 16,
  };


  return (
    <ThemedView style={globalStyles.stack_container}>
      <ImageHeader imgUrl={imageUrl} title={headerTitle} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 40,
          paddingBottom: 60,
        }}
        showsVerticalScrollIndicator={false}
      >
        {empty ? (
          <ThemedText
            type="title"
            colorName="textMuted"
            style={{ textAlign: "center", marginTop: 100, opacity:.6 }}
          >
            Paisa Nehi hai Kya ~_* !!!
          </ThemedText>
        ) : (
          <>
            {/* Expense vs Income */}
            <View
              style={card}
              onLayout={(e) => setCardWidth(e.nativeEvent.layout.width - 32)}
            >
              <ThemedText type="subtitle" style={{ fontSize: 16 }}>
                Expense vs Income
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 12,
                  color: textMuted,
                  marginTop: 2,
                  marginBottom: 12,
                }}
              >
                Monthly totals · last 4 months
              </ThemedText>
              <Legend
                items={[
                  { c: expenseColor, t: "Expense" },
                  { c: incomeColor, t: "Income" },
                ]}
              />

              <LineChart
                areaChart
                curved
                hideDataPoints
                data={expenseData}
                data2={incomeData}
                height={200}
                parentWidth={cardWidth}
                spacing={70}
                initialSpacing={20}
                endSpacing={10}
                adjustToWidth // fit the 4 points into `width`
                maxValue={Math.ceil((lineMax * 1.15) / 1000) * 1000 || 1000}
                noOfSections={4}
                color1={expenseColor}
                color2={incomeColor}
                hideRules
                rulesType="solid"
                rulesColor="transparent"
                xAxisColor="transparent"
                thickness1={2.5}
                thickness2={2.5}
                startFillColor1={expenseColor}
                startFillColor2={incomeColor}
                startOpacity={0.18}
                endOpacity={0.0}
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisTextStyle={{ color: textMuted, fontSize: 8 }}
                xAxisLabelTextStyle={{ color: textMuted, fontSize: 10 }}
              />
            </View>

            {/* Budget Overview */}
            {budgets.length > 0 && (
              <View style={card}>
                <ThemedText type="subtitle" style={{ fontSize: 16 }}>
                  Budget Overview
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: 12,
                    color: textMuted,
                    marginTop: 2,
                    marginBottom: 12,
                  }}
                >
                  Budget vs spent · per month
                </ThemedText>
                <Legend
                  items={[
                    { c: "#38BDF8", t: "Budget" },
                    { c: "#FBBF24", t: "Spent" },
                  ]}
                />

                <BarChart
                  data={budgets}
                  barWidth={14}
                  initialSpacing={12}
                  spacing={18}
                  barBorderRadius={4}
                  yAxisThickness={0}
                  xAxisColor="rgba(255,255,255,0.08)"
                  hideRules
                  noOfSections={4}
                  maxValue={Math.ceil((budgetMax * 1.15) / 500) * 500 || 500}
                  yAxisTextStyle={{ color: textMuted, fontSize: 10 }}
                  xAxisLabelTextStyle={{
                    color: textMuted,
                    fontSize: 11,
                    textAlign: "center",
                  }}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}
