import Animated, {
  useAnimatedStyle,
  withTiming,
  SharedValue,
  Easing,
  withSpring,
  ReduceMotion,
} from "react-native-reanimated";
import { getInfoAsync } from "expo-file-system";
import { View, StyleSheet, Pressable, ViewToken, Image } from "react-native";
import { useEffect, useState } from "react";

import { ThemedText } from "../ThemedText";

import { IGroup, Members } from "@/types/expanse";

import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { getRandomFaces } from "@/hooks/useFunc";
// import * as FileSystem from "expo-file-system";
type SingleBoxProps = {
  icon?: string | null;
  label: string;
  isMem?: boolean;
  imgUrl: string | null;
  item: IGroup | Members;
  viewableItems: SharedValue<ViewToken[]>;
  onPress?: () => void;
};

const FolioBox = ({
  icon,
  label,
  isMem = false,
  item,
  imgUrl,
  viewableItems,
  onPress = () => console.warn("pressed"),
}: SingleBoxProps) => {
  const unSelectedButtonBgColor = useThemeColorWithName("blurBg");
  const [isFile, setIsFile] = useState(false);

  useEffect(() => {
    if (imgUrl) {
      try {
        getInfoAsync(imgUrl).then((res) => {
          setIsFile(res.exists);
        });
      } catch (error) {
        console.log("Error Reading File", error);
      }
    }
  }, [imgUrl]);

  const rStyle = useAnimatedStyle(() => {
    const isVisible = Boolean(
      viewableItems.value
        .filter((item) => item.isViewable)
        .find((viewableItem) => viewableItem.item._id === item._id)
    );
    return {
      opacity: withTiming(isVisible ? 1 : 0, {
        duration: 300, // Adjust duration for smoother transition
        easing: Easing.out(Easing.exp), // Use an easing function for smoother transitions
      }),

      transform: [
        {
          scale: withSpring(isVisible ? 1 : 0.3, {
            duration: 400,
            stiffness: 75,
            overshootClamping: false,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 2,
            reduceMotion: ReduceMotion.System,
          }),
        },
      ],
    };
  }, [viewableItems.value]); // Add dependencies to ensure it updates correctly

  return (
    <Animated.View style={[rStyle]}>
      <View style={[styles.expenseTypeButton]}>
        <Pressable
          style={[
            styles.expenseTypeButton_btn,
            {
              backgroundColor: unSelectedButtonBgColor,
              filter: "brightness(1.01)",
            },
          ]}
          onPress={onPress}
        >
          {isFile ? (
            <Image
              source={{ uri: imgUrl! }}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          ) : isMem ? (
            <ThemedText style={[styles.buttonLabel]}>{getRandomFaces()}</ThemedText>
          ) : (
            <ThemedText style={styles.buttonLabel}>{icon}</ThemedText>
          )}
        </Pressable>
        <ThemedText style={styles.buttonSubLabel} colorName="buttonBg">
          {label}
        </ThemedText>
      </View>
    </Animated.View>
  );
};

export default FolioBox;
const styles = StyleSheet.create({
  expenseTypeButton: {
    // width: 60,
    height: 170,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  expenseTypeButton_btn: {
    backdropFilter: "blur(10px)",
    backgroundColor: "#bababa93",
    width: 100,
    aspectRatio: 3 / 4,
    display: "flex",

    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  buttonLabel: {
    fontSize: 20,
  },
  buttonSubLabel: {
    fontSize: 14,
  },
});
