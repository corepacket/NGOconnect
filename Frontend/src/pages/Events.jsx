import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { HiCalendar, HiSparkles } from "react-icons/hi";
import EventCard from "../components/EventCard";
import { fetchEvents } from "../service/event.service";
import { useAuth } from "../auth/AuthContext";

const Events = () => {
  const { userType, isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <div className="min-h-screen bg-earth-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-earth-900 mb-4">
            Discover <span className="gradient-text">Volunteer Opportunities</span>
          </h1>
          <p className="text-earth-600 max-w-2xl mx-auto">
            Find events that match your skills and interests. Make a difference in your community.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-earth-100 animate-pulse"
              >
                <div className="h-48 bg-earth-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-earth-200 rounded w-3/4" />
                  <div className="h-4 bg-earth-100 rounded w-full" />
                  <div className="h-4 bg-earth-100 rounded w-5/6" />
                  <div className="h-10 bg-earth-200 rounded-lg mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl border border-earth-100 px-8 py-12 text-center">
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary-100/80 blur-2xl" />
              <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-secondary-100/80 blur-2xl" />
              <div className="relative">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg">
                  <HiCalendar className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-display font-bold text-earth-900 mb-2">No events listed yet</h2>
                <p className="text-earth-600 text-sm leading-relaxed mb-6">
                  The calendar is empty because no NGO has published an opportunity. If you represent an organization, you can be the first to post one.
                </p>
                {userType === "ngo" && isAuthenticated ? (
                  <Link
                    to="/events/new"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
                  >
                    <HiSparkles className="w-5 h-5" />
                    Post an event
                  </Link>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
                    <Link
                      to="/register-ngo"
                      className="inline-flex justify-center items-center px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700"
                    >
                      Register your NGO
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex justify-center items-center px-5 py-2.5 rounded-xl border border-earth-200 text-earth-800 text-sm font-medium hover:bg-earth-50"
                    >
                      NGO login to post
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;