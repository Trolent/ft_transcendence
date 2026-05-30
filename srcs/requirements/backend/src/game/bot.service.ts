import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Participant, RoomState } from './game.types';
import {
	BOT_TICK_MS,
	BOT_WPM_JITTER,
	BOT_WPM_FALLBACK_MIN,
	BOT_WPM_FALLBACK_MAX,
} from '../common/game.constant';

function randBetween(min: number, max: number): number {
	return min + Math.random() * (max - min);
}

@Injectable()
export class BotService {
	constructor(private prisma: PrismaService) {}

	// Anchor bot speed on the real players' recent average wpm; fall back to a
	// human-ish random range when there is no history to learn from.
	async anchorWpm(realUserIds: number[]): Promise<number> {
		if (realUserIds.length > 0) {
			const agg = await this.prisma.matchResult.aggregate({
				where: { userId: { in: realUserIds }, wpm: { not: null } },
				_avg: { wpm: true },
			});
			if (agg._avg.wpm && agg._avg.wpm > 0) return agg._avg.wpm;
		}
		return randBetween(BOT_WPM_FALLBACK_MIN, BOT_WPM_FALLBACK_MAX);
	}

	// Give every bot in the room a steady target wpm jittered around the anchor.
	initBots(room: RoomState, anchor: number): void {
		for (const p of room.players.values()) {
			if (p.kind !== 'bot') continue;
			const jitter = 1 + (Math.random() * 2 - 1) * BOT_WPM_JITTER;
			const target = Math.max(15, Math.round(anchor * jitter));
			p.bot = { targetWpm: target, charsFloat: 0 };
			p.wpm = target;
		}
	}

	// Advance each unfinished bot by one tick. Returns the bots whose progress
	// changed so the caller can broadcast race_update for them.
	step(room: RoomState): Participant[] {
		if (!room.startedAt) return [];
		const len = room.text.length;
		const changed: Participant[] = [];

		for (const p of room.players.values()) {
			if (p.kind !== 'bot' || p.finished || !p.bot) continue;

			const charsPerTick = (p.bot.targetWpm * 5 / 60) * (BOT_TICK_MS / 1000);
			p.bot.charsFloat += charsPerTick;

			const chars = Math.min(len, Math.floor(p.bot.charsFloat));
			if (chars === p.chars) continue;

			p.chars = chars;
			p.progress = len > 0 ? chars / len : 1;
			changed.push(p);

			if (chars >= len) {
				p.finished = true;
				p.finishedAt = Date.now();
				p.progress = 1;
			}
		}
		return changed;
	}
}
