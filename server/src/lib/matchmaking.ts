import { generateId } from "lucia";

type UserId = string;
type UserInQueue = {
    userId: UserId;
    mmr: number;
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
export default class Matchmaking {
    #queue = new Map<UserId, UserInQueue>();

    constructor(private options: MatchmakingOptions) {
    }

    addToQueue(userId: string, onMatchFound: (match: Match) => void) {
        this.#queue.set(userId, {
            userId,
            mmr: 100,
            timestamp: Date.now(),
            onMatchFound
        });
    }

    removeFromQueue(userId: string) {
        this.#queue.delete(userId);
    }

    getQueueStatus(userId: string) {
        return { status: "inQueue", ...this.#queue.get(userId) };
    }

    findMatches() {
        const { numberOfTeams, playersPerTeam } = this.options;
        const totalNumberOfPlayers = playersPerTeam * numberOfTeams;

        const matchPlayers: UserInQueue[] = [];
        while (matchPlayers.length < totalNumberOfPlayers && this.#queue.size > 0) {
            const user = this.#queue.values().next().value;
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
}
