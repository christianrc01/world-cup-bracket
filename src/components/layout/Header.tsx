import { NavLink } from "react-router-dom";
import { Trophy, Users, GitBranch, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useTournamentStore } from "@/store/tournamentStore";

const Header = () => {
  const { resetAll } = useTournamentStore();

  const navItems = [
    { to: "/", label: "Groups", icon: Users },
    { to: "/knockout", label: "Knockout", icon: GitBranch },
    { to: "/bracket", label: "Bracket", icon: Trophy },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center shadow-gold">
                <Trophy className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="absolute -inset-1 rounded-xl gold-gradient opacity-30 blur-sm group-hover:opacity-50 transition-opacity" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-lg font-bold text-foreground">
                World Cup <span className="gold-text">2026</span>
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">
                USA • MEX • CAN
              </p>
            </div>
          </NavLink>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Reset Button */}
          <button
            onClick={resetAll}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
