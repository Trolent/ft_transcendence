import { Link } from "react-router-dom";

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export default function Navbar({ items }: { items: NavItem[] }) {

  return (
    <nav className="w-full bg-black font-mono">
      <div className="flex items-center justify-between px-4 h-12">

        <span className="text-default font-bold uppercase tracking-[0.3em] text-sm select-none">
          <a href="/">🚗 TRANSCENDENCE</a>
        </span>

        <ul className="hidden sm:flex items-center gap-1">
          {items.map((item) => (
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
    </nav>
  );
}
