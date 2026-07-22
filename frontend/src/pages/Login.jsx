import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Droplet } from "lucide-react";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "", role: "donor" });
  const { login, isLoading } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <Droplet className="w-6 h-6 text-crimson" fill="currentColor" />
          <span className="font-display font-semibold text-xl tracking-tight">BloodConnect</span>
        </div>

        <div className="card">
          <h1 className="font-display text-2xl font-semibold mb-1">Welcome back</h1>
          <p className="text-sm text-slate mb-6">Log in to find or offer blood, faster.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-text mb-1.5 block">I am a</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "donor" })}
                  className={`rounded-md border py-2 text-sm font-medium transition-colors ${
                    formData.role === "donor"
                      ? "bg-crimson text-white border-crimson"
                      : "border-ink/15 hover:border-crimson/40"
                  }`}
                >
                  Donor
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "bank" })}
                  className={`rounded-md border py-2 text-sm font-medium transition-colors ${
                    formData.role === "bank"
                      ? "bg-crimson text-white border-crimson"
                      : "border-ink/15 hover:border-crimson/40"
                  }`}
                >
                  Blood Bank
                </button>
              </div>
            </div>

            <div>
              <label className="label-text mb-1.5 block">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label-text mb-1.5 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? "Logging in…" : "Log in"}
            </button>
          </form>
        </div>

        <p className="text-sm text-center text-slate mt-6">
          New donor?{" "}
          <Link to="/signup/donor" className="text-crimson font-medium hover:underline">
            Sign up
          </Link>
          {" · "}
          New blood bank?{" "}
          <Link to="/signup/bank" className="text-crimson font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;