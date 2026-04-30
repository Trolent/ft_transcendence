import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export default function Navbar({ items }: { items: NavItem[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="w-full bg-black font-mono">
      <div className="flex items-center justify-between px-4 h-12">

        <span className="text-default font-bold uppercase tracking-[0.3em] text-sm select-none">
          <a href="/">🚗 TRANSCENDENCE</a>
        </span>

        <button
          type="button"
          className="sm:hidden px-2 py-1 text-xs uppercase tracking-widest text-dim border border-dim hover:text-default hover:border-default transition-colors duration-100"
          aria-expanded={isMenuOpen}
          aria-label="Open menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}>
          {isMenuOpen ? "Close" : "Menu"}
        </button>

        <ul className="hidden sm:flex items-center gap-1">
          {items?.map((item) => (
            <li key={item.label}>
              <Link
                to={item.href}
                className={[
                  "px-3 py-1 text-xs uppercase tracking-widest transition-colors duration-100 cursor-pointer",
                  item.active ? "text-black bg-default" : "text-dim hover:text-default hover:bg-muted",
                ].join(" ")}>
                {item.active && <span className="mr-1">[*]</span>}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {isMenuOpen && (
        <ul className="sm:hidden px-4 pb-3 flex flex-col gap-1 border-t border-muted">
          {items.map((item) => (
            <li key={item.label}>
              <Link
                to={item.href}
                className={[
                  "block w-full px-3 py-2 text-xs uppercase tracking-widest transition-colors duration-100 cursor-pointer",
                  item.active ? "text-black bg-default" : "text-dim hover:text-default hover:bg-muted",
                ].join(" ")}>
                {item.active && <span className="mr-1">[*]</span>}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
