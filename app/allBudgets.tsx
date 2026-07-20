import BudgetCard from "@/components/budget/BudgetCard";
import { useSharedValue } from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { globalStyles } from "@/constants/globalStyles";
import { showToast } from "@/hooks/useFunc";
import { fetchAllBudgets } from "@/hooks/queries/budget";
import { Budget } from "@/types/expanse";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useMemo, useRef, useState } from "react";
import { View, Dimensions, FlatList, ViewToken } from "react-native";
import AnimateTabView from "@/components/animation/AnimateTabView";
import AnimatedListItem from "@/components/animation/AnimatedListItem";
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { useFocusEffect } from "expo-router";

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
                <BudgetCard budget={item} />
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
