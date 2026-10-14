"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
            router.push("/auth/sign-in");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
        >
            <LogOut className="h-4 w-4" />
            Logout
        </Button>
    );
}