import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components";
import { PageLayout } from "../layout";
import { useAuth } from "../auth";

export default function Signin() {
  const { login } = useAuth();
  const navigate = useNavigate();
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
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout maxWidth="max-w-sm">
      <AuthForm mode="login" error={error} loading={loading} onSubmit={handleSubmit} />
    </PageLayout>
  );
}

