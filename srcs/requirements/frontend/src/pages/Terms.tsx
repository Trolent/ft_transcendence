import { Heading, Text } from "../components";
import { PageLayout } from "../layout";

export default function Terms() {
  return (
    <PageLayout>
      <Heading level={2}>Terms</Heading>
      <Text variant="dim">Merci d'utiliser Typerun. Veuillez lire attentivement cet accord de conditions d'utilisation.</Text>
      <br />
      <Text variant="dim">Votre compte doit être crée par une personne. Vous devez avoir minimum 13 ans et devez fournir une adresse email valide. Vous êtes le seul responsable de votre compte et des messages que vous envoyez aux autres utilisateurs et à l'administration.</Text>
      <Text variant="dim">Par conséquent si un message est signalé par un autre utilisateur, nous serons en droit de vous exclure de la plateforme si nous estimons le signalement légitime.</Text>
    </PageLayout>
  );
}
