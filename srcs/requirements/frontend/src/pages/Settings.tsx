import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Heading, Btn, Container, PageLayout, Input, Alert, LanguageSwitcher } from "@/components";
import { updateSettings, type UpdateSettingsPayload } from "@/api/users.api";
// import { tError, SUPPORTED, LANG_DB_MAP, type Lang } from "@/features/i18n";
import { tError } from "@/features/i18n";

//const FLAG: Record<Lang, string> = { en: "🇬🇧", fr: "🇫🇷", es: "🇪🇸" };
//const LABEL: Record<Lang, string> = { en: "English", fr: "Français", es: "Español" };

type FieldErrors = {
  email?: string;
  currentPassword?: string;
  password?: string;
  confirm?: string;
};

export default function Settings() {
  //const { t, i18n } = useTranslation("pages");
  const { t } = useTranslation("pages");
  //const currentLang = (SUPPORTED.includes(i18n.language as Lang) ? i18n.language : "en") as Lang;

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  //const [language, setLanguage] = useState<Lang>(currentLang);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function clearFeedback() {
    setErrors({});
    setGlobalError(null);
    setSuccess(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    clearFeedback();

    const next: FieldErrors = {};

    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        next.email = t("settings.error_email_invalid");
    }

    if (password) {
      if (!currentPassword)
        next.currentPassword = t("settings.error_current_password_required");
      if (password.length < 8)
        next.password = t("settings.error_password_too_short");
      if (password !== confirm)
        next.confirm = t("settings.error_passwords_mismatch");
    }

    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    const payload: UpdateSettingsPayload = {};
    if (email) payload.email = email;
    if (password) { payload.currentPassword = currentPassword; payload.password = password; }
    //if (language !== currentLang) payload.language = LANG_DB_MAP[language];

    if (!Object.keys(payload).length) return;

    setLoading(true);
    try {
      await updateSettings(payload);
      //if (payload.language) await i18n.changeLanguage(language);
      setSuccess(true);
      setEmail("");
      setCurrentPassword("");
      setPassword("");
      setConfirm("");
    } catch (err) {
      setGlobalError(tError(err instanceof Error ? err.message : "", t));
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout maxWidth="max-w-lg">
      <Heading level={3} className="mt-10 sm:mt-0 sm:text-2xl sm:tracking-[0.2em]">
        {t("settings.title")}
      </Heading>

      <form onSubmit={handleSave} className="flex flex-col gap-6 mt-3">
        <Container variant="panel" label={t("settings.change_email")} className="flex flex-col gap-3 mt-1">
          <Input
            type="email"
            label={t("settings.email_label")}
            placeholder={t("settings.email_placeholder")}
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearFeedback(); }}
            error={errors.email}
            disabled={loading}
            autoComplete="email"
          />
        </Container>

        <Container variant="panel" label={t("settings.change_password")} className="flex flex-col gap-3 mt-1">
          <Input
            type="password"
            label={t("settings.current_password_label")}
            placeholder={t("settings.current_password_placeholder")}
            value={currentPassword}
            onChange={(e) => { setCurrentPassword(e.target.value); clearFeedback(); }}
            error={errors.currentPassword}
            disabled={loading}
            autoComplete="current-password"
          />
          <Input
            type="password"
            label={t("settings.new_password_label")}
            placeholder={t("settings.new_password_placeholder")}
            value={password}
            onChange={(e) => { setPassword(e.target.value); clearFeedback(); }}
            error={errors.password}
            disabled={loading}
            autoComplete="new-password"
          />
          <Input
            type="password"
            label={t("settings.confirm_password_label")}
            placeholder={t("settings.confirm_password_placeholder")}
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); clearFeedback(); }}
            error={errors.confirm}
            disabled={loading}
            autoComplete="new-password"
          />
        </Container>

        <Container variant="panel" label={t("settings.change_language")} className="flex gap-3 mt-1">
            <LanguageSwitcher />
        </Container>

        {globalError && <Alert variant="error">{globalError}</Alert>}
        {success && <Alert variant="success">{t("settings.saved")}</Alert>}

        <div className="flex justify-end">
          <Btn type="submit" size="md" variant="primary" disabled={loading}>
            {loading ? t("common:please_wait") : t("common:save")}
          </Btn>
        </div>
      </form>
    </PageLayout>
  );
}
