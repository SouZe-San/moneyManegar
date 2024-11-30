import { Alert } from "react-native";

const EasyAlert = (title: string, message: string) => {
  return Alert.alert(title, message, [{ text: "OK" }], {
    cancelable: false,
  });
};

export default EasyAlert;
