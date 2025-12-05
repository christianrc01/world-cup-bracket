import { create } from "zustand";
import {
  Match,
  teams,
  groups,
  initialGroupMatches,
  initialKnockoutMatches,
} from "@/data/worldCupData";

interface TeamStanding {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

interface TournamentState {
  groupMatches: Match[];
  knockoutMatches: Match[];
  standings: Record<string, TeamStanding[]>;

  updateGroupMatch: (
    matchId: string,
    homeScore: number | null,
    awayScore: number | null
  ) => void;
  updateKnockoutMatch: (
    matchId: string,
    homeScore: number | null,
    awayScore: number | null
  ) => void;
  getGroupStandings: (groupId: string) => TeamStanding[];
  resetAll: () => void;
}

const calculateStandings = (
  groupId: string,
  matches: Match[]
): TeamStanding[] => {
  const group = groups.find((g) => g.id === groupId);
  if (!group) return [];

  const standingsMap: Record<string, TeamStanding> = {};

  group.teams.forEach((teamId) => {
    standingsMap[teamId] = {
      teamId,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };
  });

  const groupMatches = matches.filter(
    (m) => m.group === groupId && m.homeScore !== null && m.awayScore !== null
  );

  groupMatches.forEach((match) => {
    const home = standingsMap[match.homeTeam];
    const away = standingsMap[match.awayTeam];

    if (!home || !away) return;

    const homeScore = match.homeScore!;
    const awayScore = match.awayScore!;

    home.played++;
    away.played++;
    home.goalsFor += homeScore;
    home.goalsAgainst += awayScore;
    away.goalsFor += awayScore;
    away.goalsAgainst += homeScore;

    if (homeScore > awayScore) {
      home.won++;
      home.points += 3;
      away.lost++;
    } else if (homeScore < awayScore) {
      away.won++;
      away.points += 3;
      home.lost++;
    } else {
      home.drawn++;
      away.drawn++;
      home.points += 1;
      away.points += 1;
    }

    home.goalDifference = home.goalsFor - home.goalsAgainst;
    away.goalDifference = away.goalsFor - away.goalsAgainst;
  });

  return Object.values(standingsMap).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference)
      return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return teams[a.teamId].name.localeCompare(teams[b.teamId].name);
  });
};

