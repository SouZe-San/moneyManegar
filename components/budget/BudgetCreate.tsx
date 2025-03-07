import { TouchableOpacity } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

const BudgetCreate = ({ setModalVisibility }: { setModalVisibility: (value: boolean) => void }) => {
  const buttonBgColor = useThemeColorWithName("button");
  return (
    <ThemedView>
      <ThemedText
        type="subtitle"
        style={{ marginTop: 40, textAlign: "center" }}
        colorName="tabIconDefault"
      >
        Will be
      </ThemedText>
      <ThemedText
        type="title"
        style={{ marginBottom: 20, textAlign: "center", fontWeight: 800 }}
        colorName="highLightBackground"
      >
        !! COMING SOON !!
      </ThemedText>
      <TouchableOpacity
        onPress={() => setModalVisibility(false)}
        style={{
          width: "80%",
          height: 50,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
          backgroundColor: buttonBgColor,
          alignSelf: "center",
          marginTop: 40,
        }}
      >
        <ThemedText colorName="background" style={{ fontWeight: 600, letterSpacing: 1.5 }}>
          GoBack
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

export default BudgetCreate;
