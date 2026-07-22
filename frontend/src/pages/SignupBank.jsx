import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Droplet, Info } from "lucide-react";

function SignupBank() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const { signupBank, isLoading } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signupBank(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <Droplet className="w-6 h-6 text-crimson" fill="currentColor" />
          <span className="font-display font-semibold text-xl tracking-tight">BloodConnect</span>
        </div>

        <div className="card">
          <h1 className="font-display text-2xl font-semibold mb-1">Register your blood bank</h1>
          <p className="text-sm text-slate mb-6">Manage inventory and reach donors when it matters.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-text mb-1.5 block">Organization name</label>
              <input
                type="text"
                placeholder="e.g. City Blood Bank"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
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
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                required
                minLength={6}
              />
            </div>

            <div className="flex gap-2 bg-amber-light border border-amber/30 rounded-md p-3">
              <Info className="w-4 h-4 text-amber shrink-0 mt-0.5" />
              <p className="text-xs text-ink/70">
                New accounts need manual verification before appearing in donor searches.
              </p>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? "Registering…" : "Register bank"}
            </button>
          </form>
        </div>

        <p className="text-sm text-center text-slate mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-crimson font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupBank;