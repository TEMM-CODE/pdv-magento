import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { LayoutRole } from "@/types";
import Navigation from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
  role: LayoutRole;
}

export function Layout({ children, role }: LayoutProps) {
  return (
    <div className="min-h-screen bg-layout">
      <Sidebar role={role} />
      <Header />
      <main className="pt-6 pb-20 lg:pb-0 lg:pt-16 lg:pl-64">
        <div className="container pt-16">{children}</div>
      </main>
      <Navigation />
    </div>
  );
}
