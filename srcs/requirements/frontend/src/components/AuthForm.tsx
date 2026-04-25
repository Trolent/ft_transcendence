import { useState } from "react";
import { Input, Btn, Label, Alert, Heading } from ".";

/*

Examples:

<AuthForm mode="login" onSubmit={onSubmit} error={error} />
<AuthForm mode="register" onSubmit={onSubmit} error={error} />

*/

interface AuthFormProps {
  mode?: "login" | "register";
  error?: string;
  onSubmit?: (data: { email: string; password: string }) => void;
}

export function AuthForm({ mode = "login", error, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const displayError = error ?? localError;

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = (e) => {
    e.preventDefault();
    setLocalError("");

    if (!email || !password) {
      setLocalError("All fields are required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError("Invalid email");
      return;
    }

    onSubmit?.({ email, password });
  };


  return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Heading level={2}>{mode === "login" ? "Sign In" : "Create Account"}</Heading>
        {displayError && <Alert variant="error">{displayError}</Alert>}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2"
          />
        </div>

        <Btn type="submit" variant="primary" className="w-full">
          {mode === "login" ? "Sign In" : "Create Account"}
        </Btn>
      </form>
  );
}
