import { PriorityQueue } from "@datastructures-js/priority-queue";
import { generateId } from "lucia";

type UserId = string;
type UserInQueue = {
    userId: UserId;
    mmr: number;
    adjustedMmr: number;
    timestamp: number;
    onMatchFound: (match: Match) => void;
};

type Team = {
    id: string;
    players: { userId: UserId; mmr: number; score: number; }[];
    score: number;
};

type Match = {
    id: string;
    startTime: number;
    endTime?: number;
    teams: Team[];
    winner?: Team["id"];
};

type MatchmakingOptions = {
    numberOfTeams: number;
    playersPerTeam: number;
};

const FIVE_MINUTES = 5 * 60 * 1000;

export default class Matchmaking {
    #queue = new PriorityQueue<UserInQueue>(this._queueComparator.bind(this));

    constructor(private options: MatchmakingOptions) {
    }

    addToQueue(userId: string, onMatchFound: (match: Match) => void) {
        this.#queue.enqueue({
            userId,
            mmr: 100,
            adjustedMmr: 100,
            timestamp: Date.now(),
            onMatchFound
        });
    }

    removeFromQueue(userId: string) {
        this.#queue.remove(user => user.userId === userId);
    }

    getQueueStatus(userId: string) {
        return { status: "inQueue", ...this.#queue.toArray().find(user => user.userId === userId) };
    }

    findMatches() {
        const { numberOfTeams, playersPerTeam } = this.options;
        const totalNumberOfPlayers = playersPerTeam * numberOfTeams;

        const matchPlayers: UserInQueue[] = [];
        while (matchPlayers.length < totalNumberOfPlayers && !this.#queue.isEmpty()) {
            const user = this.#queue.dequeue();
            if (user) {
                matchPlayers.push(user);
            }
        }

        const hasEnoughPlayers = matchPlayers.length === totalNumberOfPlayers;
        if (hasEnoughPlayers) {
            const match: Match = {
                id: generateId(10),
                startTime: Date.now(),
                teams: []
            };
            for (let i = 0; i < playersPerTeam; i += numberOfTeams) {
                const teamPlayers = matchPlayers.slice(i, i + numberOfTeams);
                const team: Team = {
                    id: `team${i / numberOfTeams + 1}`,
                    players: teamPlayers.map((player) => ({ userId: player.userId, mmr: player.mmr, score: 0 })),
                    score: 0,
                };
                match.teams.push(team);
            }

            matchPlayers.forEach(({ onMatchFound }) => onMatchFound(match));
        }

        setTimeout(this.findMatches.bind(this), 2500);
    }

    run() {
        const loop = () => {
            this.findMatches();
            setTimeout(loop, 2500);
        };
        loop();
    }

    private _queueComparator(a: UserInQueue, b: UserInQueue) {
        if (a.mmr === b.mmr) {
            return a.timestamp < b.timestamp ? 1 : -1;
        }
        return a.mmr > b.mmr ? 1 : -1;
    }
}
