"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/mock-logout", { method: "POST" });
    } finally {
      router.push("/auth/sign-in");
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      Logout
    </Button>
  );
}