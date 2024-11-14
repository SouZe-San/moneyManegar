import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { ThemedView } from "../ThemedView";
import DateTimePicker from "react-native-ui-datepicker";

import dayjs, { Dayjs } from "dayjs";
import { CalenderIcon } from "@/assets/icons/SVG/InputIcons";

import { ThemedText } from "../ThemedText";
import { useState } from "react";
import { View, StyleSheet, Pressable, Modal } from "react-native";
const DateView = ({
  date,
  setDate,
}: {
  date: Dayjs;
  setDate: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
}) => {
  const buttonBgColor = useThemeColorWithName("button");
  const [pickerVisible, setPickerVisible] = useState(false);
  const iconColor = useThemeColorWithName("inputIcon");
  const borderColor = useThemeColorWithName("borderColor");
  const textColor = useThemeColorWithName("text");
  const background = useThemeColorWithName("background");
  const blurBg = useThemeColorWithName("navBg");
  return (
    <Pressable
      style={[styles.mainContainer, { borderColor }]}
      onPress={() => setPickerVisible(!pickerVisible)}
    >
      <View style={[styles.viewSection]}>
        <CalenderIcon color={iconColor} />
        <ThemedText style={{ fontSize: 15 }}>{date.format("DD/MM/YYYY")}</ThemedText>
      </View>

      {/* {pickerVisible && ( */}
      <Modal
        visible={pickerVisible}
        animationType="fade"
        statusBarTranslucent={true}
        transparent={true}
        onRequestClose={() => setPickerVisible(false)}
        presentationStyle="overFullScreen"
      >
        <View
          style={{
            backgroundColor: blurBg,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={[
              styles.datePicker,
              {
                shadowColor: buttonBgColor,
                backgroundColor: background,
              },
            ]}
          >
            <DateTimePicker
              mode="single"
              date={date}
              calendarTextStyle={{ color: textColor }}
              headerTextStyle={{ color: textColor }}
              weekDaysTextStyle={{ color: textColor }}
              selectedItemColor={buttonBgColor}
              headerButtonColor={buttonBgColor}
              selectedTextStyle={{ color: background }}
              height={300}
              monthContainerStyle={{ backgroundColor: background, borderColor }}
              yearContainerStyle={{ backgroundColor: background, borderColor }}
              onChange={(params) => {
                if (params.date) {
                  setDate(params.date as Dayjs); // Only set if params.date is defined
                  setPickerVisible(false);
                }
              }}
            />
          </View>
        </View>
      </Modal>
      {/* )} */}
    </Pressable>
  );
};

export default DateView;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 10,

    borderWidth: 1,
    paddingHorizontal: 10,
  },
  viewSection: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    justifyContent: "flex-start",
    gap: 5,
    marginVertical: 10,
  },
  datePicker: {
    width: "80%",
    // position: "absolute",
    // top: "190%",
    backfaceVisibility: "hidden",
    // right: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
    borderRadius: 10,
  },
  monthContainer: {},
});
