import { Alert } from "react-native";

const RedirectAlert = (message: string, onPress: () => void, title?: string) => {
  return Alert.alert(
    title || "Success",
    message,
    [
      {
        text: "OK",
        onPress: onPress,
      },
    ],
    {
      cancelable: false,
    }
  );
};

export default RedirectAlert;
