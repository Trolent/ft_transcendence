import { Link } from "react-router-dom";
import { Heading, Text, PageLayout } from "@/components";
import { useTranslation } from "react-i18next";

export default function Terms() {
  const { i18n } = useTranslation();
  if (i18n.language === "en") {
    return (
      <PageLayout maxWidth="max-w-240">
          <Heading level={2}>Terms</Heading>
          <Text variant="prompt">Thank you for using Typerun. By creating an account and using our services, you agree to all the terms below.</Text>
          <Text variant="accent"><u>Account management:</u> Your account must be created by an individual. You must be at least 13 years old and provide a valid email address. You are responsible for keeping your password confidential and for any activity carried out from your account.</Text>
          <Text><u>Rules of conduct:</u> Be courteous with other players. Harassment, hateful, racist, sexist or discriminatory remarks are in no way tolerated.</Text>
          <Text><u>User content:</u> You are solely responsible for the username you choose and the messages you send. We reserve the right to modify or remove any content that violates these terms.</Text>
          <Text variant="error"><u>Cheating:</u> The use of bots, scripts or any other tool automating input is prohibited, under penalty of invalidated scores or even a ban from the leaderboard.</Text>
          <Text><u>Intellectual property:</u> The game, its code, its design and its content belong to Typerun. The user may not in any case copy, redistribute or modify the game.</Text>
          <Text><u>Service availability:</u> Typerun does not guarantee 24/7 availability due to possible maintenance and outages. We are not responsible in case of loss of progress related to a technical incident.</Text>
          <Text variant="muted"><u>Limitation of liability:</u> Typerun is provided "as is", without warranty of any kind. We cannot be held liable for indirect damages resulting from the use of the service.</Text>
          <Text variant="dim"><u>Applicable law:</u> These terms are subject to French law. Any dispute will be brought before the competent courts.</Text>
          <Text>To learn more about the privacy of your data, <Link to="/privacy" className="hover:text-glow"><u>click here</u></Link></Text>
          <br />
          <Text variant="dim"><i><br />Last updated on May 29, 2026</i></Text>
        </PageLayout>
      </div>
    );
  }

  else if (i18n.language === "fr") {
    return (
      <PageLayout maxWidth="max-w-240">
          <Heading level={2}>Conditions</Heading>
          <Text variant="prompt">Merci d'utiliser Typerun. En créant un compte et en utilisant nos services, vous acceptez l'intégralité des conditions ci-dessous.</Text>
          <Text variant="accent"><u>Gestion du compte :</u> Votre compte doit être créé par une personne physique. Vous devez avoir au minimum 13 ans et fournir une adresse e-mail valide. Vous êtes responsable de la confidentialité de votre mot de passe et de toute activité effectuée depuis votre compte.</Text>
          <Text><u>Règles de conduite :</u> Restez courtois avec les autres joueurs. Le harcèlement, les propos haineux, racistes, sexistes ou discriminatoires ne sont en aucun cas tolérés.</Text>
          <Text><u>Contenu utilisateur :</u> Vous êtes seul responsable du pseudo que vous choisissez et des messages que vous envoyez. Nous nous réservons le droit de modifier ou supprimer tout contenu enfreignant les présentes conditions.</Text>
          <Text variant="error"><u>Triche :</u> L'utilisation de bots, scripts ou tout autre outil automatisant la saisie est interdite, sous peine de score invalidé voire bannissement du leaderboard.</Text>
          <Text><u>Propriété intellectuelle :</u> Le jeu, son code, son design et ses contenus appartiennent à Typerun. L'utilisateur ne peut en aucun cas copier, redistribuer ou modifier le jeu.</Text>
          <Text><u>Disponibilité du service :</u> Typerun ne garantit pas une disponibilité 24/7 en raison des possibles maintenances et pannes. Nous ne sommes pas responsables en cas de perte de progression liée à un incident technique.</Text>
          <Text variant="muted"><u>Limitation de responsabilité :</u> Typerun est fourni « tel quel », sans garantie d'aucune sorte. Nous ne saurions être tenus responsables des dommages indirects résultant de l'utilisation du service.</Text>
          <Text variant="dim"><u>Droit applicable :</u> Les présentes conditions sont soumises au droit français. Tout litige sera porté devant les tribunaux compétents.</Text>
          <Text>Pour en savoir plus sur la confidentialité de vos données, <Link to="/privacy" className="hover:text-glow"><u>cliquez ici</u></Link></Text>
          <br />
          <Text variant="dim"><i><br />Dernière mise à jour le 29 mai 2026</i></Text>
        </PageLayout>
      </div>
    );
  }

  else {
    return (
      <div className="mx-auto w-240">
        <PageLayout>
          <Heading level={2}>Condiciones</Heading>
          <Text variant="prompt">Gracias por utilizar Typerun. Al crear una cuenta y utilizar nuestros servicios, aceptas la totalidad de las condiciones que se indican a continuación.</Text>
          <Text variant="accent"><u>Gestión de la cuenta:</u> Tu cuenta debe ser creada por una persona física. Debes tener al menos 13 años y proporcionar una dirección de correo electrónico válida. Eres responsable de la confidencialidad de tu contraseña y de toda actividad realizada desde tu cuenta.</Text>
          <Text><u>Normas de conducta:</u> Sé cortés con los demás jugadores. El acoso y los comentarios de odio, racistas, sexistas o discriminatorios no se toleran en ningún caso.</Text>
          <Text><u>Contenido del usuario:</u> Eres el único responsable del alias que elijas y de los mensajes que envíes. Nos reservamos el derecho de modificar o eliminar cualquier contenido que infrinja las presentes condiciones.</Text>
          <Text variant="error"><u>Trampas:</u> El uso de bots, scripts o cualquier otra herramienta que automatice la escritura está prohibido, bajo pena de invalidación de la puntuación o incluso expulsión de la clasificación.</Text>
          <Text><u>Propiedad intelectual:</u> El juego, su código, su diseño y sus contenidos pertenecen a Typerun. El usuario no puede en ningún caso copiar, redistribuir ni modificar el juego.</Text>
          <Text><u>Disponibilidad del servicio:</u> Typerun no garantiza una disponibilidad 24/7 debido a posibles mantenimientos y averías. No somos responsables en caso de pérdida de progreso vinculada a un incidente técnico.</Text>
          <Text variant="muted"><u>Limitación de responsabilidad:</u> Typerun se proporciona «tal cual», sin garantía de ningún tipo. No podemos ser considerados responsables de los daños indirectos derivados del uso del servicio.</Text>
          <Text variant="dim"><u>Legislación aplicable:</u> Las presentes condiciones se rigen por el derecho francés. Cualquier litigio será sometido a los tribunales competentes.</Text>
          <Text>Para saber más sobre la privacidad de tus datos, <Link to="/privacy" className="hover:text-glow"><u>haz clic aquí</u></Link></Text>
          <br />
          <Text variant="dim"><i><br />Última actualización el 29 de mayo de 2026</i></Text>
        </PageLayout>
      </div>
    );
  }
}
