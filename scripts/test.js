// const email    = 'kevin.pires@typerun.dev';
const email    = 'timothee.rolland@typerun.dev'
//timothee.rolland@typerun.dev
const password = 'Password123!';

if (!email || !password) {
  console.log('Usage: node get_bearer.js <email> <password>');
  process.exit(1);
}

const res  = await fetch('http://localhost:3000/auth/login', {
  method:  'POST',
  headers: { 'Content-Type': 'application/json' },
  body:    JSON.stringify({ email, password }),
});

const data = await res.json();

if (!res.ok) {
  console.error('❌ erreur:', data);
  process.exit(1);
}

console.log(data.access_token);