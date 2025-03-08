import ImageHeader from "@/components/animation/ImageHeader";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import TransactionItem from "@/components/transaction/TransactionItem";
import { globalStyles } from "@/constants/globalStyles";
import { allTransactions } from "@/constants/tempVar";
import { FlatList, Dimensions, View, ScrollView, ViewToken } from "react-native";
import AnimatedListItem from "@/components/animation/AnimatedListItem";
import { useSharedValue } from "react-native-reanimated";

const { width: SCREEN_Width, height: SCREEN_HEIGHT } = Dimensions.get("screen");

// ! In Future Make it normal if Any problem occurs (remove the scroll view)
const allTransaction = () => {
  const imgUrl = require("@/assets/images/temp/green.jpg");
  const headerTitle = "All Wastes ಠ⁠_⁠ಠ";

  const viewableItems = useSharedValue<ViewToken[]>([]);

  return (
    // <ScrollView showsVerticalScrollIndicator={false}>
    <ThemedView style={globalStyles.stack_container}>
      <ImageHeader imgUrl={imgUrl} title={headerTitle} />
      <View style={[globalStyles.container, { width: SCREEN_Width, paddingBottom: 0 }]}>
        <FlatList
          data={allTransactions}
          style={{
            marginTop: 30,
            height: SCREEN_HEIGHT,
            gap: 10,
            borderRadius: 10,
          }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          onViewableItemsChanged={({ viewableItems: vItems }) => {
            viewableItems.value = vItems;
          }}
          renderItem={({ item }) => (
            <AnimatedListItem item={item} viewableItems={viewableItems}>
              <TransactionItem {...item} />
            </AnimatedListItem>
          )}
          keyExtractor={(item) => item._id!.toString()}
        />
      </View>
    </ThemedView>
    // </ScrollView>
  );
};

export default allTransaction;
