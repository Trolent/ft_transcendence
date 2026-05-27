import { Link } from "react-router-dom";
import { Heading, Text, PageLayout } from "@/components";
import { useTranslation } from "react-i18next";

export default function Privacy() {
  const { i18n } = useTranslation();
  if (i18n.language === "en") {
    return (
      <div className="mx-auto w-220">
        <PageLayout>
          <Heading level={2}>Privacy</Heading>
          <Text variant="accent">Your data belongs to you. Here is what we collect, why, and how you stay in control.</Text>
          <Text><u>Your data :</u> When you create an account, the data collected is as follows: username, email address and password (hidden). Other data collected later includes: game statistics, match history, IP addresses, browser used, logs, friends list, and sent/received friend requests. If you delete your account, all your data is removed.</Text>
          <Text><u>Use of your data :</u> Your data is used solely to operate the service: displaying the real-time leaderboard, securing your connections, managing the friend system and improving the gameplay experience. No data is used for advertising or profiling purposes.</Text>
          <Text variant="accent"><u>Security :</u> Your password is hashed before storage and is never transmitted nor accessible in plain text. All communications with the server are encrypted via HTTPS.</Text>
          <Text><u>Data retention :</u> Your data is kept for as long as your account is active. If you delete your account, your data is erased within 30 days, except for anonymized logs kept for legal reasons.</Text>
          <Text><u>Sharing with third parties :</u> We do not sell your data under any circumstances.</Text>
          <Text variant="error"><u>Minors :</u> Individuals under the age of 13 are not allowed to register. We do not knowingly collect their data.</Text>
          <Text><u>Changes to our privacy policy :</u> If our privacy policy is modified, you will be notified by email.</Text>
          <Text>To learn more about our terms of service, <Link to="/terms" className="hover:text-glow"><u>click here</u></Link></Text>
          <br />
          <Text variant="dim"><i><br />Last updated on May 27th, 2026</i></Text>
        </PageLayout>
      </div>
    );
  }

  else if (i18n.language === "fr") {
    return (
      <div className="mx-auto w-220">
        <PageLayout>
          <Heading level={2}>Confidentialité</Heading>
          <Text variant="accent">Vos données vous appartiennent. Voici ce que nous collectons, pourquoi, et comment vous gardez le contrôle.</Text>
          <Text><u>Vos données :</u> Lorsque vous créez un compte, les données collectées sont : nom d'utilisateur, adresse e-mail et mot de passe (masqué). Les autres données recueillies par la suite sont : les statistiques de jeu, l'historique des parties, les adresses IP, le navigateur utilisé, les logs, la liste d'amis et les demandes d'amis envoyées/reçues. Si vous supprimez votre compte, toutes vos données disparaissent.</Text>
          <Text><u>Utilisation de vos données :</u> Vos données nous servent uniquement à faire fonctionner le service : afficher le leaderboard en temps réel, sécuriser vos connexions, gérer le système d'amis et améliorer l'expérience de jeu. Aucune donnée n'est utilisée à des fins publicitaires ou de profilage.</Text>
          <Text variant="accent"><u>Sécurité :</u> Votre mot de passe est haché avant stockage et n'est jamais transmis ni accessible en clair. Toutes les communications avec le serveur sont chiffrées via HTTPS.</Text>
          <Text><u>Durée de conservation :</u> Vos données sont conservées tant que votre compte est actif. En cas de suppression de compte, elles sont effacées sous 30 jours, à l'exception des logs anonymisés conservés pour des raisons légales.</Text>
          <Text><u>Partage avec des tiers :</u> Nous ne vendons vos données en aucun cas.</Text>
          <Text variant="error"><u>Mineurs :</u> Les personnes ayant moins de 13 ans ne sont pas autorisées à s'inscrire. Nous ne souhaitons pas recueillir volontairement leurs données.</Text>
          <Text><u>Modification de notre politique de confidentialité :</u> En cas de modification de notre politique de confidentialité, vous en serez informés par mail.</Text>
          <Text>Pour en savoir plus sur nos conditions d'utilisation, <Link to="/terms" className="hover:text-glow"><u>cliquez ici</u></Link></Text>
          <br />
          <Text variant="dim"><i><br />Dernière mise à jour le 27 mai 2026</i></Text>
        </PageLayout>
      </div>
    );
  }

  else {
    return (
      <div className="mx-auto w-220">
        <PageLayout>
          <Heading level={2}>Privacidad</Heading>
          <Text variant="accent">Tus datos te pertenecen. Aquí tienes qué recopilamos, por qué y cómo mantienes el control.</Text>
          <Text><u>Tus datos :</u> Cuando creas una cuenta, los datos recopilados son los siguientes: nombre de usuario, dirección de correo electrónico y contraseña (oculta). Los demás datos recopilados posteriormente son: estadísticas del juego, historial de partidas, direcciones IP, navegador utilizado, registros, lista de amigos y solicitudes de amistad enviadas/recibidas. Si eliminas tu cuenta, todos tus datos desaparecen.</Text>
          <Text><u>Uso de tus datos :</u> Tus datos se utilizan únicamente para hacer funcionar el servicio: mostrar la clasificación en tiempo real, asegurar tus conexiones, gestionar el sistema de amigos y mejorar la experiencia de juego. Ningún dato se utiliza con fines publicitarios ni de elaboración de perfiles.</Text>
          <Text variant="accent"><u>Seguridad :</u> Tu contraseña se cifra (hash) antes de almacenarse y nunca se transmite ni es accesible en texto claro. Todas las comunicaciones con el servidor están cifradas mediante HTTPS.</Text>
          <Text><u>Conservación de los datos :</u> Tus datos se conservan mientras tu cuenta esté activa. En caso de eliminación de la cuenta, se borran en un plazo de 30 días, salvo los registros anonimizados conservados por motivos legales.</Text>
          <Text><u>Compartir con terceros :</u> No vendemos tus datos bajo ninguna circunstancia.</Text>
          <Text variant="error"><u>Menores :</u> Las personas menores de 13 años no están autorizadas a registrarse. No recopilamos voluntariamente sus datos.</Text>
          <Text><u>Modificación de nuestra política de privacidad :</u> En caso de modificación de nuestra política de privacidad, será notificado por correo electrónico.</Text>
          <Text>Para saber más sobre nuestras condiciones de uso, <Link to="/terms" className="hover:text-glow"><u>haz clic aquí</u></Link></Text>
          <br />
          <Text variant="dim"><i><br />Última actualización el 27 de mayo de 2026</i></Text>
        </PageLayout>
      </div>
    );
  }
}
