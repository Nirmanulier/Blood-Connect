import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { MapPin, Droplet, Calendar, History } from "lucide-react";
import Layout from "../components/Layout";
import BloodBadge from "../components/BloodBadge";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function DonorDashboard() {
  const { authUser } = useAuthStore();
  const [coords, setCoords] = useState(null);
  const [banks, setBanks] = useState([]);
  const [searchedGroup, setSearchedGroup] = useState(null);
  const [requestForm, setRequestForm] = useState({ bloodGroup: "", urgency: "medium" });
  const [isSearching, setIsSearching] = useState(false);
  const [camps, setCamps] = useState([]);
  const [donations, setDonations] = useState([]);
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lng: pos.coords.longitude, lat: pos.coords.latitude }),
      () => {
        setLocationDenied(true);
        if (!sessionStorage.getItem("locationDenied")) {
          toast.error("Location access denied — needed for donor matching", { id: "location-toast" });
          sessionStorage.setItem("locationDenied", "true");
        }
      }
    );
    fetchDonations();
  }, []);

  useEffect(() => {
    if (coords) fetchCamps();
  }, [coords]);

  const saveLocation = async () => {
    if (!coords) return toast.error("Location not available yet");
    try {
      await axiosInstance.put("/users/location", coords);
      toast.success("Location updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update location");
    }
  };

  const searchNearbyBanks = async (bloodGroup) => {
    if (!coords) return toast.error("Location not available yet");
    setSearchedGroup(bloodGroup);
    setIsSearching(true);
    try {
      const res = await axiosInstance.get("/banks/search", {
        params: { bloodGroup, lng: coords.lng, lat: coords.lat },
      });
      setBanks(res.data);
      if (res.data.length === 0) toast("No banks found with that stock nearby");
    } catch (error) {
      toast.error(error.response?.data?.message || "Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  const createRequest = async (e) => {
    e.preventDefault();
    if (!coords) return toast.error("Location not available yet");
    try {
      const res = await axiosInstance.post("/requests", { ...requestForm, ...coords });
      toast.success(`Request created — ${res.data.matchingDonors.length} donors nearby`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create request");
    }
  };

  const fetchCamps = async () => {
    try {
      const res = await axiosInstance.get("/camps", { params: { lng: coords.lng, lat: coords.lat } });
      setCamps(res.data);
    } catch (error) {
      toast.error("Failed to load camps");
    }
  };

  const fetchDonations = async () => {
    try {
      const res = await axiosInstance.get("/donations/me");
      setDonations(res.data);
    } catch (error) {
      toast.error("Failed to load donation history");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome + location */}
        <div className="card flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold">Hi, {authUser?.name}</h1>
            <p className="text-sm text-slate mt-0.5">Ready to help someone nearby today.</p>
          </div>
          <button
            onClick={saveLocation}
            className="flex items-center gap-1.5 text-sm border border-ink/15 rounded-md px-3 py-2 hover:border-crimson/40 hover:text-crimson transition-colors shrink-0"
          >
            <MapPin className="w-4 h-4" />
            {coords ? "Update location" : locationDenied ? "Enable location" : "Locating…"}
          </button>
        </div>

        {/* Search banks */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Droplet className="w-4 h-4 text-crimson" />
            <h2 className="font-display text-lg font-semibold">Find blood nearby</h2>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-4">
            {BLOOD_GROUPS.map((bg) => (
              <BloodBadge
                key={bg}
                group={bg}
                selected={searchedGroup === bg}
                onClick={() => searchNearbyBanks(bg)}
                size="sm"
              />
            ))}
          </div>

          {isSearching && <p className="text-sm text-slate">Searching nearby banks…</p>}

          {!isSearching && searchedGroup && banks.length === 0 && (
            <p className="text-sm text-slate">
              No verified banks currently stock {searchedGroup} within range. Try creating an urgent
              request below instead.
            </p>
          )}

          {banks.length > 0 && (
            <div className="space-y-2">
              {banks.map((bank) => (
                <div key={bank._id} className="flex items-center justify-between border border-ink/10 rounded-md p-3">
                  <div>
                    <p className="font-medium text-sm">{bank.name}</p>
                    <p className="text-xs text-verified">Verified bank</p>
                  </div>
                  <span className="font-mono text-sm text-slate">
                    {bank.inventory?.[searchedGroup] ?? 0} units
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create request */}
        <form onSubmit={createRequest} className="card space-y-4">
          <h2 className="font-display text-lg font-semibold">Create an urgent request</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-text mb-1.5 block">Blood group</label>
              <select
                value={requestForm.bloodGroup}
                onChange={(e) => setRequestForm({ ...requestForm, bloodGroup: e.target.value })}
                className="input-field"
                required
              >
                <option value="">Select</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-text mb-1.5 block">Urgency</label>
              <select
                value={requestForm.urgency}
                onChange={(e) => setRequestForm({ ...requestForm, urgency: e.target.value })}
                className="input-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary">Submit request</button>
        </form>

        {/* Nearby camps */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-crimson" />
            <h2 className="font-display text-lg font-semibold">Nearby camps</h2>
          </div>
          {camps.length === 0 ? (
            <p className="text-sm text-slate">No upcoming camps found nearby yet — check back soon.</p>
          ) : (
            <div className="space-y-2">
              {camps.map((camp) => (
                <div key={camp._id} className="border border-ink/10 rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-sm">{camp.title}</p>
                    <span className="text-xs font-mono text-slate">
                      {new Date(camp.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate mt-0.5">{camp.address}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {camp.neededGroups?.map((g) => (
                      <span key={g} className="text-xs font-mono bg-crimson-light text-crimson-dark px-1.5 py-0.5 rounded">
                        {g}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate/70 mt-2">by {camp.organizedBy?.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Donation history */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-4 h-4 text-crimson" />
            <h2 className="font-display text-lg font-semibold">My donation history</h2>
          </div>
          {donations.length === 0 ? (
            <p className="text-sm text-slate">
              No donations logged yet. Once a bank records a donation, it'll show up here.
            </p>
          ) : (
            <div className="space-y-2">
              {donations.map((d) => (
                <div key={d._id} className="flex justify-between items-center border border-ink/10 rounded-md p-3">
                  <div>
                    <p className="font-medium text-sm">{d.bloodBank?.name}</p>
                    <p className="text-xs text-slate">{new Date(d.date).toLocaleDateString()}</p>
                  </div>
                  <span className="font-mono text-sm">{d.units} unit(s)</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default DonorDashboard;