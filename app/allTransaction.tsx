import ImageHeader from "@/components/animation/ImageHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { globalStyles } from "@/constants/globalStyles";

const allTransaction = () => {
  const imgUrl = require("@/assets/images/temp/green.jpg");
  const headerTitle = "All Wastes ಠ⁠_⁠ಠ";
  return (
    <ThemedView style={globalStyles.stack_container}>
      <ImageHeader imgUrl={imgUrl} title={headerTitle} />
    </ThemedView>
  );
};

export default allTransaction;
