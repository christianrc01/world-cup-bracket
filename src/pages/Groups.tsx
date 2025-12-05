import { motion } from "framer-motion";
import GroupCard from "@/components/shared/GroupCard";
import { groups } from "@/data/worldCupData";
import { useTournamentStore } from "@/store/tournamentStore";

const Groups = () => {
  const { groupMatches } = useTournamentStore();

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
              Fase de <span className="gold-text">Grupos</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Simula los resultados de los 48 partidos de la fase de grupos y
              observa cómo se actualizan las clasificaciones en tiempo real.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {groups.map((group, index) => {
            const matches = groupMatches.filter((m) => m.group === group.id);
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GroupCard
                  groupId={group.id}
                  groupName={group.name}
                  matches={matches}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Groups;
