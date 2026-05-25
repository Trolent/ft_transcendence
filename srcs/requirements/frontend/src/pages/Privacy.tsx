import { Heading, Text } from "../components";
import { PageLayout } from "../layout";
import { useTranslation } from "react-i18next";

export default function Privacy() {
  const { i18n } = useTranslation();
  if (i18n.language === "en") {
    return (
      <PageLayout>
        <Heading level={2}>Privacy</Heading>
        <Text><u>Your data:</u> When you create an account, the data collected is as follows: username, email address and password (hidden). Other data collected later includes: game statistics, match history, IP addresses, browser used, logs, friends list, and sent/received friend requests. If you delete your account, all your data is removed.</Text>
        <Text><u>Use of your data:</u> All collected data allows us to maintain the real-time leaderboard, secure your connections, and manage the friend system. We are committed to maintaining full transparency regarding the data collected.</Text>
        <Text><u>Sharing with third parties:</u> We do not sell your data under any circumstances.</Text>
        <br />
        <Text><i><br />Last updated on May 22nd, 2026</i></Text>
      </PageLayout>
    );
  }

  else if (i18n.language === "fr") {
    return (
      <PageLayout>
        <Heading level={2}>Confidentialité</Heading>
        <Text><u>Vos données:</u> Lorsque vous créez un compte, les données collectées sont les suivants : nom d'utilisateur, adresse e-mail et mot de passe (masqué). Les autres données recueillies par la suite sont : les statistiques du jeu, l'historique des parties, les adresses IP, le navigateur utilisé, les logs, la liste d'amis et les demandes d'amis envoyees/recues. Si vous supprimez votre compte, toutes vos données disparaissent.</Text>
        <Text><u>Utilisation de vos données:</u> L'ensemble des données collectées nous permettent d'établir le leaderboard en temps réel, de sécuriser vos connexions, et de gérer le système d'amis. Nous nous engageons à garder une totale transparence quand aux données recueillies.</Text>
        <Text><u>Partage avec des tiers:</u> Nous ne vendons vos données en aucun cas.</Text>
        <br />
        <Text><i><br />Dernière mise à jour le 22 mai 2026</i></Text>
      </PageLayout>
    );
  }

  else {
    return (
      <PageLayout>
        <Heading level={2}>Privacidad</Heading>
        <Text><u>Tus datos:</u> Cuando creas una cuenta, los datos recopilados son los siguientes: nombre de usuario, dirección de correo electrónico y contraseña (oculta). Los demás datos recopilados posteriormente son: estadísticas del juego, historial de partidas, direcciones IP, navegador utilizado, registros, lista de amigos y solicitudes de amistad enviadas/recibidas. Si eliminas tu cuenta, todos tus datos desaparecen.</Text>
        <Text><u>Uso de tus datos:</u> El conjunto de datos recopilados nos permite establecer la clasificación en tiempo real, asegurar tus conexiones y gestionar el sistema de amigos. Nos comprometemos a mantener total transparencia en cuanto a los datos recopilados.</Text>
        <Text><u>Compartir con terceros:</u> No vendemos tus datos bajo ninguna circunstancia.</Text>
        <br />
        <Text><i><br />Última actualización el 22 de mayo de 2026</i></Text>
      </PageLayout>
    );
  }
}
