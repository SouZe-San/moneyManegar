import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { globalStyles } from "@/constants/globalStyles";

export default function Setting() {
  return (
    <ThemedView style={globalStyles.mainContainer}>
      <ThemedText type="subtitle">Sync : Go Online</ThemedText>
      {/* Sync Features */}

      <ThemedText type="subtitle">Reset : Forget Past</ThemedText>
      {/* Track Reset */}

      <ThemedText type="subtitle">Account Setting</ThemedText>
      {/* Log Out  */}

      {/* Account Delete */}
    </ThemedView>
  );
}
