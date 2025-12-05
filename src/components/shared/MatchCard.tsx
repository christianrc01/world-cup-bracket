import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import TeamFlag from "./TeamFlag";
import { Match, teams } from "@/data/worldCupData";

interface MatchCardProps {
  match: Match;
  onScoreChange: (homeScore: number | null, awayScore: number | null) => void;
  compact?: boolean;
}

const MatchCard = ({
  match,
  onScoreChange,
  compact = false,
}: MatchCardProps) => {
  const [homeScore, setHomeScore] = useState<string>(
    match.homeScore !== null ? match.homeScore.toString() : ""
  );
  const [awayScore, setAwayScore] = useState<string>(
    match.awayScore !== null ? match.awayScore.toString() : ""
  );

  useEffect(() => {
    setHomeScore(match.homeScore !== null ? match.homeScore.toString() : "");
    setAwayScore(match.awayScore !== null ? match.awayScore.toString() : "");
  }, [match.homeScore, match.awayScore]);

  const handleScoreChange = (team: "home" | "away", value: string) => {
    const numValue = value === "" ? null : parseInt(value, 10);

    if (value !== "" && (isNaN(numValue!) || numValue! < 0 || numValue! > 99))
      return;

    if (team === "home") {
      setHomeScore(value);
      const away = awayScore === "" ? null : parseInt(awayScore, 10);
      onScoreChange(numValue, away);
    } else {
      setAwayScore(value);
      const home = homeScore === "" ? null : parseInt(homeScore, 10);
      onScoreChange(home, numValue);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };

  const homeTeam = teams[match.homeTeam];
  const awayTeam = teams[match.awayTeam];

  const hasResult = match.homeScore !== null && match.awayScore !== null;
  const homeWins = hasResult && match.homeScore! > match.awayScore!;
  const awayWins = hasResult && match.awayScore! > match.homeScore!;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
      >
        <div
          className={`flex items-center gap-2 flex-1 ${
            homeWins ? "opacity-100" : hasResult ? "opacity-60" : ""
          }`}
        >
          <TeamFlag teamId={match.homeTeam} size="sm" />
          <span className="text-sm font-medium truncate">
            {homeTeam?.code || "TBD"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={homeScore}
            onChange={(e) => handleScoreChange("home", e.target.value)}
            className="match-input w-10 h-8 text-sm"
            maxLength={2}
          />
          <span className="text-muted-foreground text-sm">-</span>
          <input
            type="text"
            inputMode="numeric"
            value={awayScore}
            onChange={(e) => handleScoreChange("away", e.target.value)}
            className="match-input w-10 h-8 text-sm"
            maxLength={2}
          />
        </div>

        <div
          className={`flex items-center gap-2 flex-1 justify-end ${
            awayWins ? "opacity-100" : hasResult ? "opacity-60" : ""
          }`}
        >
          <span className="text-sm font-medium truncate">
            {awayTeam?.code || "TBD"}
          </span>
          <TeamFlag teamId={match.awayTeam} size="sm" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.01 }}
      className="glass-card p-4 hover-lift"
    >
      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-3">
        <Calendar className="w-3 h-3" />
        <span>{formatDate(match.date)}</span>
        {match.matchNumber && (
          <span className="ml-2 px-2 py-0.5 bg-secondary rounded-full">
            Match {match.matchNumber}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Home Team */}
        <div
          className={`flex flex-col items-center gap-2 flex-1 transition-opacity ${
            homeWins ? "opacity-100" : hasResult ? "opacity-50" : ""
          }`}
        >
          <TeamFlag teamId={match.homeTeam} size="lg" />
          <span className="text-sm font-semibold text-center">
            {homeTeam?.name || "Por definir"}
          </span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            inputMode="numeric"
            value={homeScore}
            onChange={(e) => handleScoreChange("home", e.target.value)}
            className="match-input"
            placeholder="-"
            maxLength={2}
          />
          <span className="text-2xl font-bold text-muted-foreground">:</span>
          <input
            type="text"
            inputMode="numeric"
            value={awayScore}
            onChange={(e) => handleScoreChange("away", e.target.value)}
            className="match-input"
            placeholder="-"
            maxLength={2}
          />
        </div>

        {/* Away Team */}
        <div
          className={`flex flex-col items-center gap-2 flex-1 transition-opacity ${
            awayWins ? "opacity-100" : hasResult ? "opacity-50" : ""
          }`}
        >
          <TeamFlag teamId={match.awayTeam} size="lg" />
          <span className="text-sm font-semibold text-center">
            {awayTeam?.name || "Por definir"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MatchCard;
