import ImageHeader from "@/components/animation/ImageHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { globalStyles } from "@/constants/globalStyles";

const allTransaction = () => {
  return (
    <ThemedView style={globalStyles.stack_container}>
      <ImageHeader />
    </ThemedView>
  );
};

export default allTransaction;
