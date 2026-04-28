import type { ReactNode } from "react";

/*
to limit width:
<PageLayout maxWidth="max-w-sm">
*/

interface PageLayoutProps {
  children: ReactNode;
  maxWidth?: string;
}

export default function PageLayout({ children, maxWidth }: PageLayoutProps) {
  return (
    <div className="flex flex-col gap-6 p-6">
      {maxWidth ? (
        <div className={`mx-auto w-full ${maxWidth}`}>
          {children}
        </div>
      ) : children}
    </div>
  );
}
