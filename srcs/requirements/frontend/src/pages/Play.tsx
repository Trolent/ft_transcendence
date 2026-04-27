import { Link } from "react-router-dom";

import { Text, Btn } from "../components";
import { PageWithSidebar, Sidebar } from "../layout";

export default function Play() {
  return (
    <PageWithSidebar
      sidebar={
        <Sidebar>
          <Text>Sidebar</Text>
        </Sidebar>
      }>
      <Link to="/demo"><Btn>Check Demo</Btn></Link>
    </PageWithSidebar>
  );
}

