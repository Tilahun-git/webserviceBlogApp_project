
'use-client'
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "@/components/AdminDash/DashSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
//   const cookieStore = cookies();
// const token = (await cookieStore).get("authToken")?.value;
// const role = (await cookieStore).get("userRole")?.value;
//   const isAdmin = role && role.toLowerCase() === "admin";

  // if (!token || !isAdmin) {
  //   redirect("/auth/sign-in");
  // }
  return <AdminShell>{children}</AdminShell>;
}