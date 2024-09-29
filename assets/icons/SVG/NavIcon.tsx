import Svg, { SvgProps, Path } from "react-native-svg";

interface SVGProps {
  color?: string;
  isFocused: boolean;
}

export const MenuIcon = ({ color, isFocused, ...props }: SvgProps & SVGProps) => (
  <Svg fill="none" color={color || "#fff"} {...props} width={23} height={24}>
    <Path
      stroke={"currentColor"}
      strokeWidth={1.5}
      fill={isFocused ? color : "none"}
      d="M2 18c0-1.54 0-2.31.347-2.877.194-.316.46-.582.777-.776C3.689 14 4.46 14 6 14c1.54 0 2.31 0 2.876.347.317.194.583.46.777.777C10 15.688 10 16.46 10 18c0 1.54 0 2.31-.347 2.877-.194.316-.46.582-.777.776C8.311 22 7.54 22 6 22c-1.54 0-2.31 0-2.876-.347a2.353 2.353 0 0 1-.777-.776C2 20.31 2 19.54 2 18ZM14 18c0-1.54 0-2.31.347-2.877.194-.316.46-.582.777-.776C15.688 14 16.46 14 18 14c1.54 0 2.31 0 2.877.347.316.194.582.46.776.777C22 15.688 22 16.46 22 18c0 1.54 0 2.31-.347 2.877-.194.316-.46.582-.776.776C20.31 22 19.54 22 18 22c-1.54 0-2.31 0-2.877-.347a2.353 2.353 0 0 1-.776-.776C14 20.31 14 19.54 14 18ZM2 6c0-1.54 0-2.31.347-2.876.194-.317.46-.583.777-.777C3.689 2 4.46 2 6 2c1.54 0 2.31 0 2.876.347.317.194.583.46.777.777C10 3.689 10 4.46 10 6c0 1.54 0 2.31-.347 2.876-.194.317-.46.583-.777.777C8.311 10 7.54 10 6 10c-1.54 0-2.31 0-2.876-.347a2.353 2.353 0 0 1-.777-.777C2 8.311 2 7.54 2 6ZM14 6c0-1.54 0-2.31.347-2.876.194-.317.46-.583.777-.777C15.688 2 16.46 2 18 2c1.54 0 2.31 0 2.877.347.316.194.582.46.776.777C22 3.689 22 4.46 22 6c0 1.54 0 2.31-.347 2.876-.194.317-.46.583-.776.777C20.31 10 19.54 10 18 10c-1.54 0-2.31 0-2.877-.347a2.353 2.353 0 0 1-.776-.777C14 8.311 14 7.54 14 6Z"
    />
  </Svg>
);

export const UserIcon = ({ color, isFocused, ...props }: SvgProps & SVGProps) => (
  <Svg fill="none" color={color || "#fff"} {...props} width={23} height={24}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={isFocused ? color : "none"}
      strokeWidth={1.5}
      d="M6.578 15.482c-1.415.842-5.125 2.562-2.865 4.715C4.816 21.248 6.045 22 7.59 22h8.818c1.546 0 2.775-.752 3.878-1.803 2.26-2.153-1.45-3.873-2.865-4.715a10.663 10.663 0 0 0-10.844 0Z"
    />
    <Path
      stroke="currentColor"
      strokeWidth={1.5}
      fill={isFocused ? color : "none"}
      d="M16.5 6.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
    />
  </Svg>
);

