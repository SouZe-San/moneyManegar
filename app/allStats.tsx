import { ThemedView } from "@/components/ThemedView";
import { globalStyles } from "@/constants/globalStyles";
import React, { Component } from "react";
import { Text, View } from "react-native";
import ImageHeader from "@/components/animation/ImageHeader";
export default function allStats() {
  const imageUrl = require("@/assets/images/temp/s1.jpg");
  const headerTitle = "Statistic Analysis";
  return (
    <ThemedView style={globalStyles.stack_container}>
      <ImageHeader imgUrl={imageUrl} title={headerTitle} />
    </ThemedView>
  );
}
