// import BottomSheetModal from "@/components/BottomSheetModal";
// import { BottomSheetRefProps } from "@/components/BottomSheetView";
// import GroupInput from "@/components/comp/GroupInput";
import AnimateTabView from "@/components/animation/AnimateTabView";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
export default function CaptureScreen() {
  // const [openedItem, setOpenedItem] = useState<boolean>(false);

  // const ref = useRef<BottomSheetRefProps>(null);

  // const onPress = useCallback(() => {
  //   setOpenedItem(true);
  //   const isActive = ref?.current?.isActive();
  //   if (isActive) {
  //     ref?.current?.scrollTo(20);
  //   } else {
  //     ref?.current?.scrollTo(-200);
  //   }
  // }, []);
  const router = useRouter();
  const navigateToGroup = () => {
    // router.push("/groups/234"); // Navigate with the dynamic `groupId`
  };

  return (
    <AnimateTabView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemedText onPress={navigateToGroup} type="title">
        Capture You $_${" "}
      </ThemedText>
    </AnimateTabView>
  );
}
