import Animated, { useSharedValue } from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FlatList, ViewToken, RefreshControl } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";

import { ThemedText } from "@/components/ThemedText";
import TransactionRow from "@/components/transaction/TransactionRow";
import AnimateTabView from "@/components/animation/AnimateTabView";
import AnimatedListItem from "@/components/animation/AnimatedListItem";

import { globalStyles } from "@/constants/globalStyles";

import { IUdahar } from "@/types/expanse";

//hooks
import { deleteSingleTransaction, fetchAllUnPaidTransaction } from "@/hooks/queries/udhar";
import { showToast } from "@/hooks/useFunc";

export default function Transaction() {
  const db = useSQLiteContext();

  const [openedItem, setOpenedItem] = useState<null | string>(null);
  const viewableItems = useSharedValue<ViewToken[]>([]);
  const [allRows, setAllRows] = useState<IUdahar[]>([]);
  const [loading, setLoading] = useState(false);

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const rows: IUdahar[] = await fetchAllUnPaidTransaction(db);
      rows.sort((a, b) => b._id! - a._id!);
      setAllRows(rows);
    } catch (error) {
      showToast("ERROR");
      console.error("Error fetching data: ", error);
      // Handle error state if needed
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const removeTransaction = useCallback(async (transactionId: string) => {
    try {
      await deleteSingleTransaction(db, transactionId);
    } catch (error) {}
    setAllRows((prev) =>
      prev.filter((transaction) => transaction._id?.toString() !== transactionId)
    );
  }, []);

  if (loading) {
    return (
      <AnimateTabView
        style={[
          globalStyles.container,
          { paddingBottom: "20%", justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ThemedText type="title">Loading... </ThemedText>
      </AnimateTabView>
    );
  }

  if (allRows.length === 0) {
    return (
      <AnimateTabView
        style={[
          globalStyles.container,
          { paddingBottom: "20%", justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ThemedText type="title">{"(⁠ʘ⁠ᴗ⁠ʘ⁠✿⁠)"} </ThemedText>
      </AnimateTabView>
    );
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AnimateTabView
        style={[globalStyles.container, { paddingBottom: "20%" }]}
      >
        <ThemedText type="title">Pauna-Gonda</ThemedText>

        <FlatList
          style={{
            marginTop: 30,
            flex: 1,
            gap: 10,
          }}
          data={allRows}
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={({ viewableItems: vItems }) => {
            viewableItems.value = vItems;
          }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchData} />
          }
          renderItem={({ item, index }) => (
            <Animated.View>
              <AnimatedListItem
                item={item}
                index={index}
                viewableItems={viewableItems}
              >
                <TransactionRow
                  transactionId={item._id!}
                  expanseDescription={item.expanseDesc}
                  expanseData={item.date}
                  expanseAmount={item.amount}
                  expanseType={item.expenseType}
                  transactionType={item.type}
                  toWhom={item.toWhom}
                  onSwipeableWillOpen={handleSwipeableWillOpen}
                  onSwipeableWillClose={handleSwipeableWillClose}
                  openedItem={openedItem}
                  removeTransaction={removeTransaction}
                  memberId={item.memberId!}
                />
              </AnimatedListItem>
            </Animated.View>
          )}
          keyExtractor={(item) => item._id!.toString()}
        />
      </AnimateTabView>
    </GestureHandlerRootView>
  );
}
