import { motion } from "framer-motion";
import KnockoutMatch from "@/components/shared/KnockoutMatch";
import { Match } from "@/data/worldCupData";

interface BracketColumnProps {
  title: string;
  matches: Match[];
  onScoreChange: (
    matchId: string,
    homeScore: number | null,
    awayScore: number | null
  ) => void;
  side?: "left" | "right" | "center";
}

const BracketColumn = ({
  title,
  matches,
  onScoreChange,
  side = "center",
}: BracketColumnProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: side === "left" ? -20 : side === "right" ? 20 : 0,
    },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="flex flex-col">
      <h3 className="text-sm font-semibold text-primary uppercase tracking-wider text-center mb-4 sticky top-0 bg-background/80 backdrop-blur-sm py-2 z-10">
        {title}
      </h3>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4 justify-around flex-1"
      >
        {matches.map((match) => (
          <motion.div key={match.id} variants={itemVariants}>
            <KnockoutMatch
              match={match}
              onScoreChange={(homeScore, awayScore) =>
                onScoreChange(match.id, homeScore, awayScore)
              }
              showStage={false}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default BracketColumn;
