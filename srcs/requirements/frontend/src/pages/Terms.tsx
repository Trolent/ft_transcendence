import { Link } from "react-router-dom";
import { Heading, Text, PageLayout } from "@/components";
import { useTranslation } from "react-i18next";

export default function Terms() {
  const { i18n } = useTranslation();
  if (i18n.language === "en") {
    return (
      <div className="mx-auto w-200">
        <PageLayout>
          <Heading level={2}>Terms</Heading>
          <Text>Thank you for using Typerun. Please read this terms of service agreement carefully.</Text>
          <Text><u>Account management:</u> Your account must be created by a person. You must be at least 13 years old and must provide a valid email address. You are solely responsible for your account and the messages you send to other users and to the administration. You have the right to delete your account at any time.</Text>
          <Text><u>Rules of conduct:</u> Be courteous with other players. Harassment and hate speech are not tolerated under any circumstances. If a message or username is reported by another user, we reserve the right to exclude you from the platform if we deem the report legitimate.</Text>
          <Text variant="error"><u>Cheating:</u> The use of bots, scripts or any other tool automating typing is prohibited, under penalty of invalidated score or even banishment from the leaderboard.</Text>
          <Text><u>Intellectual property:</u> The game, its code, its design and its content belong to Typerun. The user may not copy, redistribute or modify the game under any circumstances.</Text>
          <Text><u>Service availability:</u> Typerun does not guarantee 24/7 availability due to possible maintenance and outages. We are not responsible for any loss of progress related to a technical incident.</Text>
          <Text><u>Modification of terms:</u> In case of modification of our terms, you will be informed by email.</Text>
          <Text>To learn more about the privacy of your data, <Link to="/privacy" className="hover:text-glow"><u>click here</u></Link></Text>
          <br />
          <Text variant="dim"><i><br />Last updated on May 21st, 2026</i></Text>
        </PageLayout>
      </div>
    );
  }

  else if (i18n.language === "fr") {
    return (
      <div className="mx-auto w-200">
        <PageLayout>
          <Heading level={2}>Conditions</Heading>
          <Text>Merci d'utiliser Typerun. Veuillez lire attentivement cet accord de conditions d'utilisation.</Text>
          <Text><u>Gestion du compte:</u> Votre compte doit être créé par une personne. Vous devez avoir minimum 13 ans et devez fournir une adresse email valide. Vous êtes le seul responsable de votre compte et des messages que vous envoyez aux autres utilisateurs et à l'administration. Vous avez le droit de supprimer votre compte à tout moment.</Text>
          <Text><u>Règles de conduite:</u> Restez courtois avec les autres joueurs. Le harcèlement et les propos haineux ne sont en aucun cas tolérés. Si un message ou un pseudo est signalé par un autre utilisateur, nous serons en droit de vous exclure de la plateforme si nous estimons le signalement légitime.</Text>
          <Text variant="error"><u>Triche:</u> Il est interdit d'utiliser des bots, scripts ou tout autre outil automatisant la saisie, sous peine de score invalidé voire bannissement du leaderboard.</Text>
          <Text><u>Propriété intellectuelle:</u> Le jeu, son code, son design et ses contenus appartiennent à Typerun. L'utilisateur ne peut en aucun cas copier, redistribuer ou modifier le jeu.</Text>
          <Text><u>Disponibilité du service:</u> Typerun ne garantit pas d'être disponible h24 7j/7 en raison des possibles maintenances et pannes. Nous ne sommes pas responsables en cas de perte de progression liée à un incident technique.</Text>
          <Text><u>Modification des conditions:</u> En cas de modification de nos conditions, vous en serez informés par mail.</Text>
          <Text>Pour en savoir plus sur la confidentialité de vos données, <Link to="/privacy" className="hover:text-glow"><u>cliquez ici</u></Link></Text>
          <br />
          <Text variant="dim"><i><br />Dernière mise à jour le 21 mai 2026</i></Text>
        </PageLayout>
      </div>
    );
  }

  else {
    return (
      <div className="mx-auto w-200">
        <PageLayout>
          <Heading level={2}>Términos</Heading>
          <Text>Gracias por usar Typerun. Por favor, lee atentamente este acuerdo de términos de servicio.</Text>
          <Text><u>Gestión de la cuenta:</u> Tu cuenta debe ser creada por una persona. Debes tener mínimo 13 años y debes proporcionar una dirección de correo electrónico válida. Eres el único responsable de tu cuenta y de los mensajes que envías a otros usuarios y a la administración. Tienes derecho a eliminar tu cuenta en cualquier momento.</Text>
          <Text><u>Reglas de conducta:</u> Sé cortés con los demás jugadores. El acoso y los discursos de odio no se toleran bajo ninguna circunstancia. Si un mensaje o un nombre de usuario es reportado por otro usuario, nos reservamos el derecho a excluirte de la plataforma si consideramos que el reporte es legítimo.</Text>
          <Text variant="error"><u>Trampas:</u> Está prohibido usar bots, scripts o cualquier otra herramienta que automatice la escritura, bajo pena de invalidación de la puntuación o incluso expulsión de la clasificación.</Text>
          <Text><u>Propiedad intelectual:</u> El juego, su código, su diseño y sus contenidos pertenecen a Typerun. El usuario no puede en ningún caso copiar, redistribuir ni modificar el juego.</Text>
          <Text><u>Disponibilidad del servicio:</u> Typerun no garantiza estar disponible 24/7 debido a posibles mantenimientos y fallos. No somos responsables en caso de pérdida de progreso relacionada con un incidente técnico.</Text>
          <Text><u>Modificación de los términos:</u> En caso de modificación de nuestros términos, serás informado por correo electrónico.</Text>
          <Text>Para saber más sobre la privacidad de tus datos, <Link to="/privacy" className="hover:text-glow"><u>haz clic aquí</u></Link></Text>
          <br />
          <Text variant="dim"><i><br />Última actualización el 21 de mayo de 2026</i></Text>
        </PageLayout>
      </div>
    );
  }
}
