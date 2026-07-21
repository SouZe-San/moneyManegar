import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { globalStyles } from "@/constants/globalStyles";

export default function notification() {
  return (
    <ThemedView style={[globalStyles.mainContainer ,{justifyContent:"center", alignItems:"center"}]}>
      <ThemedText type="title" colorName="textMuted" style={{ textAlign: "center", textTransform:"uppercase", }}>
        Under Development 
      </ThemedText>
    </ThemedView>
  );
}
