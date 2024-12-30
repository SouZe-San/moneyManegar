import Animated, { useSharedValue } from "react-native-reanimated";
import { FlatList, ViewToken } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ThemedText } from "@/components/ThemedText";
import TransactionRow from "@/components/transaction/TransactionRow";
import AnimateTabView from "@/components/animation/AnimateTabView";
import AnimatedListItem from "@/components/animation/AnimatedListItem";

import { globalStyles } from "@/constants/globalStyles";
import { useExpense } from "@/context/ExpanseContext";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { expenses } from "@/constants/tempVar";
import { IUdahar } from "@/types/expanse";

export default function Transaction() {
  const { allTransaction } = useExpense();
  const db = useSQLiteContext();

  const [openedItem, setOpenedItem] = useState<null | string>(null);
  const viewableItems = useSharedValue<ViewToken[]>([]);
  const [allRows, setAllRows] = useState<IUdahar[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Function to insert dummy data into the table
  // const insertDummyData = async () => {
  //   console.log("====================================");

  //   console.log("====================================");
  //   for (const transaction of expenses) {
  //     console.log("inserting...");
  //     const query = `
  //       INSERT INTO UdharTransactions (amount, type, expenseType, date, toWhom,expanseDesc) VALUES (?, ?, ?, ?, ?, ?)`;

  //     try {
  //       await db.runAsync(query, [
  //         transaction.expanseAmount,
  //         transaction.type,
  //         transaction.expanseType,
  //         transaction.expanseData,
  //         transaction.toWhom || "", // Default empty string if 'toWhom' is missing
  //         transaction.expanseDescription,
  //       ]);
  //       console.log("Transaction inserted:", transaction);
  //     } catch (error) {
  //       console.error("Error inserting transaction:", error);
  //     }
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data...");
      try {
        const rows: IUdahar[] = await db.getAllAsync("SELECT * FROM UdharTransactions");
        setAllRows(rows);
      } catch (error) {
        console.error("Error fetching data: ", error);
        // Handle error state if needed
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const initializeDb = async () => {
  //     // await insertDummyData(); // Insert the dummy data
  //     const query = 'DELETE FROM UdharTransactions WHERE type = "credit"';
  //     try {
  //       await db.runAsync(query);
  //     } catch (error) {
  //       console.error("Error deleting transactions:", error);
  //     }
  //   };

  //   initializeDb();
  // }, []);

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
        <ThemedText type="title">Free Soul </ThemedText>
      </AnimateTabView>
    );
  }
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
          data={allRows}
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={({ viewableItems: vItems }) => {
            viewableItems.value = vItems;
          }}
          renderItem={({ item }) => (
            <Animated.View>
              <AnimatedListItem item={item} viewableItems={viewableItems}>
                <TransactionRow
                  transactionId={item._id}
                  expanseDescription={item.expanseDesc}
                  expanseData={item.date}
                  expanseAmount={item.amount}
                  expanseType={item.expenseType}
                  transactionType={item.type}
                  toWhom={item.toWhom}
                  onSwipeableWillOpen={handleSwipeableWillOpen}
                  onSwipeableWillClose={handleSwipeableWillClose}
                  openedItem={openedItem}
                />
              </AnimatedListItem>
            </Animated.View>
          )}
          keyExtractor={(item) => item._id.toString()}
        />
      </AnimateTabView>
    </GestureHandlerRootView>
  );
}
