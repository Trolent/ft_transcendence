import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components";
import { PageLayout } from "../layout";
import { useAuth } from "../auth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit({
    username,
    email,
    password,
  }: {
    username?: string;
    email: string;
    password: string;
  }) {
    if (!username) return;
    setError("");
    setLoading(true);
    try {
      await register(username, email, password);
      navigate("/settings");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout maxWidth="max-w-sm" centerY>
      <AuthForm mode="register" error={error} loading={loading} onSubmit={handleSubmit} />
    </PageLayout>
  );
}
