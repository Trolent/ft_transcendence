import { Heading, Text } from "../components";
import { PageLayout } from "../layout";

export default function Privacy() {
  return (
    <PageLayout>
      <Heading level={2}>Privacy</Heading>
      <Text variant="dim"><u>Vos données:</u> Lorsque vous créez un compte, les données collectées sont les suivants : nom d'utilisateur, adresse e-mail et mot de passe.</Text>
      <Text variant="dim"><u>Utilisation des données:</u> Nous nous engageons à garder une totale transparence quand aux données recueillies.</Text>
    </PageLayout>
  );
}
