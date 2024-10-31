import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import TransactionRow from "@/components/transaction/TransactionRow";
import { globalStyles } from "@/constants/globalStyles";
import { SafeAreaView, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const expenses: Expense[] = [
  {
    expanseDescription: "Scuty's Fuel",
    expanseData: "10-21-21",
    expanseAmount: "200.00",
    expanseType: "Fuel",
  },
  // You can add more expense objects here
  {
    expanseDescription: "Grocery Shopping",
    expanseData: "10-22-21",
    expanseAmount: "150.00",
    expanseType: "Food",
  },
  {
    expanseDescription: "Travel to City",
    expanseData: "10-23-21",
    expanseAmount: "300.00",
    expanseType: "Travels",
  },
  {
    expanseDescription: "Recharge Mobile",
    expanseData: "10-24-21",
    expanseAmount: "50.00",
    expanseType: "Recharge",
  },
  {
    expanseDescription: "Clothing Shopping",
    expanseData: "10-25-21",
    expanseAmount: "120.00",
    expanseType: "Shopping",
  },
  {
    expanseDescription: "Miscellaneous",
    expanseData: "10-26-21",
    expanseAmount: "80.00",
    expanseType: "Others",
  },
];

interface Expense {
  expanseDescription: string;
  expanseData: string; // Consider using Date type if you want to handle dates properly
  expanseAmount: string; // You might want to use number type for calculations
  expanseType: "Food" | "Fuel" | "Shopping" | "Recharge" | "Travels" | "Others";
}

export default function Transaction() {
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
            {expenses.map((item, index) => (
              <TransactionRow
                key={index}
                expanseDescription={item.expanseDescription}
                expanseData={item.expanseData}
                expanseAmount={item.expanseAmount}
                expanseType={item.expanseType}
              />
            ))}
          </View>
        </ThemedView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
