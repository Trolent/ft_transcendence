import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getToken } from "@/features/auth/AuthContext";
import type { Lang } from "@/features/i18n";
import { SUPPORTED } from "@/features/i18n";

const FLAG: Record<Lang, string> = {
  en: "🇬🇧",
  fr: "🇫🇷",
  es: "🇪🇸",
};

const LABEL: Record<Lang, string> = {
  en: "EN",
  fr: "FR",
  es: "ES",
};

async function patchLanguage(lang: Lang) {
  const token = getToken();
  if (!token)
    return;
  await fetch("/api/users/me/settings", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ language: lang.toUpperCase() }),
  });
}

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  let current = "en" as Lang;
  if(SUPPORTED.includes(i18n.language as Lang)){
    current = i18n.language as Lang;
  }
  useEffect(() => {
    if (!isOpen)
      return;
    function handleClickOutside(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node))
        setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  async function handleSelect(lang: Lang) {
    setIsOpen(false);
    if (lang === current)
      return;
    await i18n.changeLanguage(lang);
    await patchLanguage(lang);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 px-3 py-1 text-xs uppercase tracking-widest text-dim hover:text-default hover:bg-muted transition-colors duration-100"
      >
        {FLAG[current]} {LABEL[current]} <span>{isOpen ? "[-]" : "[+]"}</span>
      </button>

      {isOpen && (
        <ul className="absolute right-0 top-full mt-1 min-w-[6rem] bg-black border border-muted z-50">
          {SUPPORTED.map((lang) => (
            <li key={lang}>
              <button
                type="button"
                onClick={() => handleSelect(lang)}
                className={[
                  "w-full text-left px-4 py-2 text-xs uppercase tracking-widest transition-colors duration-100",
                  lang === current
                    ? "text-default bg-muted cursor-default"
                    : "text-dim hover:text-default hover:bg-muted",
                ].join(" ")}
              >
                {FLAG[lang]} {LABEL[lang]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
