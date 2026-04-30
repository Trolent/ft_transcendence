import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/useAuth";

const NAV_LINKS = [
  { label: "Play", href: "/play" },
  { label: "Leaderboard", href: "/leaderboard" },
];

function isActive(href: string, pathname: string) {
  if (href === "/play") return pathname === "/" || pathname === "/play";
  return pathname === href;
}

// == NAVLINK ==

function NavLink({ href, label, pathname }: { href: string; label: string; pathname: string }) {
  const active = isActive(href, pathname);
  return (
    <Link
      to={href}
      className={[
        "px-3 py-1 text-xs uppercase tracking-widest transition-colors duration-100",
        active ? "text-black bg-default" : "text-dim hover:text-default hover:bg-muted",
      ].join(" ")}>
      {active && <span className="mr-1">[*]</span>}
      {label}
    </Link>
  );
}

// == USERMENU ==

function UserMenu({ username, onLogout }: { username: string; onLogout: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const itemClass = "block w-full text-left px-4 py-2 text-xs uppercase tracking-widest text-dim hover:text-default hover:bg-muted transition-colors duration-100";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 px-3 py-1 text-xs uppercase tracking-widest text-dim hover:text-default hover:bg-muted transition-colors duration-100"
        >
        {username} <span>{isOpen ? "[-]" : "[+]"}</span>
      </button>

      {isOpen && (
        <ul className="absolute right-0 top-full mt-1 min-w-[10rem] bg-black border border-muted z-50">
          <li><Link to="/profile" onClick={() => setIsOpen(false)} className={itemClass}>Profile</Link></li>
          <li><Link to="/settings" onClick={() => setIsOpen(false)} className={itemClass}>Settings</Link></li>
          <li><button type="button" onClick={() => { onLogout(); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-xs uppercase tracking-widest text-danger hover:text-black hover:bg-danger transition-colors duration-100">Logout</button></li>
        </ul>
      )}
    </div>
  );
}

// == MOBILEMENU ==

function MobileMenu({ pathname, user, onLogout }: {
  pathname: string;
  user: { username: string } | null;
  onLogout: () => void;
}) {
  const linkClass =
    "block w-full px-3 py-2 text-xs uppercase tracking-widest transition-colors duration-100";

  return (
    <ul className="sm:hidden border-t border-muted px-4 pb-3 flex flex-col gap-1">
      {NAV_LINKS.map(({ href, label }) => {
        const active = isActive(href, pathname);
        return (
          <li key={label}>
            <Link
              to={href}
              className={[linkClass, active ? "text-black bg-default" : "text-dim hover:text-default hover:bg-muted"].join(" ")}>
              {active && <span className="mr-1">[*]</span>}
              {label}
            </Link>
          </li>
        );
      })}

      <li className="border-t border-muted pt-1 mt-1">
        {user ? (
          <>
            <Link to="/profile" className={`${linkClass} text-dim hover:text-default hover:bg-muted`}>Profile</Link>
            <Link to="/settings" className={`${linkClass} text-dim hover:text-default hover:bg-muted`}>Settings</Link>
            <button type="button" onClick={onLogout} className={`text-left ${linkClass} text-danger hover:text-black hover:bg-danger`}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/signin" className={`${linkClass} text-dim hover:text-default hover:bg-muted`}>Sign In</Link>
        )}
      </li>
    </ul>
  );
}

// == NAVBAR ==

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <nav className="w-full bg-black font-mono">
      <div className="flex items-center justify-between px-4 h-12">
        <Link to="/" className="text-default font-bold uppercase tracking-[0.3em] text-sm select-none">🚗 Typerun</Link>

        <button
          type="button"
          className="sm:hidden px-2 py-1 text-xs uppercase tracking-widest text-dim border border-dim hover:text-default hover:border-default transition-colors duration-100"
          onClick={() => setMenuOpen(!menuOpen)}>
          Menu {menuOpen ? "[-]" : "[+]"}
        </button>

        <ul className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={label}>
              <NavLink href={href} label={label} pathname={pathname} />
            </li>
          ))}
        </ul>

        <div className="hidden sm:flex items-center">
          {user ? (
            <UserMenu username={user.username} onLogout={logout} />
          ) : (
            <Link to="/signin"
              className="px-3 py-1 text-xs uppercase tracking-widest text-dim hover:text-default hover:bg-muted transition-colors duration-100">
              Sign In
            </Link>
          )}
        </div>

      </div>

      {menuOpen && <MobileMenu pathname={pathname} user={user} onLogout={logout} />}
    </nav>
  );
}
