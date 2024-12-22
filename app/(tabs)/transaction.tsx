import { ThemedText } from "@/components/ThemedText";
import TransactionRow from "@/components/transaction/TransactionRow";
import { globalStyles } from "@/constants/globalStyles";
import { useExpense } from "@/context/ExpanseContext";
import { useState } from "react";
import { FlatList, ViewToken } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AnimateTabView from "@/components/animation/AnimateTabView";
import AnimatedListItem from "@/components/animation/AnimatedListItem";
import Animated, { useSharedValue } from "react-native-reanimated";
export default function Transaction() {
  const { allTransaction } = useExpense();

  const [openedItem, setOpenedItem] = useState<null | string>(null);
  const viewableItems = useSharedValue<ViewToken[]>([]);
  const handleSwipeableWillOpen = (id: string) => {
    if (openedItem !== id) {
      setOpenedItem(id);
    }
  };

  const handleSwipeableWillClose = (id: string) => {
    if (openedItem === id) {
      setOpenedItem(null);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AnimateTabView style={[globalStyles.container, { paddingBottom: "20%" }]}>
        <ThemedText type="title">Pauna-Gonda</ThemedText>

        <FlatList
          style={{
            marginTop: 30,
            flex: 1,
            gap: 10,
          }}
          data={allTransaction}
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={({ viewableItems: vItems }) => {
            viewableItems.value = vItems;
          }}
          renderItem={({ item }) => (
            <Animated.View>
              <AnimatedListItem item={item} viewableItems={viewableItems}>
                <TransactionRow
                  transactionId={item.transactionId}
                  expanseDescription={item.expanseDescription}
                  expanseData={item.expanseData}
                  expanseAmount={item.expanseAmount}
                  expanseType={item.expanseType}
                  transactionType={item.type}
                  toWhom={item.toWhom}
                  onSwipeableWillOpen={handleSwipeableWillOpen}
                  onSwipeableWillClose={handleSwipeableWillClose}
                  openedItem={openedItem}
                />
              </AnimatedListItem>
            </Animated.View>
          )}
          keyExtractor={(item) => item.transactionId}
        />
      </AnimateTabView>
    </GestureHandlerRootView>
  );
}
