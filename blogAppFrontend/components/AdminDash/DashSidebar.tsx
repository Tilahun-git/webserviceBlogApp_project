"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { signOut } from "@/redux/auth/authSlice"; 
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { User, ArrowRight, FileText, Users, MessageSquare, PieChart } from "lucide-react";

// --- Types ---
interface SidebarItemProps {
  href: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  active: boolean;
}

interface UserType {
  name: string;
  email: string;
  image?: string;
  isAdmin: boolean;
}

// --- Sidebar Link Component ---
function SidebarLink({ href, icon: Icon, label, active }: SidebarItemProps) {
  return (
    <Link href={href} passHref legacyBehavior>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            className={`flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition-colors ${
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </a>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </Link>
  );
}

// --- Main Sidebar Component ---
export default function DashSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => (state.user as { currentUser?: UserType | null })?.currentUser ?? null);

  const tab = searchParams?.get("tab") ?? "";

  const handleSignout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/signout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        console.error(data.message);
      } else {
        dispatch(signOut());
        router.push("/auth/sign-in");
      }
    } catch (error) {
      console.error((error as Error).message || "Something went wrong");
    }
  };

  if (!currentUser) return null;

  return (
    <aside className="w-64 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
      {/* User Info */}
      <div className="flex flex-col items-center py-6 px-4 border-b border-sidebar-border">
        <Avatar>
          {currentUser.image ? (
            <AvatarImage src={currentUser.image} alt={currentUser.name} />
          ) : (
            <AvatarFallback>{currentUser.name?.[0]}</AvatarFallback>
          )}
        </Avatar>
        <p className="mt-2 font-semibold">{currentUser.name}</p>
        <span className="text-sm text-sidebar-accent-foreground">{currentUser.email}</span>
      </div>

      {/* Links */}
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="flex flex-col gap-2">
          {currentUser.isAdmin && (
            <SidebarLink
              href="/dashboard?tab=dash"
              icon={PieChart}
              label="Dashboard"
              active={tab === "dash" || !tab}
            />
          )}

          <SidebarLink
            href="/dashboard?tab=profile"
            icon={User}
            label={currentUser.isAdmin ? "Admin Profile" : "Profile"}
            active={tab === "profile"}
          />

          {currentUser.isAdmin && (
            <>
              <Separator className="my-2 border-sidebar-border" />
              <SidebarLink href="/dashboard?tab=users" icon={Users} label="Users" active={tab === "users"} />
              <SidebarLink href="/dashboard?tab=posts" icon={FileText} label="Posts" active={tab === "posts"} />
              <SidebarLink
                href="/dashboard?tab=comments"
                icon={MessageSquare}
                label="Comments"
                active={tab === "comments"}
              />
            </>
          )}
        </div>
      </ScrollArea>

      {/* Sign Out */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 text-sidebar-primary"
          onClick={handleSignout}
        >
          <ArrowRight className="w-4 h-4" /> Sign Out
        </Button>
      </div>
    </aside>
  );
}
