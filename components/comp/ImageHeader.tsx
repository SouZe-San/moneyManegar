import { Image, useWindowDimensions, ImageSourcePropType } from "react-native";

const ImageHeader = ({ url }: { url: ImageSourcePropType | undefined }) => {
  const { width: SCREEN_WEIGHT, height: SCREEN_HEIGHT } = useWindowDimensions();

  return (
    <Image
      source={url}
      blurRadius={3}
      resizeMethod="scale"
      style={{
        opacity: 0.6,
        objectFit: "cover",
        position: "absolute",
        top: 0,
        width: SCREEN_WEIGHT,
        height: SCREEN_HEIGHT * 0.25,
      }}
    />
  );
};

export default ImageHeader;
