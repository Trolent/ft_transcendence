import type { ReactNode } from "react";
import {Container} from "../components";

interface SidebarProps {
  children: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  return (
    <Container variant="panel" className="h-full">
      {children}
    </Container>
  );
}
