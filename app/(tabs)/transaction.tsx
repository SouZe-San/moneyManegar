import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import TransactionRow from "@/components/transaction/TransactionRow";
import { globalStyles } from "@/constants/globalStyles";
import { useExpense } from "@/context/ExpanseContext";
import { useState } from "react";
import { SafeAreaView, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Transaction() {
  const { allTransaction } = useExpense();

  const [openedItem, setOpenedItem] = useState<null | string>(null);

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
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <ThemedView style={globalStyles.container}>
          <ThemedText type="title">Transaction</ThemedText>

          <View
            style={{
              marginTop: 30,
              flex: 1,
              gap: 10,
            }}
          >
            {allTransaction.map((item, index) => (
              <TransactionRow
                key={index}
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
            ))}
          </View>
        </ThemedView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
