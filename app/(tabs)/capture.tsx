import AnimateTabView from "@/components/animation/AnimateTabView";
import { ThemedText } from "@/components/ThemedText";

export default function CaptureScreen() {
  return (
    <AnimateTabView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemedText type="title">Capture You $_$ </ThemedText>
    </AnimateTabView>
  );
}
