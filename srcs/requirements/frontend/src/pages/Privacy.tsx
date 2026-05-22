import { Heading, Text } from "../components";
import { PageLayout } from "../layout";

export default function Privacy() {
  return (
    <PageLayout>
      <Heading level={2}>Privacy</Heading>
      <Text><u>Vos données:</u> Lorsque vous créez un compte, les données collectées sont les suivants : nom d'utilisateur, adresse e-mail et mot de passe (masqué). Les autres données recueillies par la suite sont : les statistiques du jeu, l'historique des parties, les adresses IP, le navigateur utilisé, les logs, la liste d'amis et les demandes d'amis envoyees/recues. Si vous supprimez votre compte, toutes vos données disparaissent.</Text>
      <Text><u>Utilisation de vos données:</u> L'ensemble des données collectées nous permettent d'établir le leaderboard en temps réel, de sécuriser vos connexions, et de gérer le système d'amis. Nous nous engageons à garder une totale transparence quand aux données recueillies.</Text>
      <Text><u>Partage avec des tiers:</u> Nous ne vendons vos données en aucun cas.</Text>
    </PageLayout>
  );
}
