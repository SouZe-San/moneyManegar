import { ThemedView } from "@/components/ThemedView";
import { globalStyles } from "@/constants/globalStyles";
import React, { Component } from "react";
import { ScrollView, View } from "react-native";
import ImageHeader from "@/components/animation/ImageHeader";
import { LineChart } from "react-native-gifted-charts";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { fetchOnlyExpense, fetchOnlyIncome } from "@/hooks/useQueries";
import { useSQLiteContext } from "expo-sqlite";
import { ThemedText } from "@/components/ThemedText";
export default function allStats() {
  const imageUrl = require("@/assets/images/temp/s1.jpg");
  const headerTitle = "Statistical Analysis";

  const [onlyIncomeData, setOnlyIncomeData] = useState<{ value: number }[]>([]);
  const [onlyExpenseData, setOnlyExpenseData] = useState<{ value: number }[]>([]);

  const sqlDb = useSQLiteContext();
  const fetch = async () => {
    try {
      const data1 = await fetchOnlyExpense(sqlDb);
      const data2 = await fetchOnlyIncome(sqlDb);
      setOnlyExpenseData(data1);
      setOnlyIncomeData(data2);
    } catch (error) {
      console.log("ERROR :", error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetch();
    }, [])
  );

  return (
    <ThemedView style={globalStyles.stack_container}>
      <ImageHeader imgUrl={imageUrl} title={headerTitle} />
      <View style={{ marginVertical: 20, marginTop: 50 }}>
        {onlyExpenseData.length === 0 || onlyIncomeData.length === 0 ? (
          <ThemedText
            type="title"
            colorName="tabIconDefault"
            style={{ textAlign: "center", marginTop: 100, paddingLeft: 20 }}
          >
            Paisa Nehi hai Kya ~_* !!!
          </ThemedText>
        ) : (
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
        )}
      </View>
    </ThemedView>
  );
}
