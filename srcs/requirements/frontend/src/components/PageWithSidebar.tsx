import type { ReactNode } from "react";

interface PageWithSidebarProps {
  children: ReactNode;
  sidebar: ReactNode;
  maxWidth?: string;
  fillHeight?: boolean;
}

export default function PageWithSidebar({ children, sidebar, maxWidth, fillHeight }: PageWithSidebarProps) {
  return (
    <div className={`flex flex-col sm:flex-row gap-6 p-6 ${fillHeight ? "flex-1 min-h-0" : ""}`}>
      <aside className={`w-full sm:w-72 shrink-0 order-2 sm:order-last ${fillHeight ? "overflow-y-auto max-h-[45dvh] sm:max-h-[80dvh] pr-1 pb-2" : ""}`}>
        {sidebar}
      </aside>
      <div className={`flex-1 order-1 sm:order-first min-w-0 ${fillHeight ? "min-h-0 flex flex-col" : ""}`}>
        <div className={`w-full mx-auto ${fillHeight ? "h-full flex flex-col" : ""} ${maxWidth ?? ""}`.trim()}>
          {children}
        </div>
      </div>
    </div>
  );
}
