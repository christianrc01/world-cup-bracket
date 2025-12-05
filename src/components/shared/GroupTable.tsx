import { motion } from "framer-motion";
import TeamFlag from "./TeamFlag";
import { teams } from "@/data/worldCupData";

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

interface GroupTableProps {
  standings: TeamStanding[];
  groupId: string;
}

const GroupTable = ({ standings, groupId }: GroupTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-xs text-muted-foreground uppercase tracking-wider">
            <th className="text-left py-3 px-2">#</th>
            <th className="text-left py-3 px-2">Equipo</th>
            <th className="text-center py-3 px-1 hidden sm:table-cell">PJ</th>
            <th className="text-center py-3 px-1 hidden sm:table-cell">G</th>
            <th className="text-center py-3 px-1 hidden sm:table-cell">E</th>
            <th className="text-center py-3 px-1 hidden sm:table-cell">P</th>
            <th className="text-center py-3 px-1 hidden md:table-cell">GF</th>
            <th className="text-center py-3 px-1 hidden md:table-cell">GC</th>
            <th className="text-center py-3 px-1">DG</th>
            <th className="text-center py-3 px-2 font-bold">PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing, index) => {
            const team = teams[standing.teamId];
            const qualifies = index < 2;

            return (
              <motion.tr
                key={standing.teamId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border-t border-border/30 transition-colors ${
                  qualifies ? "bg-primary/5" : ""
                }`}
              >
                <td className="py-3 px-2">
                  <span
                    className={`position-badge ${
                      index === 0
                        ? "position-1"
                        : index === 1
                        ? "position-2"
                        : index === 2
                        ? "position-3"
                        : "position-4"
                    }`}
                  >
                    {index + 1}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <TeamFlag teamId={standing.teamId} size="sm" />
                    <span className="font-medium text-sm sm:text-base">
                      <span className="hidden sm:inline">{team?.name}</span>
                      <span className="sm:hidden">{team?.code}</span>
                    </span>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-sm text-muted-foreground hidden sm:table-cell">
                  {standing.played}
                </td>
                <td className="text-center py-3 px-1 text-sm text-muted-foreground hidden sm:table-cell">
                  {standing.won}
                </td>
                <td className="text-center py-3 px-1 text-sm text-muted-foreground hidden sm:table-cell">
                  {standing.drawn}
                </td>
                <td className="text-center py-3 px-1 text-sm text-muted-foreground hidden sm:table-cell">
                  {standing.lost}
                </td>
                <td className="text-center py-3 px-1 text-sm text-muted-foreground hidden md:table-cell">
                  {standing.goalsFor}
                </td>
                <td className="text-center py-3 px-1 text-sm text-muted-foreground hidden md:table-cell">
                  {standing.goalsAgainst}
                </td>
                <td className="text-center py-3 px-1 text-sm">
                  <span
                    className={
                      standing.goalDifference > 0
                        ? "text-green-400"
                        : standing.goalDifference < 0
                        ? "text-red-400"
                        : "text-muted-foreground"
                    }
                  >
                    {standing.goalDifference > 0 ? "+" : ""}
                    {standing.goalDifference}
                  </span>
                </td>
                <td className="text-center py-3 px-2">
                  <span className="font-bold text-lg gold-text">
                    {standing.points}
                  </span>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/30">
        <div className="w-3 h-3 rounded-full bg-primary/30" />
        <span className="text-xs text-muted-foreground">
          Clasifican a octavos de final
        </span>
      </div>
    </div>
  );
};

export default GroupTable;
