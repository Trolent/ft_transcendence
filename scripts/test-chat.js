const { io } = require('../srcs/requirements/frontend/node_modules/socket.io-client')

const BASE = 'http://localhost:3000';

// ─── Auth ───────────────────────────────────────────────────────────────────

async function login(identifier, password) {
    const res = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`Login failed for ${identifier}: ${JSON.stringify(data)}`);
    return data.access_token;
}

// ─── Socket ──────────────────────────────────────────────────────────────────

function connect(token) {
    return io(`${BASE}/chat`, {
        auth: { token },
        transports: ['websocket'],
    });
}

function waitEvent(socket, event, timeoutMs = 3000) {
    return new Promise((resolve, reject) => {
        const t = setTimeout(() => reject(new Error(`Timeout waiting for "${event}"`)), timeoutMs);
        socket.once(event, (data) => { clearTimeout(t); resolve(data); });
    });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── Tests ───────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function ok(name) { console.log(`  ✅ ${name}`); passed++; }
function fail(name, err) { console.log(`  ❌ ${name}: ${err}`); failed++; }

async function runTests() {
    console.log('\n🔐 Login...');
    const tokenKevin  = await login('kevin@example.com',  'Password123!');
    const tokenJerome = await login('jerome@example.com', 'Password123!');
    console.log('  ✅ kevin  connecté');
    console.log('  ✅ jerome connecté');

    const kevin  = connect(tokenKevin);
    let jerome = connect(tokenJerome);

    await sleep(500);

    // ── Test 1: message en temps réel ──────────────────────────────────────
    console.log('\n📨 Test 1: message en temps réel');
    try {
        const recv = waitEvent(jerome, 'receive_message');
        kevin.emit('send_message', { to: 'jerome', content: 'Hello Jerome!' });
        const msg = await recv;
        if (msg.content === 'Hello Jerome!' && msg.fromUsername)
            ok('jerome reçoit le message de kevin en temps réel');
        else
            fail('message reçu mais contenu incorrect', JSON.stringify(msg));
    } catch (e) { fail('message temps réel', e.message); }

    // ── Test 2: envoi à soi-même ───────────────────────────────────────────
    console.log('\n🚫 Test 2: envoi à soi-même');
    try {
        let received = false;
        kevin.on('receive_message', () => { received = true; });
        kevin.emit('send_message', { to: 'kevin', content: 'self message' });
        await sleep(500);
        if (!received) ok('message à soi-même ignoré');
        else fail('message à soi-même', 'message reçu alors que ça devrait être ignoré');
        kevin.off('receive_message');
    } catch (e) { fail('envoi à soi-même', e.message); }

    // ── Test 3: rate limit (spam < 500ms) ─────────────────────────────────
    console.log('\n⏱️  Test 3: rate limit spam');
    try {
        let count = 0;
        jerome.on('receive_message', () => count++);
        kevin.emit('send_message', { to: 'jerome', content: 'msg 1' });
        kevin.emit('send_message', { to: 'jerome', content: 'msg 2' });
        kevin.emit('send_message', { to: 'jerome', content: 'msg 3' });
        await sleep(700);
        jerome.off('receive_message');
        if (count === 1) ok(`spam bloqué — seulement 1 message reçu sur 3`);
        else fail('rate limit', `${count} messages reçus sur 3 (attendu: 1)`);
    } catch (e) { fail('rate limit', e.message); }

    // ── Test 4: contenu vide après trim ───────────────────────────────────
    console.log('\n🔤 Test 4: contenu vide après trim');
    try {
        let received = false;
        jerome.on('receive_message', () => { received = true; });
        kevin.emit('send_message', { to: 'jerome', content: '   ' });
        await sleep(500);
        if (!received) ok('contenu vide après trim rejeté');
        else fail('validation trim', 'message vide reçu');
        jerome.off('receive_message');
    } catch (e) { fail('validation trim', e.message); }

    // ── Test 5: utilisateur inexistant ────────────────────────────────────
    console.log('\n👻 Test 5: destinataire inexistant');
    try {
        let received = false;
        kevin.on('receive_message', () => { received = true; });
        kevin.emit('send_message', { to: 'utilisateur_inexistant_xyz', content: 'hello' });
        await sleep(500);
        if (!received) ok('message à utilisateur inexistant ignoré silencieusement');
        else fail('destinataire inexistant', 'une réponse a été reçue');
        kevin.off('receive_message');
    } catch (e) { fail('destinataire inexistant', e.message); }

    // ── Test 6: message offline → DB ─────────────────────────────────────
    console.log('\n💾 Test 6: message offline sauvegardé en DB');
    try {
        jerome.disconnect();
        await sleep(300);
        kevin.emit('send_message', { to: 'jerome', content: 'message offline' });
        await sleep(500);
        const res = await fetch(`${BASE}/chat/kevin`, {
            headers: { Authorization: `Bearer ${tokenJerome}` },
        });
        const history = await res.json();
        const found = history.some(m => m.content === 'message offline');
        if (found) ok('message offline sauvegardé et récupérable via GET /chat/:username');
        else fail('message offline', 'message non trouvé dans l\'historique');
        jerome = connect(tokenJerome);
        await sleep(300);
    } catch (e) { fail('message offline', e.message); }

    // ── Test 7: bloc → message ignoré ────────────────────────────────────
    console.log('\n🛑 Test 7: message bloqué ignoré');
    try {
        const blockRes = await fetch(`${BASE}/friends/kevin/block`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${tokenJerome}` },
        });
        if (!blockRes.ok) {
            fail('block', `impossible de bloquer kevin: ${blockRes.status}`);
        } else {
            let received = false;
            jerome.on('receive_message', () => { received = true; });
            kevin.emit('send_message', { to: 'jerome', content: 'message bloqué' });
            await sleep(500);
            if (!received) ok('message bloqué ignoré');
            else fail('block', 'message reçu malgré le blocage');
            jerome.off('receive_message');

            // unblock
            await fetch(`${BASE}/friends/kevin/unblock`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${tokenJerome}` },
            });
        }
    } catch (e) { fail('block', e.message); }

    // ── Test 8: GET /chat (conversations) ────────────────────────────────
    console.log('\n📋 Test 8: GET /chat conversations');
    try {
        const res = await fetch(`${BASE}/chat`, {
            headers: { Authorization: `Bearer ${tokenKevin}` },
        });
        const convs = await res.json();
        if (Array.isArray(convs) && convs.length > 0 && convs[0].user && convs[0].lastMessage)
            ok(`GET /chat retourne ${convs.length} conversation(s) avec structure correcte`);
        else
            fail('GET /chat', `réponse inattendue: ${JSON.stringify(convs).slice(0, 100)}`);
    } catch (e) { fail('GET /chat', e.message); }

    // ── Test 9: GET /chat/:username (historique paginé) ───────────────────
    console.log('\n📜 Test 9: GET /chat/:username historique');
    try {
        const res = await fetch(`${BASE}/chat/jerome`, {
            headers: { Authorization: `Bearer ${tokenKevin}` },
        });
        const history = await res.json();
        if (Array.isArray(history) && history[0]?.sender && history[0]?.receiver)
            ok(`GET /chat/jerome retourne ${history.length} message(s) avec sender/receiver`);
        else
            fail('GET /chat/:username', `réponse inattendue: ${JSON.stringify(history).slice(0, 100)}`);
    } catch (e) { fail('GET /chat/:username', e.message); }

    // ── Test 10: socket non authentifié ──────────────────────────────────
    console.log('\n🔒 Test 10: socket non authentifié');
    try {
        const unauth = io(`${BASE}/chat`, { transports: ['websocket'] });
        await sleep(500);
        if (!unauth.connected) ok('socket non authentifié déconnecté');
        else { fail('auth', 'socket non authentifié connecté'); unauth.disconnect(); }
    } catch (e) { fail('auth', e.message); }

    // ── Test 11: content > 2000 chars rejeté ─────────────────────────────
    console.log('\n📏 Test 11: content > 2000 chars rejeté');
    try {
        let received = false;
        jerome.on('receive_message', () => { received = true; });
        kevin.emit('send_message', { to: 'jerome', content: 'a'.repeat(2001) });
        await sleep(500);
        if (!received) ok('message > 2000 chars rejeté par ValidationPipe');
        else fail('MaxLength', 'message > 2000 chars accepté');
        jerome.off('receive_message');
    } catch (e) { fail('MaxLength', e.message); }

    // ── Test 12: payload sans champs requis ──────────────────────────────
    console.log('\n🔍 Test 12: payload sans champs requis');
    try {
        let received = false;
        jerome.on('receive_message', () => { received = true; });
        kevin.emit('send_message', { content: 'no to field' });
        kevin.emit('send_message', { to: 'jerome' });
        await sleep(500);
        if (!received) ok('payload incomplet rejeté par ValidationPipe');
        else fail('validation required', 'payload incomplet accepté');
        jerome.off('receive_message');
    } catch (e) { fail('validation required', e.message); }

    // ── Test 13: XSS stocké brut en DB ───────────────────────────────────
    console.log('\n🔐 Test 13: XSS stocké brut (frontend doit sanitizer)');
    try {
        const xss = '<script>alert("xss")</script>';
        const recv = waitEvent(jerome, 'receive_message');
        kevin.emit('send_message', { to: 'jerome', content: xss });
        const msg = await recv;
        if (msg.content === xss)
            ok(`XSS stocké brut "${xss.slice(0, 30)}" — frontend doit utiliser textContent`);
        else
            fail('XSS', `contenu modifié: ${msg.content}`);
    } catch (e) { fail('XSS', e.message); }

    // ─── Résultat ──────────────────────────────────────────────────────────
    kevin.disconnect();
    jerome.disconnect?.();

    console.log(`\n${'─'.repeat(50)}`);
    console.log(`✅ ${passed} passed  ❌ ${failed} failed`);
    process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => { console.error(err); process.exit(1); });
