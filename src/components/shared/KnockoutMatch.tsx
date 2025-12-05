import { motion } from "framer-motion";
import TeamFlag from "./TeamFlag";
import { Match, teams } from "@/data/worldCupData";
import { Trophy } from "lucide-react";

interface KnockoutMatchProps {
  match: Match;
  onScoreChange: (homeScore: number | null, awayScore: number | null) => void;
  showStage?: boolean;
  isChampion?: boolean;
}

const stageNames: Record<string, string> = {
  r16: "Octavos de Final",
  quarter: "Cuartos de Final",
  semi: "Semifinal",
  third: "Tercer Puesto",
  final: "Final",
};

const KnockoutMatch = ({
  match,
  onScoreChange,
  showStage = true,
  isChampion = false,
}: KnockoutMatchProps) => {
  const homeTeam = teams[match.homeTeam];
  const awayTeam = teams[match.awayTeam];

  const hasResult = match.homeScore !== null && match.awayScore !== null;
  const homeWins = hasResult && match.homeScore! > match.awayScore!;
  const awayWins = hasResult && match.awayScore! > match.homeScore!;
  const isDraw = hasResult && match.homeScore === match.awayScore;

  const handleChange = (team: "home" | "away", value: string) => {
    const numValue = value === "" ? null : parseInt(value, 10);
    if (value !== "" && (isNaN(numValue!) || numValue! < 0 || numValue! > 99))
      return;

    if (team === "home") {
      onScoreChange(numValue, match.awayScore);
    } else {
      onScoreChange(match.homeScore, numValue);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`glass-card p-4 hover-lift ${
        match.stage === "final" ? "ring-2 ring-primary/50" : ""
      } ${isChampion ? "ring-2 ring-primary animate-pulse-gold" : ""}`}
    >
      {showStage && (
        <div className="flex items-center justify-center gap-2 mb-3">
          {match.stage === "final" && (
            <Trophy className="w-4 h-4 text-primary" />
          )}
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            {stageNames[match.stage]}
          </span>
          {match.stage === "final" && (
            <Trophy className="w-4 h-4 text-primary" />
          )}
        </div>
      )}

      <div className="text-center text-xs text-muted-foreground mb-3">
        {formatDate(match.date)}
      </div>

      {/* Home Team */}
      <div
        className={`flex items-center justify-between p-2 rounded-lg mb-2 transition-all ${
          homeWins
            ? "bg-primary/20"
            : hasResult
            ? "opacity-60"
            : "hover:bg-secondary/30"
        }`}
      >
        <div className="flex items-center gap-2">
          <TeamFlag teamId={match.homeTeam} size="md" />
          <span className="font-medium text-sm">{homeTeam?.code || "TBD"}</span>
        </div>
        <input
          type="text"
          inputMode="numeric"
          value={match.homeScore ?? ""}
          onChange={(e) => handleChange("home", e.target.value)}
          className="match-input w-10 h-8 text-sm"
          placeholder="-"
          maxLength={2}
        />
      </div>

      {/* Away Team */}
      <div
        className={`flex items-center justify-between p-2 rounded-lg transition-all ${
          awayWins
            ? "bg-primary/20"
            : hasResult
            ? "opacity-60"
            : "hover:bg-secondary/30"
        }`}
      >
        <div className="flex items-center gap-2">
          <TeamFlag teamId={match.awayTeam} size="md" />
          <span className="font-medium text-sm">{awayTeam?.code || "TBD"}</span>
        </div>
        <input
          type="text"
          inputMode="numeric"
          value={match.awayScore ?? ""}
          onChange={(e) => handleChange("away", e.target.value)}
          className="match-input w-10 h-8 text-sm"
          placeholder="-"
          maxLength={2}
        />
      </div>

      {/* Draw indicator for knockout */}
      {isDraw && (
        <div className="text-center mt-2 text-xs text-muted-foreground">
          Penales (aleatorio)
        </div>
      )}
    </motion.div>
  );
};

export default KnockoutMatch;
