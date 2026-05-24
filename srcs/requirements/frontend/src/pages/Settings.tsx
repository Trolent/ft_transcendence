import { useState } from "react";
import { Heading, Text, Label, Btn, LanguageSwitcher, Container, PageLayout } from "@/components";
import { useTranslation } from "react-i18next";

export default function Settings() {
  const { t } = useTranslation('pages');
  const [editing, setEditing] = useState(false);
  //temp
  let [bio, setBio] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");

  return (
    <PageLayout maxWidth="max-w-lg">
      <Heading level={3} className="mt-10 sm:mt-0 sm:text-2xl sm:tracking-[0.2em]">{t('settings.title')}</Heading>
          <Container variant="panel" label={t('settings.edit_bio')} className="mt-3 flex-col">
              <Container variant="terminal" onClick={() => setEditing(true)} className="mt-3">
                {editing
                  ? (
                  <Container variant="default" className="flex flex-col gap-2 w-full border-none">
                    <textarea
                      autoFocus
                      className="w-full bg-transparent outline-none resize-none"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </Container>
                  ) : (
                  <Text>{bio || t('settings.default_bio')}</Text>
                )}
              </Container>
                {editing && (
                  <Container variant="panel" className="pb-0 flex justify-end w-full items-bottom border-none">
                    <Btn size="sm" variant="primary" onClick={(e) => {
                      e.stopPropagation();
                      setEditing(false);
                    }}>
                      {t('common:save')}
                    </Btn>
                  </Container>
                )}
          </Container>

          <Container variant="panel" className="mt-3 flex items-center justify-between w-full gap-4 p-4 hover:opacity-80">
            <Label>{t('settings.game_mode')}</Label>
            <Btn size="sm" variant="primary">{t('settings.normal')}</Btn>
          </Container>

          <Container variant="panel" className="mt-3 flex w-full hover:opacity-80 flex items-center justify-between w-full gap-4 p-4">
            <Label>{t('settings.language')}</Label>
            <LanguageSwitcher />
          </Container>
    </PageLayout>
  );
}
