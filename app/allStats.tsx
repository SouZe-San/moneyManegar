import { ThemedView } from "@/components/ThemedView";
import { globalStyles } from "@/constants/globalStyles";
import React, { Component } from "react";
import { ScrollView, View } from "react-native";
import ImageHeader from "@/components/animation/ImageHeader";
import { LineChart } from "react-native-gifted-charts";
import { onlyExpenseData, onlyIncomeData } from "@/constants/tempVar";

export default function allStats() {
  const imageUrl = require("@/assets/images/temp/s1.jpg");
  const headerTitle = "Statistical Analysis";

  return (
    <ThemedView style={globalStyles.stack_container}>
      <ImageHeader imgUrl={imageUrl} title={headerTitle} />
      <View style={{ marginVertical: 20, marginTop: 50 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            areaChart
            curved
            // hideYAxisText
            hideRules
            color={"red"}
            data={onlyExpenseData}
            data2={onlyIncomeData}
            height={300}
            spacing={40}
            initialSpacing={0}
            color1="#65e20b"
            thickness1={0.4}
            thickness2={0.4}
            color2="orange"
            xAxisColor="#aacbc4"
            yAxisColor="#aacbc4"
            hideDataPoints
            startFillColor1="#4ff20e"
            startFillColor2="#f40e35"
            startOpacity={0.8}
            endOpacity={0.1}
          />
        </ScrollView>
      </View>
    </ThemedView>
  );
}
