import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { useNavigation, useRouter } from "expo-router";

const ONBOARDING_DATA = [
  {
    title: "Track Your Expenses",
    description: "Easily log and categorize your daily expenses to stay on top of your spending",
    icon: (color: string) => (
      <MaterialCommunityIcons name="wallet-outline" size={100} color={color} />
    ),
  },
  {
    title: "Smart Analytics",
    description: "Get insights into your spending habits with detailed charts and reports",
    icon: (color: string) => <Ionicons name="stats-chart" size={100} color={color} />,
  },
  {
    title: "Set Budgets",
    description: "Create custom budgets and receive notifications when youre close to your limits",
    icon: (color: string) => <FontAwesome5 name="piggy-bank" size={100} color={color} />,
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCom, setCom] = useState(false);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();

  const iconColor = useThemeColorWithName("tabIconSelected");
  const bg = useThemeColorWithName("highLightBackground");

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Navigate to main app
      router.navigate("/login");
    }
  };

  const currentItem = ONBOARDING_DATA[currentIndex];

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <ThemedText
            colorName="highLightBackground"
            type="defaultSemiBold"
            style={{ letterSpacing: 1.6 }}
            onPress={() => setCurrentIndex(2)}
          >
            {currentIndex < ONBOARDING_DATA.length - 1 ? "Skip" : ""}
          </ThemedText>
        </View>

        <View style={styles.content}>
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            key={currentIndex}
            style={styles.slideContent}
          >
            <View style={styles.iconContainer}>{currentItem.icon(iconColor)}</View>
            <ThemedText style={styles.title}>{currentItem.title}</ThemedText>
            <Text style={styles.description}>{currentItem.description}</Text>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <View style={styles.pagination}>
            {ONBOARDING_DATA.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentIndex && { backgroundColor: bg, width: 20 },
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: bg }]}
            onPress={handleNext}
          >
            <ThemedText style={styles.nextButtonText} colorName="background" type="defaultSemiBold">
              {currentIndex === ONBOARDING_DATA.length - 1 ? "Get Started" : "NEXT"}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    alignItems: "flex-end",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  slideContent: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 36,
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  footer: {
    padding: 24,
    paddingBottom: 32,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 4,
  },
  nextButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: 16,
    letterSpacing: 1.6,
  },
});
