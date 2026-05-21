import { SideLeft } from "@/src/components/SideLeft";
import { SideRight } from "@/src/components/SideRight";
import Link from "next/link";

type DashboardLayoutProps = {
  children: React.ReactNode;
};
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <main className="max-w-7xl mx-auto w-full px-4 flex gap-2 py-2 min-h-screen">
      <SideLeft />
      <div className="flex-1 p-2 bg-green-200/30 rounded-2xl">{children}</div>
      <SideRight />
    </main>
  );
}
