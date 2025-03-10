import ImageHeader from "@/components/animation/ImageHeader";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import TransactionItem from "@/components/transaction/TransactionItem";
import { globalStyles } from "@/constants/globalStyles";
// import { allTransactions } from "@/constants/tempVar";
import { FlatList, Dimensions, View, ScrollView, ViewToken, RefreshControl } from "react-native";
import AnimatedListItem from "@/components/animation/AnimatedListItem";
import { useSharedValue } from "react-native-reanimated";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { ITransaction } from "@/types/expanse";
import { fetchAllTransaction } from "@/hooks/useQueries";
import { useSQLiteContext } from "expo-sqlite";

const { width: SCREEN_Width, height: SCREEN_HEIGHT } = Dimensions.get("screen");

// ! In Future Make it normal if Any problem occurs (remove the scroll view)
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
    // <ScrollView showsVerticalScrollIndicator={false}>
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
    // </ScrollView>
  );
};

export default allTransaction;