const updateKnockoutTeams = (
  groupMatches: Match[],
  knockoutMatches: Match[]
): Match[] => {
  const updatedKnockout = [...knockoutMatches];

  // Get all group standings
  const allStandings: Record<string, TeamStanding[]> = {};
  groups.forEach((group) => {
    allStandings[group.id] = calculateStandings(group.id, groupMatches);
  });

  // R16 mapping: 1A vs 2B, 1C vs 2D, etc.
  const r16Mapping = [
    { match: "R16-1", first: "A", second: "B" },
    { match: "R16-2", first: "C", second: "D" },
    { match: "R16-3", first: "E", second: "F" },
    { match: "R16-4", first: "G", second: "H" },
    { match: "R16-5", first: "B", second: "A" },
    { match: "R16-6", first: "D", second: "C" },
    { match: "R16-7", first: "F", second: "E" },
    { match: "R16-8", first: "H", second: "G" },
  ];

  r16Mapping.forEach(({ match, first, second }) => {
    const r16Match = updatedKnockout.find((m) => m.id === match);
    if (r16Match) {
      const firstStandings = allStandings[first];
      const secondStandings = allStandings[second];

      // Only update if standings have teams with points
      const firstTeam =
        firstStandings[0]?.played > 0 ? firstStandings[0]?.teamId : "TBD";
      const secondTeam =
        secondStandings[1]?.played > 0 ? secondStandings[1]?.teamId : "TBD";

      r16Match.homeTeam = firstTeam;
      r16Match.awayTeam = secondTeam;
    }
  });

  // Quarter finals from R16 winners
  const qfMapping = [
    { match: "QF-1", from: ["R16-1", "R16-2"] },
    { match: "QF-2", from: ["R16-3", "R16-4"] },
    { match: "QF-3", from: ["R16-5", "R16-6"] },
    { match: "QF-4", from: ["R16-7", "R16-8"] },
  ];

  qfMapping.forEach(({ match, from }) => {
    const qfMatch = updatedKnockout.find((m) => m.id === match);
    if (qfMatch) {
      const r16Match1 = updatedKnockout.find((m) => m.id === from[0]);
      const r16Match2 = updatedKnockout.find((m) => m.id === from[1]);

      qfMatch.homeTeam = getWinner(r16Match1);
      qfMatch.awayTeam = getWinner(r16Match2);
    }
  });

  // Semi finals from QF winners
  const sfMapping = [
    { match: "SF-1", from: ["QF-1", "QF-2"] },
    { match: "SF-2", from: ["QF-3", "QF-4"] },
  ];

  sfMapping.forEach(({ match, from }) => {
    const sfMatch = updatedKnockout.find((m) => m.id === match);
    if (sfMatch) {
      const qfMatch1 = updatedKnockout.find((m) => m.id === from[0]);
      const qfMatch2 = updatedKnockout.find((m) => m.id === from[1]);

      sfMatch.homeTeam = getWinner(qfMatch1);
      sfMatch.awayTeam = getWinner(qfMatch2);
    }
  });

  // Third place from SF losers
  const thirdPlace = updatedKnockout.find((m) => m.id === "TP");
  if (thirdPlace) {
    const sf1 = updatedKnockout.find((m) => m.id === "SF-1");
    const sf2 = updatedKnockout.find((m) => m.id === "SF-2");

    thirdPlace.homeTeam = getLoser(sf1);
    thirdPlace.awayTeam = getLoser(sf2);
  }

  // Final from SF winners
  const final = updatedKnockout.find((m) => m.id === "F");
  if (final) {
    const sf1 = updatedKnockout.find((m) => m.id === "SF-1");
    const sf2 = updatedKnockout.find((m) => m.id === "SF-2");

    final.homeTeam = getWinner(sf1);
    final.awayTeam = getWinner(sf2);
  }

  return updatedKnockout;
};

const getWinner = (match?: Match): string => {
  if (!match || match.homeScore === null || match.awayScore === null)
    return "TBD";
  if (match.homeScore > match.awayScore) return match.homeTeam;
  if (match.awayScore > match.homeScore) return match.awayTeam;
  // Penalty simulation for draws
  return Math.random() > 0.5 ? match.homeTeam : match.awayTeam;
};

const getLoser = (match?: Match): string => {
  if (!match || match.homeScore === null || match.awayScore === null)
    return "TBD";
  if (match.homeScore > match.awayScore) return match.awayTeam;
  if (match.awayScore > match.homeScore) return match.homeTeam;
  return Math.random() > 0.5 ? match.awayTeam : match.homeTeam;
};

export const useTournamentStore = create<TournamentState>((set, get) => ({
  groupMatches: [...initialGroupMatches],
  knockoutMatches: [...initialKnockoutMatches],
  standings: {},

  updateGroupMatch: (matchId, homeScore, awayScore) => {
    set((state) => {
      const updatedGroupMatches = state.groupMatches.map((m) =>
        m.id === matchId ? { ...m, homeScore, awayScore } : m
      );

      const updatedKnockout = updateKnockoutTeams(
        updatedGroupMatches,
        state.knockoutMatches
      );

      return {
        groupMatches: updatedGroupMatches,
        knockoutMatches: updatedKnockout,
      };
    });
  },

  updateKnockoutMatch: (matchId, homeScore, awayScore) => {
    set((state) => {
      const updatedKnockout = state.knockoutMatches.map((m) =>
        m.id === matchId ? { ...m, homeScore, awayScore } : m
      );

      const finalKnockout = updateKnockoutTeams(
        state.groupMatches,
        updatedKnockout
      );

      return {
        knockoutMatches: finalKnockout,
      };
    });
  },

  getGroupStandings: (groupId) => {
    const state = get();
    return calculateStandings(groupId, state.groupMatches);
  },

  resetAll: () => {
    set({
      groupMatches: [...initialGroupMatches],
      knockoutMatches: [...initialKnockoutMatches],
      standings: {},
    });
  },
}));
