// const email    = 'kevin.pires@typerun.dev';
const email    = 'jerome@example.com'
//timothee.rolland@typerun.dev
const password = '';

if (!email || !password) {
  console.log('Usage: node get_bearer.js <email> <password>');
  process.exit(1);
}

const res  = await fetch('http://localhost:3000/auth/login', {
  method:  'POST',
  headers: { 'Content-Type': 'application/json' },
  body:    JSON.stringify({ identifier:email, password }),
});

const data = await res.json();

if (!res.ok) {
  console.error('❌ erreur:', data);
  process.exit(1);
}

console.log(data.access_token);