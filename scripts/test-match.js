const { io } = require('../srcs/requirements/frontend/node_modules/socket.io-client')

const API    = 'http://localhost:3000'
const WS_URL = `${API}/game`
const PASS   = 'Password123!'

const PLAYERS = [
  { email: 'akhmed.dovletov@typerun.dev', label: 'Akhmed' },
  { email: 'kevin.pires@typerun.dev',     label: 'Kevin'  },
]

async function getToken(email, password) {
  const res  = await fetch(`${API}/auth/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Login failed for ${email}: ${JSON.stringify(data)}`)
  return data.access_token
}

function createSocket(token, label) {
  const socket = io(WS_URL, { auth: { token } })

  socket.on('connect', () => {
    console.log(`[${label}] connecté: ${socket.id}`)
    socket.emit('join_queue')
    console.log(`[${label}] join_queue émis`)
  })

  socket.on('connect_error', (e) => console.log(`[${label}] erreur: ${e.message}`))
  socket.on('disconnect',    ()  => console.log(`[${label}] déconnecté`))

  let matchText = ''

  socket.on('match_found', (d) => {
    matchText = d.text
    console.log(`[${label}] match_found — texte: "${d.text}"`)
  })

  socket.on('countdown',  (d) => console.log(`[${label}] countdown: ${d.time}`))
  socket.on('race_start', () => {
    console.log(`[${label}] GO!`)
    let chars = 0
    const interval = setInterval(() => {
      chars = Math.min(chars + 5, matchText.length)
      socket.emit('player_progress', { chars })
      if (chars >= matchText.length) clearInterval(interval)
    }, 500)
  })

  socket.on('race_finished', () => console.log(`[${label}] finish.`));


  socket.on('race_update', (d) => {
    console.log(`[${label}] race_update — userId:${d.userId} progress:${(d.progress * 100).toFixed(0)}% wpm:${d.wpm}`)
  })

  return socket
}

async function main() {
  const tokens = await Promise.all(PLAYERS.map(p => getToken(p.email, PASS)))
  console.log('Tokens OK\n')
  PLAYERS.forEach((p, i) => createSocket(tokens[i], p.label))
}

main().catch(console.error)
