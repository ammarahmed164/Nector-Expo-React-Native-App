import { Pressable, Text, ActivityIndicator, PressableProps, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

type Props = PressableProps & {
  title: string;
  variant?: "primary" | "outline" | "dark";
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
};

export default function Button({ title, variant = "primary", loading, disabled, icon, ...rest }: Props) {
  const base = "h-14 rounded-2xl items-center justify-center px-6 flex-row";
  const styles = {
    primary: "bg-primary",
    outline: "bg-transparent border border-line",
    dark: "bg-dark",
  }[variant];
  const textStyles = {
    primary: "text-white",
    outline: "text-dark",
    dark: "text-white",
  }[variant];

  return (
    <Pressable
      disabled={disabled || loading}
      className={`${base} ${styles} ${disabled ? "opacity-50" : ""}`}
      style={({ pressed }) => [
        variant === "primary" && !disabled ? buttonStyles.primaryShadow : undefined,
        pressed && !disabled ? buttonStyles.pressed : undefined,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#181725" : "#fff"} />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={19}
              color={variant === "outline" ? Colors.dark : Colors.white}
              style={{ marginRight: 9 }}
            />
          )}
          <Text className={`text-base font-semibold ${textStyles}`}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const buttonStyles = StyleSheet.create({
  primaryShadow: {
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
});
