import { FlatList, Dimensions, View, ViewToken } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import AnimatedListItem from "@/components/animation/AnimatedListItem";
import { globalStyles } from "@/constants/globalStyles";
import ImageHeader from "@/components/animation/ImageHeader";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import TransactionItem from "@/components/transaction/TransactionItem";

import { fetchAllTransaction } from "@/hooks/useQueries";
import { ITransaction } from "@/types/expanse";

const { width: SCREEN_Width, height: SCREEN_HEIGHT } = Dimensions.get("screen");

const allTransaction = () => {
  const imgUrl = require("@/assets/images/temp/green.jpg");
  const headerTitle = "All Wastes ಠ⁠_⁠ಠ";

  const viewableItems = useSharedValue<ViewToken[]>([]);

  const [refresh, setRefresh] = useState(false);
  const [allTransactions, setAllTransaction] = useState<ITransaction[]>([]);

  const sqlDb = useSQLiteContext();

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
    }, [])
  );

  return (
    <ThemedView style={globalStyles.stack_container}>
      <ImageHeader imgUrl={imgUrl} title={headerTitle} />
      <View style={[globalStyles.container, { width: SCREEN_Width, paddingBottom: 0 }]}>
        {allTransactions.length === 0 && (
          <ThemedText
            type="title"
            colorName="tabIconDefault"
            style={{ textAlign: "center", marginTop: 100 }}
          >
            Itne Jema Karke Kya kare Ga !!!
          </ThemedText>
        )}
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
  );
};

export default allTransaction;
