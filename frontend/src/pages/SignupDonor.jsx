import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Droplet } from "lucide-react";
import BloodBadge from "../components/BloodBadge";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function SignupDonor() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bloodGroup: "",
  });
  const { signupDonor, isLoading } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.bloodGroup) return;
    signupDonor(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <Droplet className="w-6 h-6 text-crimson" fill="currentColor" />
          <span className="font-display font-semibold text-xl tracking-tight">BloodConnect</span>
        </div>

        <div className="card">
          <h1 className="font-display text-2xl font-semibold mb-1">Become a donor</h1>
          <p className="text-sm text-slate mb-6">Someone nearby may need you sooner than you think.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-text mb-1.5 block">Full name</label>
              <input
                type="text"
                placeholder="Your name"
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

            <div>
              <label className="label-text mb-2 block">Blood group</label>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map((bg) => (
                  <BloodBadge
                    key={bg}
                    group={bg}
                    selected={formData.bloodGroup === bg}
                    onClick={() => setFormData({ ...formData, bloodGroup: bg })}
                    size="sm"
                  />
                ))}
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? "Creating account…" : "Sign up as donor"}
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

export default SignupDonor;