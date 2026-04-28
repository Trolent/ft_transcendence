import { Link } from "react-router-dom";
import { Text } from "../components";

export default function Footer() {
  return (
    <footer className="mt-auto px-6 py-3 flex items-center justify-between gap-4">
      <Text variant="dim" size="xs" as="span">Copyright 2026 Project transcendence for 42
      </Text>
      <div className="flex items-center gap-4">
        <Link to="/privacy" className="text-xs text-dim hover:text-default transition-colors duration-100 uppercase tracking-widest">
          privacy
        </Link>
        <span className="text-muted text-xs">·</span>
        <Link to="/terms" className="text-xs text-dim hover:text-default transition-colors duration-100 uppercase tracking-widest">
          terms
        </Link>
      </div>
    </footer>
  );
}
