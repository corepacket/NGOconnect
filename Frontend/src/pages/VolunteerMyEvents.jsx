import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { HiCalendar, HiClock, HiLocationMarker, HiBookmark, HiCheckCircle } from "react-icons/hi";
import {
  fetchVolunteerApplications,
  fetchVolunteerSavedEvents,
  toggleSaveEvent,
} from "../service/event.service";

const statusClass = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const VolunteerMyEvents = () => {
  const [activeTab, setActiveTab] = useState("registered");
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [registrationRes, savedRes] = await Promise.all([
        fetchVolunteerApplications(),
        fetchVolunteerSavedEvents(),
      ]);
      setRegistrations(Array.isArray(registrationRes?.registrations) ? registrationRes.registrations : []);
      setSavedEvents(Array.isArray(savedRes?.savedEvents) ? savedRes.savedEvents : []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not load your volunteer data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const registered = useMemo(
    () => registrations.filter((item) => !item.isPast || item.status === "pending"),
    [registrations]
  );
  const history = useMemo(
    () => registrations.filter((item) => item.isPast || item.status === "rejected"),
    [registrations]
  );

  const handleToggleSave = async (eventId) => {
    try {
      await toggleSaveEvent(eventId);
      setSavedEvents((prev) => prev.filter((event) => event._id !== eventId));
      toast.success("Removed from saved events");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update saved list");
    }
  };

  const renderRegistrationCard = (item) => {
    const event = item.event || {};
    return (
      <div key={item._id} className="rounded-xl border border-earth-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-earth-900">{event.title || "Event"}</h3>
            <p className="text-sm text-earth-600">{event.ngo?.name || "NGO"}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusClass[item.status] || "bg-gray-100 text-gray-700"}`}>
            {item.status}
          </span>
        </div>
        <div className="mt-3 grid sm:grid-cols-3 gap-3 text-sm text-earth-600">
          <div className="flex items-center gap-1">
            <HiCalendar className="w-4 h-4" />
            <span>{event.date ? new Date(event.date).toLocaleDateString() : "Date TBD"}</span>
          </div>
          <div className="flex items-center gap-1">
            <HiLocationMarker className="w-4 h-4" />
            <span>{event.location || "Location TBD"}</span>
          </div>
          <div className="flex items-center gap-1">
            <HiClock className="w-4 h-4" />
            <span>Applied: {item.appliedAt ? new Date(item.appliedAt).toLocaleDateString() : "N/A"}</span>
          </div>
        </div>
        {item.message ? <p className="mt-3 text-sm text-earth-500">Your note: {item.message}</p> : null}
        <div className="mt-4">
          <Link to={`/events/${event._id}`} className="text-sm font-semibold text-primary-600 hover:text-primary-700">
            View event details
          </Link>
        </div>
      </div>
    );
  };

  const renderSavedCard = (event) => (
    <div key={event._id} className="rounded-xl border border-earth-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-earth-900">{event.title}</h3>
      <p className="text-sm text-earth-600">{event.ngo?.name || "NGO"}</p>
      <div className="mt-3 text-sm text-earth-600 space-y-1">
        <div className="flex items-center gap-1">
          <HiCalendar className="w-4 h-4" />
          <span>{event.date ? new Date(event.date).toLocaleDateString() : "Date TBD"}</span>
        </div>
        <div className="flex items-center gap-1">
          <HiLocationMarker className="w-4 h-4" />
          <span>{event.location || "Location TBD"}</span>
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <Link to={`/events/${event._id}`} className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium">
          View Event
        </Link>
        <button
          type="button"
          onClick={() => handleToggleSave(event._id)}
          className="px-4 py-2 rounded-lg border border-earth-200 text-earth-700 text-sm font-medium"
        >
          Remove
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-earth-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-display font-bold text-earth-900">My Volunteer Events</h1>
          <p className="text-earth-600 mt-2">
            Track your application status, saved opportunities, and completed history from one place.
          </p>
        </motion.div>

        <div className="mb-6 border-b border-earth-200">
          <nav className="flex gap-8">
            {["registered", "saved", "history"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pb-3 capitalize font-medium ${
                  activeTab === tab ? "text-primary-600 border-b-2 border-primary-600" : "text-earth-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {loading ? (
          <div className="text-center py-12 text-earth-500">Loading your data...</div>
        ) : (
          <div className="space-y-4">
            {activeTab === "registered" && (
              registered.length > 0 ? registered.map(renderRegistrationCard) : (
                <div className="rounded-xl bg-white p-8 text-center border border-earth-200">
                  <HiCheckCircle className="w-10 h-10 mx-auto text-earth-400 mb-3" />
                  <p className="text-earth-700 font-medium">No active applications yet.</p>
                  <Link to="/events" className="inline-flex mt-4 px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold">
                    Browse events
                  </Link>
                </div>
              )
            )}

            {activeTab === "saved" && (
              savedEvents.length > 0 ? savedEvents.map(renderSavedCard) : (
                <div className="rounded-xl bg-white p-8 text-center border border-earth-200">
                  <HiBookmark className="w-10 h-10 mx-auto text-earth-400 mb-3" />
                  <p className="text-earth-700 font-medium">You have no saved events.</p>
                  <Link to="/events" className="inline-flex mt-4 px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold">
                    Find events
                  </Link>
                </div>
              )
            )}

            {activeTab === "history" && (
              history.length > 0 ? history.map(renderRegistrationCard) : (
                <div className="rounded-xl bg-white p-8 text-center border border-earth-200">
                  <p className="text-earth-700 font-medium">No completed/rejected history yet.</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerMyEvents;
