import ImageHeader from "@/components/comp/ImageHeader";
import { ThemedView } from "@/components/ThemedView";
import { globalStyles } from "@/constants/globalStyles";
import React, { Component } from "react";
import { Text, View } from "react-native";

export default function allStats() {
  return (
    <ThemedView style={globalStyles.mainContainer}>
      <ImageHeader url={require("@/assets/images/temp/stats.png")} blurRadius={1} />
      <Text> textInComponent </Text>
    </ThemedView>
  );
}
