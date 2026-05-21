import { Link } from "react-router-dom";
import { Heading, Text } from "../components";
import { PageLayout } from "../layout";

export default function Terms() {
  return (
    <PageLayout>
      <Heading level={2}>Terms</Heading>
      <Text variant="dim">Merci d'utiliser Typerun. Veuillez lire attentivement cet accord de conditions d'utilisation.</Text>
      <Text variant="dim"><u>Gestion du compte:</u> Votre compte doit être crée par une personne. Vous devez avoir minimum 13 ans et devez fournir une adresse email valide. Vous êtes le seul responsable de votre compte et des messages que vous envoyez aux autres utilisateurs et à l'administration. Vous avez le droit de supprimer votre compte à tout moment.</Text>
      <Text variant="dim"><u>Règles de conduite:</u> Restez courtois avec les autres joueurs. Le harcèlement et les propos haineux ne sont en aucun cas tolérés. Si un message ou un pseudo est signalé par un autre utilisateur, nous serons en droit de vous exclure de la plateforme si nous estimons le signalement légitime.</Text>
      <Text variant="dim"><u>Triche:</u> Il est interdit d'utiliser des bots, scripts ou tout autre outil automatisant la saisie, sous peine de score invalidé voire bannissement du leaderboard.</Text>
      <Text variant="dim"><u>Propriété intellectuelle:</u> Le jeu, son code, son design et ses contenus appartiennent à Typerun. L'utilisateur ne peut en aucun cas copier, redistribuer ou modifier le jeu.</Text>
      <Text variant="dim"><u>Disponibilité du service:</u> Typerun ne garantit pas d'être disponible h24 7j/7 en raison des possibles maintenances et pannes. Nous ne sommes pas responsables en cas de perte de progression liée à un incident technique.</Text>
      <Text variant="dim"><u>Modification des conditions :</u> En cas de modification de nos conditions, vous en serez informés par mail.</Text>
      <Text variant="dim">Pour en savoir plus sur la confidentialité de vos données, <Link to="/privacy"><u>cliquez ici</u></Link></Text>
      <br />
      <Text variant="dim"><i><br />Dernière mise à jour le 21 mai 2026</i></Text>
    </PageLayout>
  );
}
