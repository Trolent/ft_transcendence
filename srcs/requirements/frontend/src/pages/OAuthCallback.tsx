import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const { t } = useTranslation('pages');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      loginWithToken(token);
      navigate('/profile');
    } else {
      navigate('/signin');
    }
  }, []);

  return <div>{t('oauth_callback.connecting')}</div>;
}
