import { View, Image, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";

const ImageAndName = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/temp/myprofile.jpg")}
        style={{
          opacity: 0.5,
          position: "absolute",
          bottom: 0,
          zIndex: -1,
          objectFit: "cover",
          width: "100%",
          height: "100%",
        }}
      />
      <View style={[styles.image]}>
        <Image
          source={require("@/assets/images/temp/myprofile.jpg")}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </View>
      <ThemedText type="title">Souze</ThemedText>
    </View>
  );
};

export default ImageAndName;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    gap: 10,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 10,
  },
  image: {
    width: 100,
    aspectRatio: 1,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    overflow: "hidden",
  },
});
