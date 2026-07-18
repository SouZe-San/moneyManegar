import dayjs, { Dayjs } from "dayjs";
import DateTimePicker from "react-native-ui-datepicker";
import { View, StyleSheet, Pressable, Modal } from "react-native";
import { useState } from "react";

import { ThemedText } from "../ThemedText";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { CalenderIcon } from "@/assets/icons/SVG/InputIcons";

/** "Today" / "Yesterday" / "18 Jul 2026" — most entries are one of the first two. */
const relativeLabel = (date: Dayjs) => {
  const today = dayjs();
  if (date.isSame(today, "day")) return "Today";
  if (date.isSame(today.subtract(1, "day"), "day")) return "Yesterday";
  return date.format("DD MMM YYYY");
};

const DateView = ({
  date,
  setDate,
}: {
  date: Dayjs;
  setDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
}) => {
  const [pickerVisible, setPickerVisible] = useState(false);

  const accent = useThemeColorWithName("button");
  const iconColor = useThemeColorWithName("inputIcon");
  const borderColor = useThemeColorWithName("borderColor");
  const textColor = useThemeColorWithName("text");
  const background = useThemeColorWithName("background");
  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");
  const textMuted = useThemeColorWithName("textMuted");

  const close = () => setPickerVisible(false);
  const pick = (d: Dayjs) => {
    setDate(d);
    close();
  };

  const isToday = date.isSame(dayjs(), "day");
  const isYesterday = date.isSame(dayjs().subtract(1, "day"), "day");

  return (
    <>
      {/* Trigger row */}
      <Pressable
        style={({ pressed }) => [
          styles.mainContainer,
          {
            backgroundColor: surface,
            borderColor: pressed ? accent + "40" : cardBorder,
          },
        ]}
        onPress={() => setPickerVisible(true)}
      >
        <View style={styles.viewSection}>
          <CalenderIcon color={iconColor} />
          <ThemedText style={{ fontSize: 15 }}>
            {relativeLabel(date)}
          </ThemedText>
          {!isToday && !isYesterday ? null : (
            <ThemedText style={{ fontSize: 12, color: textMuted }}>
              {date.format("DD/MM/YY")}
            </ThemedText>
          )}
        </View>
        <ThemedText style={{ fontSize: 12, color: accent, fontWeight: "600" }}>
          Change
        </ThemedText>
      </Pressable>

      {/* Picker */}
      <Modal
        visible={pickerVisible}
        animationType="fade"
        statusBarTranslucent={true}
        transparent={true}
        onRequestClose={close}
        presentationStyle="overFullScreen"
      >
        <Pressable style={styles.scrim} onPress={close}>
          <Pressable
            style={[
              styles.datePicker,
              { backgroundColor: surface, borderColor: cardBorder },
            ]}
            onPress={() => {}}
          >
            <ThemedText type="defaultSemiBold" style={{ fontSize: 15 }}>
              Select date
            </ThemedText>

            <DateTimePicker
              mode="single"
              date={date}
              calendarTextStyle={{ color: textColor }}
              headerTextStyle={{ color: textColor }}
              weekDaysTextStyle={{ color: textMuted }}
              selectedItemColor={accent}
              headerButtonColor={accent}
              selectedTextStyle={{ color: background }}
              height={300}
              monthContainerStyle={{ backgroundColor: surface, borderColor }}
              yearContainerStyle={{ backgroundColor: surface, borderColor }}
              onChange={(params) => {
                if (params.date) pick(params.date as Dayjs);
              }}
            />

            {/* Quick picks — most entries are today or yesterday */}
            <View style={[styles.footer, { borderTopColor: cardBorder }]}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Pressable
                  onPress={() => pick(dayjs())}
                  style={[
                    styles.chip,
                    {
                      borderColor: isToday ? accent : cardBorder,
                      backgroundColor: isToday ? accent + "1F" : "transparent",
                    },
                  ]}
                >
                  <ThemedText
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: isToday ? accent : textMuted,
                    }}
                  >
                    Today
                  </ThemedText>
                </Pressable>
                <Pressable
                  onPress={() => pick(dayjs().subtract(1, "day"))}
                  style={[
                    styles.chip,
                    {
                      borderColor: isYesterday ? accent : cardBorder,
                      backgroundColor: isYesterday
                        ? accent + "1F"
                        : "transparent",
                    },
                  ]}
                >
                  <ThemedText
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: isYesterday ? accent : textMuted,
                    }}
                  >
                    Yesterday
                  </ThemedText>
                </Pressable>
              </View>

              <Pressable onPress={close} style={styles.chip}>
                <ThemedText
                  style={{ fontSize: 12, fontWeight: "600", color: textMuted }}
                >
                  Cancel
                </ThemedText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default DateView;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    minHeight: 54,
  },
  viewSection: {
    flexDirection: "row",
    alignItems: "center",
    height: 54,
    gap: 10,
  },
  scrim: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.62)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  datePicker: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 10,
    paddingBottom: 6,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "transparent",
  },
});
