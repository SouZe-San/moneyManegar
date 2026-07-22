import { View, Dimensions, FlatList, ViewToken, Pressable, Alert } from "react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useSharedValue } from "react-native-reanimated";
import { useSQLiteContext } from "expo-sqlite";

// components
import AnimateTabView from "@/components/animation/AnimateTabView";
import AnimatedListItem from "@/components/animation/AnimatedListItem";
import BudgetCard from "@/components/budget/BudgetCard";
import EasyAlert from "@/components/comp/EasyAlert";
import { globalStyles } from "@/constants/globalStyles";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { Budget } from "@/types/expanse";
// hooks
import { deleteBudget, fetchAllBudgets } from "@/hooks/queries/budget";
import { showToast } from "@/hooks/useFunc";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

const { width: SCREEN_Width } = Dimensions.get("screen");

export default function allBudgets() {
  // States or Input Variables
  const [loading, setLoading] = useState(false);
  const [budgets, setBudget] = useState<Budget[]>([]);
  const viewableItems = useSharedValue<ViewToken[]>([]);
  const textMuted = useThemeColorWithName("textMuted");
  const db = useSQLiteContext();

  const onViewableItemsChanged = useRef(
    ({ viewableItems: vItems }: { viewableItems: ViewToken[] }) => {
      viewableItems.value = vItems;
    },
  ).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllBudgets(db);
      setBudget(data);
    } catch (error) {
      showToast("ERROR");
      console.error("Error Budget fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  // Newest month first — most recent budget is what you actually want to see.
  const ordered = useMemo(() => [...budgets].reverse(), [budgets]);

    const confirmDelete = useCallback(
      (item: Budget) => {
        if (item._id == null) return;
        const id = item._id;
        Alert.alert(
          "Delete Budget?",
          `${new Date(2020, parseInt(item.month, 10) - 1, 1).toLocaleString(
            "en-US",
            {
              month: "long",
            },
          )} · budget:₹${item.budget_amount}`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                try {
                  await deleteBudget(db, id.toString());
                  setBudget((prev) => prev.filter((t) => t._id !== id));
                  showToast("BUDGET_DELETE");
                } catch (error) {
                  console.log("Delete transaction error:", error);
                  EasyAlert("Error", "Could not delete. Please try again.");
                }
              },
            },
          ],
          { cancelable: true },
        );
      },
      [db],
    );

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
      <View style={{ paddingHorizontal: 20 }}>
        <ThemedText type="title">All Budgets</ThemedText>
        <ThemedText style={{ fontSize: 13, color: textMuted, marginTop: 4 }}>
          {ordered.length === 0
            ? "Nothing tracked yet"
            : `${ordered.length} month${ordered.length > 1 ? "s" : ""} tracked`}
        </ThemedText>
      </View>

      <View
        style={[
          globalStyles.container,
          { width: SCREEN_Width, paddingBottom: 0, paddingTop: "5%" },
        ]}
      >
        {ordered.length === 0 ? (
          <View style={{ paddingVertical: 60, alignItems: "center", gap: 6 }}>
            <ThemedText type="subtitle" style={{ textAlign: "center" }}>
              No budgets yet
            </ThemedText>
            <ThemedText
              style={{ fontSize: 13, color: textMuted, textAlign: "center" }}
            >
              Create one from the Budget screen to see it here.
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={ordered}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            windowSize={7}
            renderItem={({ item, index }) => (
              <AnimatedListItem
                item={item}
                index={index}
                viewableItems={viewableItems}
              >
                <Pressable
                  onLongPress={() => confirmDelete(item)}
                  delayLongPress={350}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <BudgetCard budget={item} />
                </Pressable>
              </AnimatedListItem>
            )}
            keyExtractor={(item, index) =>
              item._id?.toString() ?? String(index)
            }
          />
        )}
      </View>
    </ThemedView>
  );
}
