import { motion } from "framer-motion";
import KnockoutMatch from "@/components/shared/KnockoutMatch";
import { useTournamentStore } from "@/store/tournamentStore";

const Knockout = () => {
  const { knockoutMatches, updateKnockoutMatch } = useTournamentStore();

  const r16Matches = knockoutMatches.filter((m) => m.stage === "r16");
  const quarterMatches = knockoutMatches.filter((m) => m.stage === "quarter");
  const semiMatches = knockoutMatches.filter((m) => m.stage === "semi");
  const thirdMatch = knockoutMatches.find((m) => m.stage === "third");
  const finalMatch = knockoutMatches.find((m) => m.stage === "final");

  const sections = [
    { title: "Octavos de Final", matches: r16Matches, cols: 4 },
    { title: "Cuartos de Final", matches: quarterMatches, cols: 4 },
    { title: "Semifinales", matches: semiMatches, cols: 2 },
  ];

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
              Fase <span className="gold-text">Eliminatoria</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Simula los resultados de las eliminatorias. Los equipos se
              clasifican automáticamente según los resultados de la fase de
              grupos.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-12">
        {/* Knockout Rounds */}
        {sections.map((section, sectionIndex) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.15 }}
          >
            <h2 className="font-display text-2xl font-bold mb-6 text-center">
              <span className="gold-text">{section.title}</span>
            </h2>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${section.cols} gap-4`}
            >
              {section.matches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <KnockoutMatch
                    match={match}
                    onScoreChange={(homeScore, awayScore) =>
                      updateKnockoutMatch(match.id, homeScore, awayScore)
                    }
                    showStage={false}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}

        {/* Finals Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-display text-2xl font-bold mb-6 text-center">
            <span className="gold-text">Finales</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Third Place */}
            {thirdMatch && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center mb-4">
                  Tercer Puesto
                </h3>
                <KnockoutMatch
                  match={thirdMatch}
                  onScoreChange={(homeScore, awayScore) =>
                    updateKnockoutMatch(thirdMatch.id, homeScore, awayScore)
                  }
                  showStage={false}
                />
              </div>
            )}

            {/* Final */}
            {finalMatch && (
              <div>
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider text-center mb-4">
                  🏆 Final 🏆
                </h3>
                <KnockoutMatch
                  match={finalMatch}
                  onScoreChange={(homeScore, awayScore) =>
                    updateKnockoutMatch(finalMatch.id, homeScore, awayScore)
                  }
                  showStage={false}
                />
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Knockout;
