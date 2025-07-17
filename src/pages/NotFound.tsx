
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-8 text-center">
      <h1 className="mb-6 text-6xl font-bold text-white">404</h1>
      <p className="mb-8 text-xl text-gray-400">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="rounded-md bg-violet px-6 py-2 text-white transition-colors hover:bg-violet/80"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
