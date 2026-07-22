import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { MapPin, AlertTriangle, Megaphone, Calendar, ClipboardCheck } from "lucide-react";
import Layout from "../components/Layout";
import BloodBadge from "../components/BloodBadge";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function BankDashboard() {
  const { authUser } = useAuthStore();
  const [coords, setCoords] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [updateForm, setUpdateForm] = useState({ bloodGroup: "", units: "" });
  const [broadcastForm, setBroadcastForm] = useState({ bloodGroup: "", address: "" });
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [campForm, setCampForm] = useState({ title: "", address: "", date: "", neededGroups: [] });
  const [donationForm, setDonationForm] = useState({ donorId: "", units: 1 });
  const [locationDenied, setLocationDenied] = useState(false)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lng: pos.coords.longitude, lat: pos.coords.latitude }),
      () => {
        if (!sessionStorage.getItem("locationDenied")) {
          toast.error("Location access denied — needed for donor matching", { id: "location-toast" });
          sessionStorage.setItem("locationDenied", "true");
        }
      }
    );
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axiosInstance.get("/banks/inventory/me");
      setInventory(res.data);
    } catch (error) {
      toast.error("Failed to load inventory");
    }
  };

  const saveLocation = async () => {
    if (!coords) return toast.error("Location not available yet");
    try {
      await axiosInstance.put("/banks/location", coords);
      toast.success("Location updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update location");
    }
  };

  const handleUpdateInventory = async (e) => {
    e.preventDefault();
    if (!updateForm.bloodGroup || updateForm.units === "") return;
    try {
      const res = await axiosInstance.put("/banks/inventory", {
        bloodGroup: updateForm.bloodGroup,
        units: parseInt(updateForm.units),
      });
      setInventory((prev) => ({ ...prev, inventory: res.data }));
      toast.success(`${updateForm.bloodGroup} stock updated`);
      setUpdateForm({ bloodGroup: "", units: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.bloodGroup) return;
    setIsBroadcasting(true);
    try {
      const res = await axiosInstance.post("/banks/broadcast", broadcastForm);
      toast.success(`Notified ${res.data.notified} donor(s)`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Broadcast failed");
    } finally {
      setIsBroadcasting(false);
    }
  };

  const toggleNeededGroup = (bg) => {
    setCampForm((prev) => ({
      ...prev,
      neededGroups: prev.neededGroups.includes(bg)
        ? prev.neededGroups.filter((g) => g !== bg)
        : [...prev.neededGroups, bg],
    }));
  };

  const handleCreateCamp = async (e) => {
    e.preventDefault();
    if (!coords) return toast.error("Location not available yet");
    try {
      await axiosInstance.post("/camps", { ...campForm, ...coords });
      toast.success("Camp created");
      setCampForm({ title: "", address: "", date: "", neededGroups: [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create camp");
    }
  };

  const handleLogDonation = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/donations", donationForm);
      toast.success("Donation logged");
      setDonationForm({ donorId: "", units: 1 });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to log donation");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome + location */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="font-display text-2xl font-semibold">{authUser?.name}</h1>
              <p className="text-sm text-slate mt-0.5">Keep your stock current so donors can find it.</p>
            </div>
            <button
              onClick={saveLocation}
              className="flex items-center gap-1.5 text-sm border border-ink/15 rounded-md px-3 py-2 hover:border-crimson/40 hover:text-crimson transition-colors shrink-0"
            >
              <MapPin className="w-4 h-4" />
              {coords ? "Update location" : locationDenied ? "Enable location" : "Locating…"}
            </button>
          </div>

          {inventory && !inventory.verified && (
            <div className="flex gap-2 bg-amber-light border border-amber/30 rounded-md p-3">
              <AlertTriangle className="w-4 h-4 text-amber shrink-0 mt-0.5" />
              <p className="text-xs text-ink/70">
                Your account isn't verified yet — you won't appear in donor searches until an admin verifies you.
              </p>
            </div>
          )}
        </div>

        {/* Inventory grid */}
        <div className="card">
          <h2 className="font-display text-lg font-semibold mb-4">Current inventory</h2>
          {inventory ? (
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_GROUPS.map((bg) => {
                const units = inventory.inventory?.[bg] ?? 0;
                const low = units <= 2;
                return (
                  <div
                    key={bg}
                    className={`rounded-md border p-3 text-center ${
                      low ? "border-amber/40 bg-amber-light" : "border-ink/10 bg-white"
                    }`}
                  >
                    <p className="font-mono font-medium text-sm">{bg}</p>
                    <p className={`text-xs mt-1 ${low ? "text-amber" : "text-slate"}`}>
                      {units} unit{units !== 1 ? "s" : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate">Loading inventory…</p>
          )}
        </div>

        {/* Update stock */}
        <form onSubmit={handleUpdateInventory} className="card space-y-4">
          <h2 className="font-display text-lg font-semibold">Update stock</h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {BLOOD_GROUPS.map((bg) => (
              <BloodBadge
                key={bg}
                group={bg}
                selected={updateForm.bloodGroup === bg}
                onClick={() => setUpdateForm({ ...updateForm, bloodGroup: bg })}
                size="sm"
              />
            ))}
          </div>

          {updateForm.bloodGroup && (
            <p className="text-xs text-slate">
              Current stock for <span className="font-mono font-medium text-ink">{updateForm.bloodGroup}</span>:{" "}
              <span className="font-mono">{inventory?.inventory?.[updateForm.bloodGroup] ?? 0} units</span>
            </p>
          )}

          <input
            type="number"
            placeholder="Units to add (use a negative number to reduce)"
            value={updateForm.units}
            onChange={(e) => setUpdateForm({ ...updateForm, units: e.target.value })}
            className="input-field"
            required
          />
          <button type="submit" className="btn-secondary">Update stock</button>
        </form>

        {/* Broadcast */}
        <form onSubmit={handleBroadcast} className="card space-y-4">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-crimson" />
            <h2 className="font-display text-lg font-semibold">Broadcast urgent need</h2>
          </div>
          <select
            value={broadcastForm.bloodGroup}
            onChange={(e) => setBroadcastForm({ ...broadcastForm, bloodGroup: e.target.value })}
            className="input-field"
            required
          >
            <option value="">Select blood group needed</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Address to show donors"
            value={broadcastForm.address}
            onChange={(e) => setBroadcastForm({ ...broadcastForm, address: e.target.value })}
            className="input-field"
          />
          <button type="submit" disabled={isBroadcasting} className="btn-primary">
            {isBroadcasting ? "Sending…" : "Send urgent alert"}
          </button>
        </form>

        {/* Create camp */}
        <form onSubmit={handleCreateCamp} className="card space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-crimson" />
            <h2 className="font-display text-lg font-semibold">Organize a camp</h2>
          </div>
          <input
            type="text"
            placeholder="Camp title"
            value={campForm.title}
            onChange={(e) => setCampForm({ ...campForm, title: e.target.value })}
            className="input-field"
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={campForm.address}
            onChange={(e) => setCampForm({ ...campForm, address: e.target.value })}
            className="input-field"
            required
          />
          <input
            type="date"
            value={campForm.date}
            onChange={(e) => setCampForm({ ...campForm, date: e.target.value })}
            className="input-field"
            required
          />
          <div>
            <label className="label-text mb-2 block">Blood groups needed</label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {BLOOD_GROUPS.map((bg) => (
                <BloodBadge
                  key={bg}
                  group={bg}
                  selected={campForm.neededGroups.includes(bg)}
                  onClick={() => toggleNeededGroup(bg)}
                  size="sm"
                />
              ))}
            </div>
          </div>
          <button type="submit" className="btn-primary">Create camp</button>
        </form>

        {/* Log donation */}
        <form onSubmit={handleLogDonation} className="card space-y-4">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-crimson" />
            <h2 className="font-display text-lg font-semibold">Log a completed donation</h2>
          </div>
          <input
            type="text"
            placeholder="Donor ID"
            value={donationForm.donorId}
            onChange={(e) => setDonationForm({ ...donationForm, donorId: e.target.value })}
            className="input-field"
            required
          />
          <input
            type="number"
            min="1"
            placeholder="Units"
            value={donationForm.units}
            onChange={(e) => setDonationForm({ ...donationForm, units: parseInt(e.target.value) })}
            className="input-field"
          />
          <button type="submit" className="btn-secondary">Log donation</button>
        </form>
      </div>
    </Layout>
  );
}

export default BankDashboard;