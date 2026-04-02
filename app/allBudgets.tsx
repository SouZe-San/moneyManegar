import BudgetCard from "@/components/budget/BudgetCard";
import { useSharedValue } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { globalStyles } from "@/constants/globalStyles";
import { showToast } from "@/hooks/useFunc";
import { fetchAllBudgets } from "@/hooks/useQueries";
import { Budget } from "@/types/expanse";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, Dimensions, FlatList, ViewToken } from "react-native";
import AnimateTabView from "@/components/animation/AnimateTabView";

const { width: SCREEN_Width, height: SCREEN_HEIGHT } = Dimensions.get("screen");
export default function allBudgets() {

// States or Input Variables
 const [modalVisible, setModalVisible] = useState(false);
 const [loading, setLoading] = useState(false);
 const [budgets, setBudget] = useState<Budget[]>([]);
 const viewableItems = useSharedValue<ViewToken[]>([]);

 const db = useSQLiteContext();

const fetchData = async () => {
setLoading(true);
  try {
const data = await fetchAllBudgets(db);
setBudget(data);
  } catch (error) {
showToast("ERROR");
console.error("Error Budget fetching data: ", error);
// Handle error state if needed
  } finally {
setLoading(false); // Set loading to false after fetching
  }
};

 useEffect(() => {
  fetchData();
 }, []);

   if (loading) {
    return (
      <AnimateTabView
        style={[
          globalStyles.container,
          {
            paddingBottom: "20%",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ThemedText type="title">Loading... </ThemedText>
      </AnimateTabView>
    );
  }

return (
<ThemedView style={[globalStyles.mainContainer, { paddingHorizontal: 0 }]}>
  <ThemedText style={{ paddingLeft: 10 }} type="title">
      All Budgets
  </ThemedText>
  <View style={[  globalStyles.container,{ width: SCREEN_Width, paddingBottom: 0,paddingTop:"5%" },]}    >
    <FlatList
        data={budgets}
        style={{
          marginTop: 30,
          height: SCREEN_HEIGHT,
          gap: 10,
          borderRadius: 10,
       
        }}
        showsVerticalScrollIndicator={false}  nestedScrollEnabled={true}      onViewableItemsChanged={({ viewableItems: vItems }) => { viewableItems.value = vItems;
        }}
        renderItem={({ item }) => <BudgetCard budget={item} />}
        keyExtractor={(item) => item._id!.toString()}
      />
    </View>
</ThemedView>
);
}
