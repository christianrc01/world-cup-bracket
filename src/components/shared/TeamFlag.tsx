import { teams } from "@/data/worldCupData";

interface TeamFlagProps {
  teamId: string;
  size?: "sm" | "md" | "lg" | "xl";
  showName?: boolean;
  showCode?: boolean;
}

const sizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-4xl",
};

const TeamFlag = ({
  teamId,
  size = "md",
  showName = false,
  showCode = false,
}: TeamFlagProps) => {
  const team = teams[teamId];

  if (!team) {
    return (
      <div className="flex items-center gap-2">
        <span className={sizeClasses[size]}>🏳️</span>
        {(showName || showCode) && (
          <span className="text-muted-foreground">TBD</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={`${sizeClasses[size]} leading-none`}
        role="img"
        aria-label={team.name}
      >
        {team.flag}
      </span>
      {showName && (
        <span className="font-medium text-foreground">{team.name}</span>
      )}
      {showCode && !showName && (
        <span className="font-medium text-foreground">{team.code}</span>
      )}
    </div>
  );
};

export default TeamFlag;
