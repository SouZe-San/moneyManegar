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
  entriesViewContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 60,
  },
  // Single Stack screen
  stack_container: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  // THis is used in udhari TAB
  container: {
    flex: 1,
    paddingHorizontal: "4%",
    paddingVertical: "11%",
    width: "100%",
  },
  // All Input Box
  inputContainer: {
    flex: 1,
    marginTop: 40,
    paddingTop: 40,
    width: "100%",
    paddingHorizontal: 15,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },

  // Used In Entries Stack-screen
  animated_stackContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  submit_btn_container: {
    marginBottom: 55,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  iconInputBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    fontSize: 15,
    marginLeft: 5,
    marginVertical: 10,
    paddingHorizontal: 5,
    width: "80%",
  },
});

// {
//     position: "absolute",
//     bottom: 30,
//     width: "100%",
//     left: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   }
