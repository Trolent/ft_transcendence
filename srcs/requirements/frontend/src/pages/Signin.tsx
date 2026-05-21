import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { tError } from "../i18n";
import { AuthForm } from "../components";
import { PageLayout } from "../layout";
import { useAuth } from "../auth";

export default function Signin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation('auth');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit({ identifier, password }: { identifier?: string; password: string }) {
    if (!identifier) return;
    setError("");
    setLoading(true);
    try {
      await login(identifier, password);
      navigate("/profile");
    } catch (e) {
      setError(e instanceof Error ? tError(e.message, t) : t('errors.login_failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout maxWidth="max-w-sm" centerY>
      <AuthForm mode="login" error={error} loading={loading} onSubmit={handleSubmit} />
    </PageLayout>
  );
}

