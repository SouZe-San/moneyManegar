
import { Text, TextStyle } from "react-native";
import { ThemedText } from "@/components/ThemedText";

type Props = {
  value: number;
  size?: number; // size of the whole-number part
  color?: string;
  decimalColor?: string;
  prefix?: string; // e.g. "₹"
  style?: TextStyle;
};

const MoneyText = ({
  value,
  size = 28,
  color,
  decimalColor,
  prefix = "₹",
  style,
}: Props) => {
  const [whole, dec] = value.toFixed(2).split(".");
  const grouped = Number(whole).toLocaleString("en-IN"); // 26082 -> 26,082

  return (
    <ThemedText
      type="subtitle"
      style={[
        { fontSize: size, fontWeight: "600" },
        style,
        color ? { color } : {},
      ]}
    >
      {prefix}
      {grouped}<Text
        style={{
          fontSize: size * 0.65,
          color: decimalColor ? decimalColor : "#ffffff94",
          fontWeight: "600",
        }}
      >.{dec}
      </Text>
    </ThemedText>
  );
};

export default MoneyText;
