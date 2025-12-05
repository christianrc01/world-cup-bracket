import { motion } from "framer-motion";
import GroupTable from "@/components/shared/GroupTable";
import MatchCard from "@/components/shared/MatchCard";
import { Match } from "@/data/worldCupData";
import { useTournamentStore } from "@/store/tournamentStore";

interface GroupCardProps {
  groupId: string;
  groupName: string;
  matches: Match[];
}

const GroupCard = ({ groupId, groupName, matches }: GroupCardProps) => {
  const { updateGroupMatch, getGroupStandings } = useTournamentStore();
  const standings = getGroupStandings(groupId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card overflow-hidden hover-lift"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border/30 bg-gradient-to-r from-primary/10 to-transparent">
        <h2 className="font-display text-xl font-bold">
          <span className="gold-text">{groupName}</span>
        </h2>
      </div>

      {/* Standings Table */}
      <div className="px-6 py-4">
        <GroupTable standings={standings} groupId={groupId} />
      </div>

      {/* Matches */}
      <div className="px-6 py-4 border-t border-border/30 bg-secondary/20">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Partidos
        </h3>
        <div className="space-y-2">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onScoreChange={(homeScore, awayScore) =>
                updateGroupMatch(match.id, homeScore, awayScore)
              }
              compact
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GroupCard;
