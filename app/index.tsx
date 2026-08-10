import { useEffect } from "react";
import { useRouter } from "expo-router";
import SplashContent from "@/components/SplashContent";

/** App splash — shows branded screen then navigates to onboarding */
export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace("/onboarding");
    }, 2200);
    return () => clearTimeout(t);
  }, [router]);

  return <SplashContent />;
}
