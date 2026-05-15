import { Link } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

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

        <Menu as="div" className="relative inline-block">
          <MenuButton className="inline-flex items-center gap-1 px-3 py-1 text-xs uppercase tracking-widest transition-colors duration-100 cursor-pointer text-dim hover:text-default hover:bg-muted">
            MENU
            <ChevronDownIcon aria-hidden="true" className="size-4" />
          </MenuButton>

          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-50 border text-xs uppercase tracking-widest transition-colors duration-100 cursor-pointer"
          >
            <div className="py-1">
              <MenuItem>
                <a
                  href="/play"
                  className="block px-4 py-2 text-xs uppercase tracking-widest transition-colors duration-100 cursor-pointer text-dim hover:text-default hover:bg-muted"
                >
                  PLAY
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="/leaderboard"
                  className="block px-4 py-2 text-xs uppercase tracking-widest transition-colors duration-100 cursor-pointer text-dim hover:text-default hover:bg-muted"
                >
                  LEADERBOARD
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="/profile"
                  className="block px-4 py-2 text-xs uppercase tracking-widest transition-colors duration-100 cursor-pointer text-dim hover:text-default hover:bg-muted"
                >
                  PROFILE
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="/settings"
                  className="block px-4 py-2 text-xs uppercase tracking-widest transition-colors duration-100 cursor-pointer text-dim hover:text-default hover:bg-muted"
                >
                  SETTINGS
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="/signin"
                  className="block px-4 py-2 text-xs uppercase tracking-widest transition-colors duration-100 cursor-pointer text-dim hover:text-default hover:bg-muted"
                >
                  SIGN IN
                </a>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>
    </nav>
  );
}
