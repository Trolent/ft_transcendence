import type { ReactNode } from "react";

interface PageWithSidebarProps {
  children: ReactNode;
  sidebar: ReactNode;
  maxWidth?: string;
}

export default function PageWithSidebar({ children, sidebar, maxWidth }: PageWithSidebarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 p-6">
      <aside className="w-full sm:w-64 shrink-0 sm:order-last">
        {sidebar}
      </aside>
      <div className="flex-1 sm:order-first">
        <div className={`w-full mx-auto ${maxWidth ?? ""}`.trim()}>
          {children}
        </div>
      </div>
    </div>
  );
}
