import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import BudgetProgress from "@/components/budget/BudgetProgress";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

export type SlideVariant = "track" | "stats" | "budget";

/** Placeholder text line — suggests content without being readable. */
const Bar = ({
  w,
  c,
  h = 6,
}: {
  w: number | string;
  c: string;
  h?: number;
}) => (
  <View
    style={{
      width: w as any,
      height: h,
      borderRadius: h / 2,
      backgroundColor: c,
    }}
  />
);

/** A compact stand-in for a transaction row. */
const MiniRow = ({
  chip,
  muted,
  amountColor,
  wide = false,
}: {
  chip: string;
  muted: string;
  amountColor: string;
  wide?: boolean;
}) => (
  <View style={styles.miniRow}>
    <View style={[styles.chip, { backgroundColor: chip + "26" }]}>
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 3,
          backgroundColor: chip,
        }}
      />
    </View>
    <View style={{ flex: 1, gap: 5 }}>
      <Bar w={wide ? 68 : 52} c={muted + "CC"} />
      <Bar w={34} c={muted + "66"} h={5} />
    </View>
    <Bar w={30} c={amountColor} />
  </View>
);

export default function SlideArt({ variant }: { variant: SlideVariant }) {
  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");
  const textMuted = useThemeColorWithName("textMuted");
  const income = useThemeColorWithName("income");
  const expense = useThemeColorWithName("expense");
  const accent = useThemeColorWithName("button");

  const cardBase = {
    backgroundColor: surface,
    borderColor: cardBorder,
  };

  return (
    <View style={styles.stage}>
      {/* back-left */}
      <View
        style={[
          styles.card,
          cardBase,
          {
            transform: [{ rotate: "-11deg" }, { scale: 0.86 }],
            left: 6,
            top: 46,
            opacity: 0.5,
          },
        ]}
      >
        <View style={{ gap: 12 }}>
          <MiniRow
            chip={expense}
            muted={textMuted}
            amountColor={expense + "99"}
          />
          <MiniRow
            chip={accent}
            muted={textMuted}
            amountColor={income + "99"}
          />
        </View>
      </View>

      {/* back-right */}
      <View
        style={[
          styles.card,
          cardBase,
          {
            transform: [{ rotate: "12deg" }, { scale: 0.86 }],
            right: 6,
            top: 30,
            opacity: 0.5,
          },
        ]}
      >
        <View style={{ gap: 12 }}>
          <MiniRow
            chip={income}
            muted={textMuted}
            amountColor={income + "99"}
          />
          <MiniRow
            chip={expense}
            muted={textMuted}
            amountColor={expense + "99"}
          />
        </View>
      </View>

      {/* front — the card that actually says something */}
      <View
        style={[
          styles.card,
          cardBase,
          styles.front,
          { transform: [{ rotate: "-3deg" }] },
        ]}
      >
        {variant === "track" && (
          <View style={{ gap: 14 }}>
            <MiniRow
              chip="#ff6900"
              muted={textMuted}
              amountColor={expense}
              wide
            />
            <MiniRow
              chip="#38bdf8"
              muted={textMuted}
              amountColor={income}
              wide
            />
            <MiniRow
              chip="#A855F7"
              muted={textMuted}
              amountColor={expense}
              wide
            />
          </View>
        )}

        {variant === "stats" && (
          <View style={{ gap: 12 }}>
            <View style={styles.bars}>
              {[
                { h: 26, c: "#ff6900" },
                { h: 46, c: "#38bdf8" },
                { h: 34, c: "#A855F7" },
                { h: 58, c: accent },
                { h: 22, c: "#FBBF24" },
              ].map((b, i) => (
                <View
                  key={i}
                  style={{
                    width: 16,
                    height: b.h,
                    borderRadius: 5,
                    backgroundColor: b.c,
                  }}
                />
              ))}
            </View>
            <View style={{ gap: 6 }}>
              <Bar w="70%" c={textMuted + "99"} />
              <Bar w="45%" c={textMuted + "55"} h={5} />
            </View>
          </View>
        )}

        {variant === "budget" && (
          <View style={{ gap: 12 }}>
            <View style={styles.spread}>
              <Bar w={54} c={textMuted + "CC"} />
              <View style={[styles.pill, { backgroundColor: expense + "1F" }]}>
                <ThemedText
                  style={{ fontSize: 10, color: expense, fontWeight: "700" }}
                >
                  Over
                </ThemedText>
              </View>
            </View>
            <ThemedText
              style={{ fontSize: 22, fontWeight: "600", color: expense }}
            >
              ₹7,629
            </ThemedText>
            <BudgetProgress fill={1} color={expense} height={7} />
            <View style={styles.spread}>
              <Bar w={44} c={expense + "AA"} h={5} />
              <Bar w={26} c={textMuted + "66"} h={5} />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: "100%",
    height: 250,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    position: "absolute",
    width: 196,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  front: {
    width: 212,
    zIndex: 3,
  },
  miniRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  chip: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 60,
    paddingHorizontal: 4,
  },
  spread: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
});
