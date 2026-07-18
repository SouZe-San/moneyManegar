import {
  FlatList,
  Dimensions,
  View,
  ViewToken,
  Pressable,
  Alert,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { useCallback, useState, useRef } from "react";

import AnimatedListItem from "@/components/animation/AnimatedListItem";
import { globalStyles } from "@/constants/globalStyles";
import ImageHeader from "@/components/animation/ImageHeader";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import TransactionItem from "@/components/transaction/TransactionItem";
import { showToast } from "@/hooks/useFunc";
import { useExpense } from "@/context/ExpanseContext";
import EasyAlert from "@/components/comp/EasyAlert";

import {
  fetchAllTransaction,
  deleteTransaction_from_AllTransaction,
} from "@/hooks/useQueries";
import { ITransaction } from "@/types/expanse";
import { SectionList } from "react-native";
import dayjs from "dayjs";
import { useThemeColorWithName } from "@/hooks/useThemeColor";

const { width: SCREEN_Width, height: SCREEN_HEIGHT } = Dimensions.get("screen");

const groupByDate = (items: ITransaction[]) => {
  const today = dayjs().format("DD/MM/YY");
  const yesterday = dayjs().subtract(1, "day").format("DD/MM/YY");

  const map = new Map<string, ITransaction[]>();
  for (const it of items) {
    if (!map.has(it.date)) map.set(it.date, []);
    map.get(it.date)!.push(it);
  }
  return Array.from(map, ([date, data]) => ({
    title: date === today ? "Today" : date === yesterday ? "Yesterday" : date,
    data,
  }));
};

const allTransaction = () => {
  const imgUrl = require("@/assets/images/temp/green.jpg");
  const headerTitle = "All Wastes ಠ⁠_⁠ಠ";

  const mutedColor = useThemeColorWithName("textMuted");
  const accent = useThemeColorWithName("highLightBackground");

  const viewableItems = useSharedValue<ViewToken[]>([]);
  const onViewableItemsChanged = useRef(
    ({ viewableItems: vItems }: { viewableItems: ViewToken[] }) => {
      viewableItems.value = vItems;
    },
  ).current;
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const [refresh, setRefresh] = useState(false);
  const [allTransactions, setAllTransaction] = useState<ITransaction[]>([]);

  const sqlDb = useSQLiteContext();

  // keep Home screen totals (Left Over / Income / Expense) in sync after a delete
  const { onRefresh } = useExpense();

  const fetch = async () => {
    if (!refresh)
      try {
        setRefresh(true);
        const data = await fetchAllTransaction(sqlDb);
        data.sort((a, b) => {
          return b._id! - a._id!;
        });
        setAllTransaction(data);
      } catch (error) {
        console.log("ERROR :", error);
      } finally {
        setRefresh(false);
      }
  };
  useFocusEffect(
    useCallback(() => {
      fetch();
    }, []),
  );

  // Long-press a row -> confirm -> delete from DB + list + refresh totals
  const confirmDelete = useCallback(
    (item: ITransaction) => {
      if (item._id == null) return;
      const id = item._id;
      const amount = Number(item.amount).toLocaleString("en-IN");
      Alert.alert(
        "Delete transaction?",
        `${item.expanseDesc || item.expenseType} · ₹${amount}`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteTransaction_from_AllTransaction(
                  sqlDb,
                  id.toString(),
                );
                setAllTransaction((prev) => prev.filter((t) => t._id !== id));
                showToast("DELETE");
                onRefresh();
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
    [sqlDb, onRefresh],
  );
  return (
    <ThemedView style={globalStyles.stack_container}>
      <ImageHeader imgUrl={imgUrl} title={headerTitle} />
      <View
        style={[
          globalStyles.container,
          { width: SCREEN_Width, paddingBottom: 0 },
        ]}
      >
        {allTransactions.length === 0 && (
          <ThemedText
            type="title"
            colorName="tabIconDefault"
            style={{ textAlign: "center", marginTop: 100 }}
          >
            Itne Jema Karke Kya kare Ga !!!
          </ThemedText>
        )}
        <SectionList
          sections={groupByDate(allTransactions)}
          keyExtractor={(_, index) => index.toString()}
          style={{ marginTop: 30, flex: 1 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          initialNumToRender={10}
          maxToRenderPerBatch={8}
          windowSize={7}
          renderSectionHeader={({ section }) => (
            <ThemedText
              style={{
                fontSize: 12,
                color: mutedColor,
                marginTop: 16,
                marginBottom: 8,
                marginLeft: 4,
              }}
            >
              {section.title}
            </ThemedText>
          )}
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
                <TransactionItem {...item} />
              </Pressable>
            </AnimatedListItem>
          )}
        />
      </View>
    </ThemedView>
  );
};

export default allTransaction;
