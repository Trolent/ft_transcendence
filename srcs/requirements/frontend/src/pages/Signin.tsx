import { AuthForm } from "../components";
import { PageLayout } from "../layout";

export default function Signin() {
  return (
    <PageLayout>
      <AuthForm mode="login" />
    </PageLayout>
  );
}

