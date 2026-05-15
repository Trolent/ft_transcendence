import { useState } from "react";
import { Link } from "react-router-dom";
import { Input, Btn, Label, Alert, Heading, Text } from ".";

interface AuthFormProps {
  mode?: "login" | "register";
  error?: string;
  loading?: boolean;
  onSubmit?: (data: { username?: string; identifier?: string; email?: string; password: string }) => void;
}

export function AuthForm({ mode = "login", error, loading = false, onSubmit }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const displayError = localError || error;

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = (e) => {
    e.preventDefault();
    setLocalError("");

    if (mode === "register" && !username.trim()) {
      setLocalError("Username is required");
      return;
    }

    if (mode === "register" && username.includes("@")) {
      setLocalError("Username cannot contain @");
      return;
    }

    if (mode === "login" && !identifier.trim()) {
      setLocalError("Email or username is required");
      return;
    }

    if (mode === "register" && (!email || !password)) {
      setLocalError("All fields are required");
      return;
    }

    if (mode === "register" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError("Invalid email");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }

    onSubmit?.(
      mode === "login"
        ? { identifier, password }
        : { username, email, password },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Heading level={2}>{mode === "login" ? "Sign In" : "Create Account"}</Heading>

      {displayError && <Alert variant="error">{displayError}</Alert>}

      {mode === "register" && (
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="your_username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2"
          />
        </div>
      )}

      <div>
        <Label htmlFor={mode === "login" ? "identifier" : "email"}>
          {mode === "login" ? "Email or username" : "Email"}
        </Label>
        <Input
          id={mode === "login" ? "identifier" : "email"}
          type={mode === "login" ? "text" : "email"}
          placeholder={mode === "login" ? "you@example.com or your_username" : "you@example.com"}
          value={mode === "login" ? identifier : email}
          onChange={(e) =>
            mode === "login" ? setIdentifier(e.target.value) : setEmail(e.target.value)
          }
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="*******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2"
        />
      </div>

      <Btn type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
      </Btn>

      <Text variant="dim" className="text-center text-sm">
        {mode === "login" ? (
          <>No account?{" "}<Link to="/register" className="text-terminal-cyan hover:underline">Register</Link></>
        ) : (
          <>Already have an account?{" "}<Link to="/signin" className="text-terminal-cyan hover:underline">Sign In</Link></>
        )}
      </Text>
    </form>
  );
}
