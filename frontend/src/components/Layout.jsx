import { useAuthStore } from "../store/useAuthStore";
import { Droplet } from "lucide-react";

function Layout({ children }) {
  const { authUser, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-ink/10 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-crimson" fill="currentColor" />
            <span className="font-display font-semibold text-lg tracking-tight">BloodConnect</span>
          </div>

          {authUser && (
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-end">
              <span className="text-sm text-slate">
                {authUser.name}
                <span className="text-slate/60"> · {authUser.role === "bank" ? "Blood Bank" : "Donor"}</span>
              </span>
              <button onClick={logout} className="text-sm text-slate hover:text-crimson transition-colors">
                Log out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}

export default Layout;