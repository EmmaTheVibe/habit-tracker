"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "./SplashScreen";
import { getSession } from "@/lib/storage";

export default function SplashClient() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(getSession() ? "/dashboard" : "/login");
    }, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
