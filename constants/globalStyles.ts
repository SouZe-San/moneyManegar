import { StyleSheet, StatusBar } from "react-native";

export const globalStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 15,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 60,
  },
  container: {
    flex: 1,
    paddingHorizontal: "4%",
    paddingVertical: "11%",
    width: "100%",
  },
  dateRpw: {},
  entriesViewContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 60,
  },
  inputContainer: {
    flex: 1,
    marginTop: 40,
    paddingTop: 40,
    width: "100%",
    paddingHorizontal: 15,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
});
