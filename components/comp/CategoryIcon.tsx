import React from "react";
import Svg, { G, Path, Circle } from "react-native-svg";

export type CategoryName =
  | "Food"
  | "Fuel"
  | "Shopping"
  | "Recharge"
  | "Travels"
  | "Others"
  | "Rent"
  | "Bill"
  | "Salary"
  | "Gift"
  | "Business";

const SHAPES: Record<CategoryName, React.ReactNode> = {
  Food: (
    <>
      <Path d="M8 3v6M6.5 3v5.5M9.5 3v5.5M8 9v12" />
      <Path d="M15.5 3c2.5 1 2.5 6 .5 9M16 3v9M16 12v9" />
    </>
  ),
  Fuel: (
    <>
      <Path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0v-6.998a2 2 0 0 0-.59-1.42L18 5M14 21V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16M2 21h13M3 9h11" />
    </>
  ),
  Shopping: (
    <Path
      fill="currentColor"
      d="M6.241 20.682q-.433-.434-.433-1.066t.433-1.067q.434-.433 1.067-.433t1.066.433.434 1.067-.434 1.066-1.066.434-1.067-.434m9.385 0q-.434-.434-.434-1.066t.434-1.067q.434-.433 1.066-.433t1.067.433q.433.434.433 1.067 0 .632-.433 1.066-.434.434-1.067.434t-1.066-.434M5.881 5.5l2.669 5.616h6.635q.173 0 .307-.087.135-.087.231-.24l2.616-4.75q.115-.212.019-.375-.097-.164-.327-.164zm-.489-1h13.02q.651 0 .98.532.33.531.035 1.095l-2.858 5.208q-.217.365-.564.573t-.763.208H8.1l-1.215 2.23q-.154.231-.01.5t.433.27h10.884v1H7.308q-.875 0-1.306-.738t-.021-1.482l1.504-2.68L3.808 3.5H2v-1h2.442zm3.158 6.616h7z"
    />
  ),
  Recharge: <Path d="M13 2L5 13H10.5L9 22L19 10H13.5Z" />,
  Travels: (
    <>
      <Path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <Circle cx="7" cy="17" r="2" />
      <Path d="M9 17h6" />
      <Circle cx="17" cy="17" r="2" />
    </>
  ),
  Rent: (
    <>
      <Path d="M3 11 12 4l9 7" />
      <Path d="M5 9.5V20h14V9.5" />
      <Path d="M10 20v-6h4v6" />
    </>
  ),
  Bill: (
    <>
      <Path d="M6 3h12v18l-2-1.3-2 1.3-2-1.3-2 1.3L8 19.7 6 21z" />
      <Path d="M9 7.5h6M9 11h6M9 14.5h4" />
    </>
  ),
  Others: (
    <>
      <Path
        fill="none"
        d="M12.5 4C12.5 2 14 .5 16 .5m-4 6.08l-.31-.196c-1.441-.912-3.266-1.258-4.717-.36C6.243 6.473 5.079 7.375 4.5 8v.293c2.08 1.073 4 3.226 4 5.707s-1.92 4.634-4 5.706V20c.58.624 1.743 1.525 2.473 1.977c1.45.897 3.276.551 4.717-.36l.31-.197l.31.196c1.441.912 3.266 1.258 4.717.36c.73-.45 1.894-1.352 2.473-1.976v-.294c-2.08-1.072-4-3.225-4-5.706s1.92-4.634 4-5.706V8c-.58-.624-1.743-1.525-2.473-1.977c-1.45-.897-3.276-.551-4.717.36z"
      />
    </>
  ),
  Salary: (
    <>
      <Path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <Path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 18V6" />
    </>
  ),
  Gift: (
    <>
      <Path
        fillRule="evenodd"
        d="M5 8H19A1 1 0 0 1 20 9V11H4V9A1 1 0 0 1 5 8Z M10.5 8H13.5V11H10.5Z"
      />
      <Path
        fillRule="evenodd"
        d="M5 12H19V20A1 1 0 0 1 18 21H6A1 1 0 0 1 5 20Z M10.5 12H13.5V21H10.5Z"
      />
      <Circle cx="10" cy="6.3" r="1.6" />
      <Circle cx="14" cy="6.3" r="1.6" />
    </>
  ),
  Business: (
    <>
      <Path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <Path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
      <Path d="m21 3 1 11h-2" />
      <Path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
      <Path d="M3 4h8" />
    </>
  ),
};

type Props = { type: CategoryName; color?: string; size?: number };

const CategoryIcon = ({ type, color = "#8A9B96", size = 22 }: Props) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <G
      fill="none"
      stroke={color}
      strokeWidth={type === "Shopping" ? 1 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {SHAPES[type] ?? SHAPES.Others}
    </G>
  </Svg>
);

export default CategoryIcon;
