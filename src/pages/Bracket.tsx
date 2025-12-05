import { motion } from "framer-motion";
import { useTournamentStore } from "@/store/tournamentStore";
import TeamFlag from "@/components/shared/TeamFlag";
import { teams } from "@/data/worldCupData";
import { Trophy } from "lucide-react";

const Bracket = () => {
  const { knockoutMatches, updateKnockoutMatch } = useTournamentStore();

  const r16Matches = knockoutMatches.filter((m) => m.stage === "r16");
  const quarterMatches = knockoutMatches.filter((m) => m.stage === "quarter");
  const semiMatches = knockoutMatches.filter((m) => m.stage === "semi");
  const finalMatch = knockoutMatches.find((m) => m.stage === "final");
  const thirdMatch = knockoutMatches.find((m) => m.stage === "third");

  // Split matches for left and right sides
  const leftR16 = r16Matches.slice(0, 4);
  const rightR16 = r16Matches.slice(4, 8);
  const leftQF = quarterMatches.slice(0, 2);
  const rightQF = quarterMatches.slice(2, 4);
  const leftSF = semiMatches.slice(0, 1);
  const rightSF = semiMatches.slice(1, 2);

  const getWinner = (match: typeof finalMatch) => {
    if (!match || match.homeScore === null || match.awayScore === null)
      return null;
    if (match.homeScore > match.awayScore) return match.homeTeam;
    if (match.awayScore > match.homeScore) return match.awayTeam;
    return null;
  };

  const champion = getWinner(finalMatch);

  const BracketMatch = ({
    match,
    showStage = false,
    isFinal = false,
  }: {
    match: typeof finalMatch;
    showStage?: boolean;
    isFinal?: boolean;
  }) => {
    if (!match) return null;

    const homeTeam = teams[match.homeTeam];
    const awayTeam = teams[match.awayTeam];
    const hasResult = match.homeScore !== null && match.awayScore !== null;
    const homeWins = hasResult && match.homeScore! > match.awayScore!;
    const awayWins = hasResult && match.awayScore! > match.homeScore!;

    const handleChange = (team: "home" | "away", value: string) => {
      const numValue = value === "" ? null : parseInt(value, 10);
      if (value !== "" && (isNaN(numValue!) || numValue! < 0 || numValue! > 99))
        return;

      if (team === "home") {
        updateKnockoutMatch(match.id, numValue, match.awayScore);
      } else {
        updateKnockoutMatch(match.id, match.homeScore, numValue);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-card border border-border/50 rounded-lg overflow-hidden min-w-[160px] ${
          isFinal ? "ring-2 ring-primary/50 shadow-gold" : ""
        }`}
      >
        {/* Home */}
        <div
          className={`flex items-center justify-between px-3 py-2 gap-2 border-b border-border/30 ${
            homeWins ? "bg-primary/20" : ""
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <TeamFlag teamId={match.homeTeam} size="sm" />
            <span className="text-xs font-medium truncate">
              {homeTeam?.code || "TBD"}
            </span>
          </div>
          <input
            type="text"
            inputMode="numeric"
            value={match.homeScore ?? ""}
            onChange={(e) => handleChange("home", e.target.value)}
            className="w-8 h-6 text-center text-xs bg-secondary border-0 rounded focus:ring-1 focus:ring-primary"
            placeholder="-"
            maxLength={2}
          />
        </div>
        {/* Away */}
        <div
          className={`flex items-center justify-between px-3 py-2 gap-2 ${
            awayWins ? "bg-primary/20" : ""
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <TeamFlag teamId={match.awayTeam} size="sm" />
            <span className="text-xs font-medium truncate">
              {awayTeam?.code || "TBD"}
            </span>
          </div>
          <input
            type="text"
            inputMode="numeric"
            value={match.awayScore ?? ""}
            onChange={(e) => handleChange("away", e.target.value)}
            className="w-8 h-6 text-center text-xs bg-secondary border-0 rounded focus:ring-1 focus:ring-primary"
            placeholder="-"
            maxLength={2}
          />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-12 mb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Bracket <span className="gold-text">Completo</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Visualiza todo el torneo en formato bracket. Desliza
              horizontalmente en móvil.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Champion Display */}
      {champion && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="container mx-auto px-4 mb-8"
        >
          <div className="glass-card max-w-md mx-auto p-6 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h2 className="font-display text-2xl font-bold mb-2">
              ¡Campeón del Mundo!
            </h2>
            <div className="flex items-center justify-center gap-3">
              <TeamFlag teamId={champion} size="xl" />
              <span className="font-display text-3xl font-bold gold-text">
                {teams[champion]?.name}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bracket */}
      <div className="container mx-auto px-4 overflow-x-auto">
        <div className="min-w-[1100px] py-4">
          {/* Headers */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            <div className="text-center text-xs font-semibold text-primary uppercase tracking-wider">
              Octavos
            </div>
            <div className="text-center text-xs font-semibold text-primary uppercase tracking-wider">
              Cuartos
            </div>
            <div className="text-center text-xs font-semibold text-primary uppercase tracking-wider">
              Semis
            </div>
            <div className="text-center text-xs font-semibold text-primary uppercase tracking-wider">
              Final
            </div>
            <div className="text-center text-xs font-semibold text-primary uppercase tracking-wider">
              Semis
            </div>
            <div className="text-center text-xs font-semibold text-primary uppercase tracking-wider">
              Cuartos
            </div>
            <div className="text-center text-xs font-semibold text-primary uppercase tracking-wider">
              Octavos
            </div>
          </div>

          {/* Bracket Grid */}
          <div className="grid grid-cols-7 gap-4 items-center">
            {/* Left R16 */}
            <div className="flex flex-col gap-6 justify-around">
              {leftR16.map((match) => (
                <BracketMatch key={match.id} match={match} />
              ))}
            </div>

            {/* Left QF */}
            <div className="flex flex-col gap-24 justify-around py-8">
              {leftQF.map((match) => (
                <BracketMatch key={match.id} match={match} />
              ))}
            </div>

            {/* Left SF */}
            <div className="flex flex-col justify-center">
              {leftSF.map((match) => (
                <BracketMatch key={match.id} match={match} />
              ))}
            </div>

            {/* Final & 3rd Place */}
            <div className="flex flex-col gap-8 justify-center items-center">
              <div className="text-center mb-2">
                <Trophy className="w-6 h-6 mx-auto mb-1 text-primary" />
                <span className="text-xs font-semibold text-primary">
                  FINAL
                </span>
              </div>
              {finalMatch && <BracketMatch match={finalMatch} isFinal />}
              <div className="mt-4 text-center">
                <span className="text-xs font-semibold text-muted-foreground">
                  3er Puesto
                </span>
              </div>
              {thirdMatch && <BracketMatch match={thirdMatch} />}
            </div>

            {/* Right SF */}
            <div className="flex flex-col justify-center">
              {rightSF.map((match) => (
                <BracketMatch key={match.id} match={match} />
              ))}
            </div>

            {/* Right QF */}
            <div className="flex flex-col gap-24 justify-around py-8">
              {rightQF.map((match) => (
                <BracketMatch key={match.id} match={match} />
              ))}
            </div>

            {/* Right R16 */}
            <div className="flex flex-col gap-6 justify-around">
              {rightR16.map((match) => (
                <BracketMatch key={match.id} match={match} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bracket;
