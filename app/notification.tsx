import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { globalStyles } from "@/constants/globalStyles";

export default function notification() {
  return (
    <ThemedView style={globalStyles.mainContainer}>
      <ThemedText type="title">NOTificatioN</ThemedText>
    </ThemedView>
  );
}
