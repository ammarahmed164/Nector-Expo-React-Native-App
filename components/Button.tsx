import { Pressable, Text, ActivityIndicator, PressableProps } from "react-native";

type Props = PressableProps & {
  title: string;
  variant?: "primary" | "outline" | "dark";
  loading?: boolean;
};

export default function Button({ title, variant = "primary", loading, disabled, ...rest }: Props) {
  const base = "h-14 rounded-full items-center justify-center px-6";
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
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#181725" : "#fff"} />
      ) : (
        <Text className={`text-base font-semibold ${textStyles}`}>{title}</Text>
      )}
    </Pressable>
  );
}
