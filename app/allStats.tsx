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
  fetchAllBudgets,
  fetchOnlyExpense,
  fetchOnlyIncome,
} from "@/hooks/useQueries";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { Budget } from "@/types/expanse";

export default function allStats() {
  const imageUrl = require("@/assets/images/temp/s1.jpg");
  const headerTitle = "Statistical Analysis";

  const blurBackgoundColor = useThemeColorWithName("blurBg");

  interface ChartItem {
    value: number;
    frontColor: string;
    gradientColor: string;
    spacing?: number;
    label?: string;
  }

  const [onlyIncomeData, setOnlyIncomeData] = useState<{ value: number }[]>([]);
  const [onlyExpenseData, setOnlyExpenseData] = useState<{ value: number }[]>(
    [],
  );
  const [budgets, setBudgets] = useState<ChartItem[]>([]);
  const [budgetMax, setBudgetMax] = useState(0);

  const sqlDb = useSQLiteContext();

  const fetch = async () => {
    try {
      const data1 = await fetchOnlyExpense(sqlDb);
      const data2 = await fetchOnlyIncome(sqlDb);

      const budgetData: Budget[] = await fetchAllBudgets(sqlDb);

      const chartData = budgetData.flatMap((item) => [
        // 1st Item: Budget Amount
        {
          value: item.budget_amount,
          frontColor: "#18b228",
          gradientColor: "#acfc6a",
          spacing: 6,
          label: new Date(2020, parseInt(item.month, 10) - 1, 1).toLocaleString(
            "en-US",
            { month: "short" },
          ),
        },
        // 2nd Item: Total Expense
        {
          value: item.total_expense,
          frontColor: "#e9723b",
          gradientColor: "#ffed4e",
        },
      ]);

      setOnlyExpenseData(data1);
      setOnlyIncomeData(data2);

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


  return (
    <ThemedView style={globalStyles.stack_container}>
      <ImageHeader imgUrl={imageUrl} title={headerTitle} />
      <View style={{ marginTop: 50, flex: 1, marginBottom: -5 }}>
        {onlyExpenseData.length === 0 || onlyIncomeData.length === 0 ? (
          <ThemedText
            type="title"
            colorName="tabIconDefault"
            style={{ textAlign: "center", marginTop: 100, paddingLeft: 20 }}
          >
            Paisa Nehi hai Kya ~_* !!!
          </ThemedText>
        ) : (
          <View
            style={{
              margin: 20,
              padding: 16,
              borderRadius: 12,
              backgroundColor: blurBackgoundColor,
              flex: 1,
            }}
          >
            <ThemedText style={{ fontWeight: "bold" }} type="subtitle">
              Expanse vs Income
            </ThemedText>
            <View
              style={{
                paddingHorizontal: 4,
                paddingVertical: 20,
                alignItems: "center",
              }}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <LineChart
                  areaChart
                  curved
                  // hideYAxisText
                  hideRules
                  data={onlyExpenseData}
                  data2={onlyIncomeData}
                  yAxisTextStyle={{ color: "gray" }}
                  height={300}
                  spacing={40}
                  initialSpacing={0}
                  noOfSections={3}
                  color1="#65e20b"
                  thickness1={0.4}
                  thickness2={0.4}
                  color2="#fc7507"
                  hideDataPoints
                  yAxisThickness={0}
                  xAxisThickness={0}
                  startFillColor1="#4ff20e"
                  startFillColor2="#fc7507"
                  startOpacity={0.8}
                  endOpacity={0.0}
                />
              </ScrollView>
            </View>
          </View>
        )}
      </View>

      <View
        style={{
          margin: 20,
          padding: 16,
          borderRadius: 12,
          backgroundColor: blurBackgoundColor,
          flex: 1,
        }}
      >
        <ThemedText style={{ fontWeight: "bold" }} type="subtitle">
          Budget Overview
        </ThemedText>
        <View
          style={{
            paddingHorizontal: 4,
            paddingVertical: 20,
            alignItems: "center",
          }}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={budgets}
              barWidth={16}
              initialSpacing={10}
              spacing={14}
              barBorderRadius={3}
              showGradient
              yAxisThickness={0}
              // xAxisType={ruleTypes.DASHED}
              xAxisColor={'lightgray'}

              yAxisTextStyle={{ color: "lightgray" }}
              stepValue={ budgetMax > 5000 ? 1000 : budgetMax > 1000 ? 600 : 200}
              maxValue={budgetMax + 500}
              noOfSections={6}
              // yAxisLabelTexts={["0", "1k", "2k", "3k", "4k", "5k", "6k"]}
              yAxisLabelTexts={[]}
              labelWidth={40}
              xAxisLabelTextStyle={{ color: "lightgray", textAlign: "center" }}
            />
          </ScrollView>
        </View>
      </View>
    </ThemedView>
  );
}
