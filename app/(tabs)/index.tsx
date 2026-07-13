import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  ViewToken,
  Dimensions,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useRef, useCallback} from "react";
import { BarChart, PieChartPro } from "react-native-gifted-charts";
// import { useSQLiteContext } from "expo-sqlite";
// import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

// Components

import { ThemedText } from "@/components/ThemedText";
import MemberDetails from "@/components/details/MemberDetails";
import { HelloWave } from "@/components/animation/HelloWave";
import AnimateTabView from "@/components/animation/AnimateTabView";
import { globalStyles } from "@/constants/globalStyles";
import RedirectButton from "@/components/comp/RedirectButton";
import ColorLabeling from "@/components/comp/ColorLabeling";

// import { expenseTypeData } from "@/constants/tempVar";
// Hooks
import { useThemeColorWithName } from "@/hooks/useThemeColor";
import { useExpense } from "@/context/ExpanseContext";

// Icons
import { DbIcon, ExpanseDownIcon, StatsIcon } from "@/assets/icons/SVG/RandomIcons";

// Modal
import BottomSheetModal from "@/components/BottomSheetModal";
import { BottomSheetRefProps } from "@/components/BottomSheetView";
import FolioBox from "@/components/comp/FolioBox";
import { useSharedValue } from "react-native-reanimated";
import MoneyText from "@/components/comp/MoneyText";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function HomeScreen() {
  // Colors
  const expanseBg = useThemeColorWithName("expanseBg");
  const shadowColor = useThemeColorWithName("background");
  const darkTextColor = "#030f0e";
  const balanceBg = useThemeColorWithName("highLightBackground");
  const surface = useThemeColorWithName("surface");
  const cardBorder = useThemeColorWithName("cardBorder");
  const expenseColor = useThemeColorWithName("expense");
  const incomeColor = useThemeColorWithName("income");  

  // States
  const [modalVisible, setModalVisible] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);

  // modal Reference
  const ref = useRef<BottomSheetRefProps>(null);

  // ** Using To visualize the db
  // const db = useSQLiteContext();
  // useDrizzleStudio(db);

  const {
    expenseTypeData,
    groups,
    onRefresh,
    leftBalance,
    members,
    totalBudget,
    totalIncome,
    totalExpense,
    refresh,
    userName,
    expenseInMonth,
    totalExpenseMonthWise,
    totalIncomeMonthWise,
  } = useExpense();

  const viewableItems1 = useSharedValue<ViewToken[]>([]);
  const viewableItems2 = useSharedValue<ViewToken[]>([]);
  // Router
  const router = useRouter();

  // Open Modal
  const onPress = useCallback((id: string) => {
    setModalVisible(true);
    setMemberId(id);
    const isActive = ref?.current?.isActive();
    if (isActive) {
      ref?.current?.scrollTo(20);
    } else {
      ref?.current?.scrollTo(-200);
    }
  }, []);

  return (
    <AnimateTabView
      style={[
        globalStyles.container,
        { paddingBottom: 100, paddingHorizontal: 0 },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      >
        <ThemedText
          type="title"
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            paddingHorizontal: "4%",
          }}
        >
          Hi,<Text style={{ fontSize: 28 }}>{userName}</Text>
          <HelloWave />
        </ThemedText>
        {/* Cost View Section */}
        <View style={styles.costSection}>
          <View>
            <View
              style={[
                styles.costViewBox,
                {
                  backgroundColor: balanceBg,
                  borderColor: balanceBg,
                  position: "relative",
                },
              ]}
            >
              <ThemedText
                type="defaultSemiBold"
                style={{ fontSize: 14, color: darkTextColor }}
              >
                Left Over
              </ThemedText>
              {leftBalance < 0 && (
                <ThemedText
                  type="default"
                  style={[
                    styles.shortTag,
                    { fontSize: 14, color: darkTextColor },
                  ]}
                >
                  Me Brock ಥ⁠╭⁠╮⁠ಥ┐
                </ThemedText>
              )}

              {/* Balance */}

              <MoneyText
                value={leftBalance}
                size={28}
                color={darkTextColor}
                decimalColor="#030f0ec2"
                prefix="₹"
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <View
              style={[
                styles.costViewBox,
                { width: "49%", backgroundColor: expanseBg },
              ]}
            >
              <ThemedText
                type="default"
                style={{
                  fontSize: 12,
                  color: "#c4cecb",
                  flexDirection: "row",
                  alignItems: "flex-end",
                }}
              >
                Expanse
              </ThemedText>
              <MoneyText
                value={expenseInMonth ? totalExpenseMonthWise : totalExpense}
                size={24}
              />
            </View>
            <View
              style={[
                styles.costViewBox,
                {
                  width: "49%",
                  backgroundColor: surface,
                  borderColor: cardBorder,
                },
              ]}
            >
              <ThemedText
                type="default"
                style={{ fontSize: 12, color: "#8A9B96" }}
              >
                Income
              </ThemedText>
              <MoneyText
                value={expenseInMonth ? totalIncomeMonthWise : totalIncome}
                size={24}
              />
            </View>
          </View>
        </View>

        {/* New User Image */}
        {members.length === 0 && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <Image
              source={require("@/assets/images/hero/heroImg.png")}
              style={{
                opacity: 0.5,
                objectFit: "contain",
                width: "100%",
                height: SCREEN_HEIGHT * 0.6,
              }}
            />
          </View>
        )}

        {/*//^ All New Groups */}

        {/* Members */}
        <View
          style={[
            styles.groupContainer,
            { marginTop: 20, display: members.length === 0 ? "none" : "flex" },
          ]}
        >
          <ThemedText
            type="title"
            style={{ fontSize: 20, paddingHorizontal: "4%" }}
          >
            Pals & Partners
          </ThemedText>
          <View
            style={{
              flexGrow: 0,
              marginVertical: 5,
              flexDirection: "row",
            }}
          >
            {/* Shadow View */}
            <View
              style={{
                alignSelf: "flex-start",

                width: 1,
                height: "100%",
                shadowColor: balanceBg,
                elevation: 15,
                shadowOpacity: 1,
                shadowRadius: 7,
                shadowOffset: {
                  width: -20,
                  height: 0,
                },
              }}
            ></View>
            <FlatList
              data={members}
              keyExtractor={(item) => item._id?.toString()!}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                paddingLeft: "3%",
              }}
              onViewableItemsChanged={({ viewableItems: vItems }) => {
                viewableItems1.value = vItems;
              }}
              renderItem={({ item }) => (
                <FolioBox
                  label={item.userName}
                  imgUrl={item.imgUrl}
                  item={item}
                  viewableItems={viewableItems1}
                  isMem={true}
                  onPress={() => onPress(item._id?.toString()!)}
                />
              )}
            />
            <View
              style={{
                alignSelf: "flex-end",
                width: 1,
                height: "100%",
                shadowColor,
                elevation: 15,
                shadowOpacity: 1,
                shadowRadius: 7,
                shadowOffset: {
                  width: -20,
                  height: 0,
                },
              }}
            ></View>
          </View>
        </View>
        {/* Groups */}
        <View
          style={[
            styles.groupContainer,
            { display: groups.length === 0 ? "none" : "flex" },
          ]}
        >
          <ThemedText
            type="title"
            style={{ fontSize: 20, paddingHorizontal: "4%" }}
          >
            My Circles
          </ThemedText>
          <View
            style={{
              flexGrow: 0,
              marginVertical: 5,
            }}
          >
            <FlatList
              data={groups}
              keyExtractor={(item) => item._id?.toString()!}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                paddingLeft: "4%",
              }}
              onViewableItemsChanged={({ viewableItems: vItems }) => {
                viewableItems2.value = vItems;
              }}
              renderItem={({ item }) => (
                <FolioBox
                  label={item.name}
                  icon={item.logo}
                  imgUrl={item.imgUrl}
                  item={item}
                  viewableItems={viewableItems2}
                  onPress={() => router.push(`/groups/${item._id}`)}
                />
              )}
            />
          </View>
        </View>

        <View
          style={{
            width: "100%",
            paddingHorizontal: "4%",
          }}
        >
          <RedirectButton
            icon={<DbIcon color={balanceBg} />}
            label="All Transactions"
            redirectUrl={"/allTransaction"}
          />
        </View>
        <View style={{ position: "relative" }}>
          <BottomSheetModal
            isOpen={modalVisible}
            setIsOpen={setModalVisible}
            ref={ref}
          >
            <MemberDetails id={memberId} />
          </BottomSheetModal>
        </View>
        {/*//! Two Chart */}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems:"flex-end",
            marginVertical: 10,
            marginTop: 40,
            paddingHorizontal: 20,
            display:
              totalBudget[0].value + totalBudget[1].value === 0
                ? "none"
                : "flex",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <PieChartPro
              showText={false}
              textSize={0}
              data={expenseTypeData}
              radius={60}
              innerRadius={45}
              donut
            />
            {/* Color Labeling */}
            <View
              style={{
                marginTop: 10,
              }}
            >
              {expenseTypeData.map((item, index) => {
                return (
                  <ColorLabeling
                    color={item.color}
                    key={index.toString()}
                    label={item.text}
                    amount={item.value}
                    totalAmt={expenseTypeData.reduce(
                      (sum, item) => sum + item.value,
                      0,
                    )}
                  />
                );
              })}
            </View>
          </View>

          <View
            style={{
              alignItems: "center",
            }}
          >
            <ThemedText type="subtitle" style={{ marginBottom: 10 }}>
              {new Date().toLocaleString("default", { month: "long" })}
            </ThemedText>
            {/* <PieChartPro textSize={0} radius={50} innerRadius={35} donut data={totalBudget} /> */}
            <BarChart
              data={totalBudget}
              barWidth={12}
              // hideAxesAndRules
              maxValue={
                Math.max(totalBudget[0].value, totalBudget[1].value) * 1.15
              }
              hideAxesAndRules
              hideYAxisText
              xAxisLabelTextStyle={{ height: 0 }}
              noOfSections={3}
              frontColor="lightgray"
              spacing={25}
              // initialSpacing={40}
              endSpacing={10}
              roundedTop
              roundedBottom
              hideRules
            />
            {/* Color Labeling */}
            <View
            >
              {totalBudget.map((item, index) => {
                return (
                  <ColorLabeling
                    color={item.frontColor}
                    key={index.toString()}
                    label={item.label}
                    amount={item.value}
                    totalAmt={totalBudget.reduce(
                      (sum, item) => sum + item.value,
                      0,
                    )}
                  />
                );
              })}
            </View>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            paddingHorizontal: "4%",
            marginBottom: 30,
          }}
        >
          <RedirectButton
            icon={<StatsIcon color={balanceBg} />}
            label="Stats"
            redirectUrl={"/allStats"}
          />
        </View>
        {/* MoDal */}
      </ScrollView>
    </AnimateTabView>
  );
}

const styles = StyleSheet.create({
  costSection: {
    marginTop: 20,
    width: "100%",
    gap: 8,
    paddingHorizontal: "4%",
  },
  costViewBox: {
    width: "auto",
    borderWidth: 1,
    display: "flex",
    borderRadius: 10,
    borderColor: "transparent",
    justifyContent: "space-between",
    // justifyContent: "flex-end",
    paddingBottom: 15,
    height: 100,
    padding: 10,
  },
  groupContainer: {
    paddingHorizontal: 10,

    borderRadius: 10,
  },
  shortTag: {
    position: "absolute",
    top: 15,
    right: 15,
    textAlign: "right",
  },
});
