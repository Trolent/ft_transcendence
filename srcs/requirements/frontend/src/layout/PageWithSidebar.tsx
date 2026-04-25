import type { ReactNode } from "react";

interface PageWithSidebarProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export default function PageWithSidebar({ children, sidebar }: PageWithSidebarProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6 order-first lg:order-last">
        {sidebar}
      </aside>
      <div className="flex-1 flex flex-col gap-6 order-last lg:order-first">
        {children}
      </div>
    </div>
  );
}
