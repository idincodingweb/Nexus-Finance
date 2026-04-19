import { ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, ListOrdered, User, LogOut, Settings as SettingsIcon } from "lucide-react"; 
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/transactions", label: "Transaksi", icon: ListOrdered },
  { to: "/about", label: "About", icon: User },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    const yakin = window.confirm("Yakin kamu mau logout? 😆");
    if (yakin) {
      localStorage.removeItem("nexus_user");
      toast.success("Berhasil keluar. Sampai jumpa lagi!");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 md:pl-64">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card md:flex">
        <div className="flex items-center gap-3 border-b border-border px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-border/50">
            <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-foreground">Nexus Finance</p>
            <p className="text-xs text-muted-foreground">Cash flow manager</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-card-soft"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors mt-4"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </nav>
        <div className="border-t border-border p-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Nexus Finance
        </div>
      </aside>

      {/* Mobile top header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-border/50">
            <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
          </div>
          <p className="text-sm font-bold text-foreground">Nexus Finance</p>
        </div>
        {/* JEBRED! Tombol Actions (Settings + Theme) */}
        <ThemeToggleInline />
      </header>

      {/* Desktop floating actions */}
      <div className="fixed right-5 top-5 z-30 hidden md:block">
        <ThemeToggleInline />
      </div>

      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}

          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 py-3 text-xs font-medium text-muted-foreground hover:text-red-500 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}

// KOMPONEN AKSI ATAS (SETTINGS + THEME TOGGLE)
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

function ThemeToggleInline() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-1 rounded-full bg-muted p-1 shadow-sm border border-border/50">
      {/* JEBRED! Tombol Settings baru */}
      <Button
        variant="ghost"
        size="icon"
        aria-label="Settings"
        onClick={() => navigate("/settings")}
        className="h-8 w-8 rounded-full text-foreground hover:bg-background transition-all"
      >
        <SettingsIcon className="h-4 w-4" />
      </Button>

      {/* Garis pembatas tipis yang estetik */}
      <div className="h-4 w-[1px] bg-border/60 mx-0.5" />

      {/* Tombol Theme Toggle lama */}
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="h-8 w-8 rounded-full text-foreground hover:bg-background transition-all"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </div>
  );
}