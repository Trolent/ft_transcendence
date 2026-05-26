import { useState } from "react";
import { Heading, Label, Btn, LanguageSwitcher, Container, PageLayout } from "@/components";
import { useTranslation } from "react-i18next";

export default function Settings() {
  const { t } = useTranslation('pages');
  const [editing, setEditing] = useState(false);
  //temp
  let [bio, setBio] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");

  return (
    <PageLayout maxWidth="max-w-lg">
      <Heading level={3} className="mt-10 sm:text-2xl sm:tracking-[0.2em]">{t('settings.title')}</Heading>
      <Container variant="panel" label={t('settings.manage_account')} className="mt-3 flex w-full justify-center hover:opacity-80">
        <div className="flex gap-20 text-sm">
          <Container variant="terminal" className="py-1">{t('settings.change_email')}</Container>
          <Container variant="terminal" className="py-1">{t('settings.change_password')}</Container>
        </div>
      </Container>

      <Container variant="panel" className="mt-3 flex items-center justify-between w-full gap-4 p-4 hover:opacity-80">
        <Label>{t('settings.game_mode')}</Label>
        <Btn size="sm" variant="primary">{t('settings.normal')}</Btn>
      </Container>

      <Container variant="panel" className="mt-3 flex w-full hover:opacity-80 flex items-center justify-between w-full gap-4 p-4">
        <Label>{t('settings.language')}</Label>
        <LanguageSwitcher />
      </Container>

      <button type="button" variant="danger" className="mt-6 flex border border-danger w-fit hover:opacity-80 py-2 px-4">
        <Label>
          <div className="text-danger">{t('settings.delete_account')}</div>
        </Label>
      </button>
    </PageLayout>
  );
}
