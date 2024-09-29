import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import { Text } from "react-native";

export default function MoneyManager() {
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemedText type="title">Money</ThemedText>
      {/* <ThemedText type="link">
        <Link href={"/entries/income"}>
          <Text>Navigate to nested route </Text>
        </Link>
      </ThemedText>
      <ThemedText type="link">
        <Link href={"/entriescontribute"}>
          <Text>Navigate to Contri </Text>
        </Link>
      </ThemedText>
      <ThemedText type="link">
        <Link href={"/entriesexpense"}>
          <Text>Navigate Expense </Text>
        </Link>
      </ThemedText>
      <ThemedText type="link">
        <Link href={"/entriespayble"}>
          <Text>Navigate to Payble </Text>
        </Link>
      </ThemedText> */}
    </ThemedView>
  );
}
