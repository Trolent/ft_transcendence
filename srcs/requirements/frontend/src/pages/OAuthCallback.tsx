import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { Alert } from '../components';

export default function OAuthCallback() {
    const navigate = useNavigate();
    const { loginWithToken } = useAuth();

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

    return <Alert variant="info">Connexion en cours..</Alert>;
}