export const MoneyScreenIcon = ({ color, isFocused, ...props }: SvgProps & SVGProps) => (
  <Svg fill="none" color={color || "#fff"} {...props} width={22} height={24}>
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="m14.5 22-.316-.419c-.71-.944-.887-2.387-.437-3.581M9.5 22l.316-.419c.71-.944.887-2.387.437-3.581M7 22h10"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      fill={isFocused ? color : "none"}
      strokeWidth={1.5}
      d="M14 2h-4c-3.28 0-4.919 0-6.081.814a4.5 4.5 0 0 0-1.105 1.105C2 5.08 2 6.72 2 10c0 3.28 0 4.919.814 6.081a4.5 4.5 0 0 0 1.105 1.105C5.08 18 6.72 18 10 18h4c3.28 0 4.919 0 6.081-.814a4.5 4.5 0 0 0 1.105-1.105C22 14.92 22 13.28 22 10c0-3.28 0-4.919-.814-6.081a4.5 4.5 0 0 0-1.105-1.105C18.92 2 17.28 2 14 2Z"
    />
    <Path
      stroke={isFocused ? "#030f0e" : "currentColor"}
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M12 7c-1.105 0-2 .672-2 1.5s.895 1.5 2 1.5 2 .672 2 1.5-.895 1.5-2 1.5m0-6c.87 0 1.612.417 1.886 1M12 7V6m0 7c-.87 0-1.612-.417-1.886-1M12 13v1"
    />
  </Svg>
);

export const CameraIcon = ({ color, isFocused, ...props }: SvgProps & SVGProps) => (
  <Svg viewBox="0 0 24 24" {...props} color={color || "#fff"} width={23} height={24}>
    {isFocused ? (
      <Path
        fill="currentColor"
        d="M8 3a1 1 0 0 1 .117 1.993L8 5H6a1 1 0 0 0-.993.883L5 6v2a1 1 0 0 1-1.993.117L3 8V6a3 3 0 0 1 2.824-2.995L6 3zM4 15a1 1 0 0 1 .993.883L5 16v2a1 1 0 0 0 .883.993L6 19h2a1 1 0 0 1 .117 1.993L8 21H6a3 3 0 0 1-2.995-2.824L3 18v-2a1 1 0 0 1 1-1M18 3a3 3 0 0 1 2.995 2.824L21 6v2a1 1 0 0 1-1.993.117L19 8V6a1 1 0 0 0-.883-.993L18 5h-2a1 1 0 0 1-.117-1.993L16 3zm2 12a1 1 0 0 1 .993.883L21 16v2a3 3 0 0 1-2.824 2.995L18 21h-2a1 1 0 0 1-.117-1.993L16 19h2a1 1 0 0 0 .993-.883L19 18v-2a1 1 0 0 1 1-1m-8-7a4 4 0 1 1-3.995 4.2L8 12l.005-.2A4 4 0 0 1 12 8"
      />
    ) : (
      <Path
        fill="none"
        stroke="currentColor"
        d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2m8-16h2a2 2 0 0 1 2 2v2m-4 12h2a2 2 0 0 0 2-2v-2M9 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0"
      />
    )}
  </Svg>
);

export const WalletIcon = ({ color, isFocused, ...props }: SvgProps & SVGProps) => (
  <Svg fill="none" color={color || "#fff"} {...props} width={23} height={24}>
    <Path
      stroke="currentColor"
      fill={isFocused ? color : "none"}
      strokeWidth={1.5}
      d="M15 15a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      //
      strokeWidth={1.5}
      d="M3 12V6c2.105.621 6.576 1.427 12.004 1.803 2.921.202 4.382.303 5.189 1.174.807.87.807 2.273.807 5.078v2.013c0 2.889 0 4.333-.984 5.232-.983.899-2.324.768-5.005.506a61.504 61.504 0 0 1-2.011-.23"
    />
    <Path
      stroke="currentColor"
      strokeLinejoin="round"
      fill={isFocused ? color : "none"}
      strokeWidth={1.5}
      d="M17.626 8c.377-1.423.72-4.012-.299-5.297-.645-.815-1.605-.736-2.545-.654-4.944.435-8.437 1.318-10.389 1.918C3.553 4.225 3 5.045 3 5.96"
    />
    <Path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M11 18H7m0 0H3m4 0v4m0-4v-4"
    />
  </Svg>
);
