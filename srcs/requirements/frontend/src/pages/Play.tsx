import { Text, AuthForm } from "../components";
import { PageWithSidebar, Sidebar } from "../layout";

export default function Play() {
  return (
    <PageWithSidebar
      sidebar={
        <Sidebar>
          <Text>The sidebar</Text>
        </Sidebar>
      }
    >
        <AuthForm mode="register" />
      <Text>Hello World!</Text>
    </PageWithSidebar>
  );
}

