import { Link } from "react-router-dom";
import { Droplet } from "lucide-react";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-6">
      <div className="text-center max-w-sm">
        <Droplet className="w-8 h-8 text-crimson mx-auto mb-4" fill="currentColor" />
        <h1 className="font-display text-3xl font-semibold mb-2">Page not found</h1>
        <p className="text-sm text-slate mb-6">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link to="/" className="btn-primary inline-block w-auto px-6">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;