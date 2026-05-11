import { PrismaClient, Language, UserStatus, FriendshipStatus, MatchStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const SEED_USERS       = 999;
const SEED_MATCHES     = 40;
const SEED_FRIENDSHIPS = 30;
const DEFAULT_PASSWORD = 'Password123!';

const prisma = new PrismaClient();

const textSnippets = [
  'size_t ft_strlen(const char *s) returns the number of characters before the null terminator.',
  'char *ft_strdup(const char *s1) allocates a new string and copies the full source buffer into it.',
  'void *ft_memset(void *b, int c, size_t len) fills the memory area with the same byte value.',
  'void *ft_memcpy(void *dest, const void *src, size_t n) copies n bytes from src to dest without overlap checks.',
  'int ft_strncmp(const char *s1, const char *s2, size_t n) compares two strings up to the requested length.',
  'char *ft_strjoin(const char *s1, const char *s2) allocates a fresh string containing both inputs end to end.',
];

const achievementsData = [
  { key: 'first_match',      label: 'First Blood',     description: 'Complete your first match'         },
  { key: 'speed_demon',      label: 'Speed Demon',      description: 'Reach 100 WPM in a match'          },
  { key: 'perfectionist',    label: 'Perfectionist',    description: 'Finish a match with 100% accuracy'  },
  { key: 'social_butterfly', label: 'Social Butterfly', description: 'Add 5 friends'                     },
  { key: 'veteran',          label: 'Veteran',          description: 'Complete 50 matches'                },
  { key: 'win_streak_5',     label: 'On Fire',          description: 'Win 5 matches in a row'             },
];

function randFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function main() {
  faker.seed(42);
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const languages    = Object.values(Language);
  const statuses     = Object.values(UserStatus);

  const achievements = await Promise.all(
    achievementsData.map(a =>
      prisma.achievement.upsert({
        where:  { key: a.key },
        update: {},
        create: { ...a, iconUrl: null },
      }),
    ),
  );

  const usernames = new Set<string>();
  const usersData: { username: string; email: string }[] = [];
  while (usersData.length < SEED_USERS) {
    const username = faker.internet.username().toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 20);
    if (usernames.has(username)) continue;
    usernames.add(username);
    usersData.push({ username, email: faker.internet.email().toLowerCase() });
  }

  const users = await Promise.all(
    usersData.map((u, i) =>
      prisma.user.upsert({
        where:  { username: u.username },
        update: {},
        create: {
          username:     u.username,
          email:        u.email,
          bio:          faker.lorem.sentence(),
          passwordHash,
          avatarUrl:    `https://api.dicebear.com/7.x/pixel-art/svg?seed=${i + 1}`,
          language:     randFrom(languages),
          status:       randFrom(statuses),
          createdAt:    daysAgo(faker.number.int({ min: 1, max: 90 })),
        },
      }),
    ),
  );

  const friendshipPairs = new Set<string>();
  let attempts = 0;
  while (friendshipPairs.size < SEED_FRIENDSHIPS && attempts < SEED_FRIENDSHIPS * 5) {
    attempts++;
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
        status:      randFrom([FriendshipStatus.ACCEPTED, FriendshipStatus.ACCEPTED, FriendshipStatus.PENDING]),
        createdAt:   daysAgo(faker.number.int({ min: 1, max: 30 })),
      },
    });
  }

  for (let i = 0; i < SEED_MATCHES; i++) {
    const startedAt = daysAgo(faker.number.int({ min: 0, max: 30 }));
    const endedAt   = new Date(startedAt.getTime() + faker.number.int({ min: 30, max: 300 }) * 1000);

    const match = await prisma.match.create({
      data: {
        textSnippet: randFrom(textSnippets),
        startedAt,
        endedAt,
        status: MatchStatus.FINISHED,
      },
    });

    const playerCount = faker.number.int({ min: 2, max: Math.min(4, users.length) });
    const players = [...users].sort(() => Math.random() - 0.5).slice(0, playerCount);

    const results = players
      .map(user => ({
        matchId:    match.id,
        userId:     user.id,
        wpm:        parseFloat(faker.number.float({ min: 30, max: 150, fractionDigits: 2 }).toFixed(2)),
        accuracy:   parseFloat(faker.number.float({ min: 80, max: 100, fractionDigits: 2 }).toFixed(2)),
        position:   0,
        finishedAt: endedAt,
      }))
      .sort((a, b) => b.wpm - a.wpm)
      .map((r, idx) => ({ ...r, position: idx + 1 }));

    await prisma.matchResult.createMany({ data: results, skipDuplicates: true });
  }

  for (const user of users) {
    const count    = faker.number.int({ min: 0, max: 3 });
    const selected = [...achievements].sort(() => Math.random() - 0.5).slice(0, count);
    for (const achievement of selected) {
      await prisma.userAchievement.upsert({
        where:  { userId_achievementId: { userId: user.id, achievementId: achievement.id } },
        update: {},
        create: {
          userId:        user.id,
          achievementId: achievement.id,
          unlockedAt:    daysAgo(faker.number.int({ min: 0, max: 30 })),
        },
      });
    }
  }

  console.log(`Seeded: ${SEED_USERS} users, ${SEED_MATCHES} matches, ${friendshipPairs.size} friendships`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
