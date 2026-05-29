import { PrismaClient, Language, UserStatus, FriendshipStatus, MatchStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ACHIEVEMENTS } from '../src/common/achievements.constants';

const prisma = new PrismaClient();

const usersData = [
  { username: 'alice',    email: 'alice@example.com'    },
  { username: 'thomas',   email: 'thomas@example.com'   },
  { username: 'chloe',   email: 'chloe@example.com'   },
  { username: 'lucas',    email: 'lucas@example.com'    },
  { username: 'emma',      email: 'emma@example.com'      },
  { username: 'hugo',    email: 'hugo@example.com'    },
  { username: 'lea',      email: 'lea@example.com'      },
  { username: 'maxime',   email: 'maxime@example.com'   },
  { username: 'sofia',      email: 'sofia@example.com'      },
  { username: 'nathan',    email: 'nathan@example.com'    },
  { username: 'camille',   email: 'camille@example.com'   },
  { username: 'theo',     email: 'theo@example.com'     },
  { username: 'pauline', email: 'pauline@example.com' },
  { username: 'romain',    email: 'romain@example.com'    },
  { username: 'jade',   email: 'jade@example.com'   },
  { username: 'akhmed', email: 'akhmed@example.com' },
  { username: 'kevin',     email: 'kevin@example.com'     },
  { username: 'axel', email: 'axel@example.com' },
  { username: 'jerome', email: 'jerome@example.com' },
  { username: 'timothee',email: 'timothee@example.com'},
];


const textSnippets = [
  'size_t ft_strlen(const char *s) returns the number of characters before the null terminator.',
  'char *ft_strdup(const char *s1) allocates a new string and copies the full source buffer into it.',
  'void *ft_memset(void *b, int c, size_t len) fills the memory area with the same byte value.',
  'void *ft_memcpy(void *dest, const void *src, size_t n) copies n bytes from src to dest without overlap checks.',
  'int ft_strncmp(const char *s1, const char *s2, size_t n) compares two strings up to the requested length.',
  'char *ft_strjoin(const char *s1, const char *s2) allocates a fresh string containing both inputs end to end.',
  'char **ft_split(const char *s, char c) separates a string into an array of tokens using the delimiter character.',
  'char *ft_substr(const char *s, unsigned int start, size_t len) extracts a substring from the chosen offset.',
  'char *ft_strtrim(const char *s1, const char *set) removes all matching characters from both ends of the string.',
  'void ft_bzero(void *s, size_t n) clears a block of memory by writing zero across the full range.',
];



function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function randFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const languages = [Language.EN, Language.FR, Language.ES];
  //const statuses  = [UserStatus.ONLINE, UserStatus.OFFLINE, UserStatus.IN_GAME];
  const friendshipStatuses = [FriendshipStatus.ACCEPTED, FriendshipStatus.ACCEPTED, FriendshipStatus.PENDING];

  const achievements = await Promise.all(
    ACHIEVEMENTS.map((a) =>
      prisma.achievement.upsert({
        where:  { key: a.key },
        update: {},
        create: { key: a.key, label: a.label, description: a.description, icon: a.icon },
      }),
    ),
  );

  const users = await Promise.all(
    usersData.map((u, i) =>
      prisma.user.upsert({
        where:  { username: u.username },
        update: {
          bio:      `Hello, I'm ${u.username}! I love typing and gaming!`,
          avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${i + 1}`,
        },
        create: {
          username:     u.username,
          email:        u.email,
          bio:          `Hello, I'm ${u.username}! I love typing and gaming!`,
          passwordHash,
          avatarUrl:    `https://api.dicebear.com/7.x/pixel-art/svg?seed=${i + 1}`,
          language:     randFrom(languages),
          status:       UserStatus.OFFLINE,
        },
      }),
    ),
  );

  const friendshipPairs: Set<string> = new Set();
  for (let i = 0; i < 25; i++) {
    const a = randFrom(users);
    const b = randFrom(users);
    if (a.id === b.id) continue;

    const key = `${Math.min(a.id, b.id)}-${Math.max(a.id, b.id)}`;
    if (friendshipPairs.has(key)) continue;
    friendshipPairs.add(key);

    await prisma.friendship.upsert({
      where:  { initiatorId_receiverId: { initiatorId: a.id, receiverId: b.id } },
      update: {},
      create: {
        initiatorId: a.id,
        receiverId:  b.id,
        status:      randFrom(friendshipStatuses),
        createdAt:   daysAgo(randInt(1, 30)),
      },
    });
  }

  for (let i = 0; i < 30; i++) {
    const startedAt = daysAgo(randInt(0, 30));
    const endedAt   = new Date(startedAt.getTime() + randInt(30, 180) * 1000);

    const match = await prisma.match.create({
      data: {
        textSnippet: randFrom(textSnippets),
        startedAt,
        endedAt,
        status: MatchStatus.FINISHED,
      },
    });

    const playerCount = randInt(2, 4);
    const players = [...users].sort(() => Math.random() - 0.5).slice(0, playerCount);

    const results = players
      .map((user) => ({
        matchId:    match.id,
        userId:     user.id,
        wpm:        randFloat(40, 140),
        position:   0,
        finishedAt: endedAt,
      }))
      .sort((a, b) => b.wpm - a.wpm)
      .map((r, idx) => ({ ...r, position: idx + 1 }));

    await prisma.matchResult.createMany({ data: results, skipDuplicates: true });
  }

  for (const user of users) {
    const count = randInt(0, 3);
    const selected = [...achievements].sort(() => Math.random() - 0.5).slice(0, count);
    for (const achievement of selected) {
      await prisma.userAchievement.upsert({
        where:  { userId_achievementId: { userId: user.id, achievementId: achievement.id } },
        update: {},
        create: {
          userId:        user.id,
          achievementId: achievement.id,
          unlockedAt:    daysAgo(randInt(0, 30)),
        },
      });
    }
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
