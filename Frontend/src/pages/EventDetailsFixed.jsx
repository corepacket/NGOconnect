import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiCalendar,
  HiLocationMarker,
  HiUserGroup,
  HiClock,
  HiCheckCircle,
} from "react-icons/hi";
import { format } from "date-fns";
import toast from "react-hot-toast";
import VolunteerList from "../components/VolunteerList";
import { fetchEventById, volunteerForEvent } from "../service/event.service";
import { saveEvent, unsaveEvent, getSavedEvents } from "../service/user.service";
import { useAuth } from "../auth/AuthContext";
import { normalizeEvent } from "../lib/event-utils";

const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='500' viewBox='0 0 1200 500'%3E%3Crect fill='%23f3f4f6' width='1200' height='500'/%3E%3Ctext fill='%236b7280' font-family='Arial' font-size='24' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EEvent Image%3C/text%3E%3C/svg%3E";
const fallbackLogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3Ctext fill='%236b7280' font-family='Arial' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENGO%3C/text%3E%3C/svg%3E";

const EventDetailsFixed = () => {
  const { id } = useParams();
  const { isAuthenticated, userType } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        const data = await fetchEventById(id);
        setEvent(normalizeEvent(data));
        
        // Check if event is saved by the user
        if (isAuthenticated && userType === "volunteer") {
          try {
            const savedEventsData = await getSavedEvents();
            const savedEvents = savedEventsData.events || [];
            setIsSaved(savedEvents.some(savedEvent => savedEvent._id === id));
          } catch (err) {
            console.error("Failed to check saved status:", err);
          }
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadEvent();
  }, [id, isAuthenticated, userType]);

  const ngo = event?.organization || {};
  const volunteers = Array.isArray(event?.volunteers) ? event.volunteers : [];
  const requirements = Array.isArray(event?.requirements) ? event.requirements : [];
  const benefits = Array.isArray(event?.benefits) ? event.benefits : [];
  const skillsRequired = Array.isArray(event?.skillsRequired) ? event.skillsRequired : [];

  const maxVolunteers = Number(event?.maxVolunteers || 0);
  const currentVolunteers = volunteers.length;
  const spotsLeft = Math.max(maxVolunteers - currentVolunteers, 0);

  const eventDateText = useMemo(() => {
    if (!event?.date) return "N/A";
    try {
      return format(new Date(event.date), "MMM dd, yyyy");
    } catch {
      return "N/A";
    }
  }, [event?.date]);

  const handleApply = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login first");
      return;
    }
    if (userType !== "volunteer") {
      toast.error("Only volunteers can apply for events");
      return;
    }

    try {
      setIsApplying(true);
      await volunteerForEvent(id);
      toast.success("Applied successfully");

      const refreshed = await fetchEventById(id);
      setEvent(normalizeEvent(refreshed));

      setApplicationMessage("");
      setShowApplicationForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Application failed");
    } finally {
      setIsApplying(false);
    }
  };

  const handleSaveEvent = async () => {
    if (!isAuthenticated) {
      toast.error("Please login first");
      return;
    }
    if (userType !== "volunteer") {
      toast.error("Only volunteers can save events");
      return;
    }

    try {
      setIsSaving(true);
      
      if (isSaved) {
        await unsaveEvent(id);
        toast.success("Event removed from saved events");
        setIsSaved(false);
      } else {
        await saveEvent(id);
        toast.success("Event saved successfully");
        setIsSaved(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save event");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-24 text-center text-earth-600">Loading event...</div>;
  }

  if (!event) {
    return <div className="min-h-screen pt-24 text-center text-earth-600">Event not found.</div>;
  }

  return (
    <div className="min-h-screen bg-earth-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <img
            src={event?.image || fallbackImage}
            alt={event?.title || "Event"}
            className="w-full h-96 object-cover rounded-2xl"
          />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h1 className="text-3xl font-display font-bold text-earth-900">{event.title}</h1>
              <p className="text-earth-600 mt-3">{event.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 mt-6 border-y border-earth-200">
                <div>
                  <div className="flex items-center text-earth-600 mb-1">
                    <HiCalendar className="w-4 h-4 mr-1" />
                    <span className="text-xs">Date</span>
                  </div>
                  <div className="font-medium text-earth-900">{eventDateText}</div>
                </div>
                <div>
                  <div className="flex items-center text-earth-600 mb-1">
                    <HiClock className="w-4 h-4 mr-1" />
                    <span className="text-xs">Time</span>
                  </div>
                  <div className="font-medium text-earth-900">{event.timings || "N/A"}</div>
                </div>
                <div>
                  <div className="flex items-center text-earth-600 mb-1">
                    <HiLocationMarker className="w-4 h-4 mr-1" />
                    <span className="text-xs">Location</span>
                  </div>
                  <div className="font-medium text-earth-900">{event.location?.address || "N/A"}</div>
                </div>
                <div>
                  <div className="flex items-center text-earth-600 mb-1">
                    <HiUserGroup className="w-4 h-4 mr-1" />
                    <span className="text-xs">Spots Left</span>
                  </div>
                  <div className="font-medium text-earth-900">
                    {spotsLeft} / {maxVolunteers}
                  </div>
                </div>
              </div>
            </div>

            {skillsRequired.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-display font-semibold text-earth-900 mb-4">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {skillsRequired.map((skill, idx) => (
                    <span key={`${skill}-${idx}`} className="px-4 py-2 bg-earth-100 text-earth-700 rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-earth-900 mb-4">Requirements</h3>
                <ul className="space-y-2">
                  {requirements.map((req, idx) => (
                    <li key={`${req}-${idx}`} className="flex items-start text-earth-600">
                      <HiCheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                  {requirements.length === 0 && <li className="text-earth-500">No specific requirements listed.</li>}
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-earth-900 mb-4">Benefits</h3>
                <ul className="space-y-2">
                  {benefits.map((benefit, idx) => (
                    <li key={`${benefit}-${idx}`} className="flex items-start text-earth-600">
                      <HiCheckCircle className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                  {benefits.length === 0 && <li className="text-earth-500">No specific benefits listed.</li>}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <VolunteerList volunteers={volunteers} maxVolunteers={maxVolunteers} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-earth-900 mb-1">{spotsLeft}</div>
                <div className="text-earth-600">spots remaining</div>
              </div>

              {!showApplicationForm ? (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="w-full px-6 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 mb-4"
                >
                  Apply as Volunteer
                </button>
              ) : (
                <form onSubmit={handleApply} className="space-y-4 mb-4">
                  <textarea
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                    placeholder="Tell us why you'd like to volunteer..."
                    rows="4"
                    className="w-full px-4 py-3 border border-earth-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-70"
                    >
                      {isApplying ? "Submitting..." : "Submit"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="px-4 py-3 border border-earth-200 rounded-lg hover:bg-earth-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <button
                onClick={handleSaveEvent}
                disabled={isSaving}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  isSaved
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                    : "bg-white text-primary-600 border border-primary-200 hover:bg-primary-50"
                } disabled:opacity-70`}
              >
                {isSaving ? "Processing..." : isSaved ? "Remove from Saved" : "Save Event"}
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <img src={ngo.logo || fallbackLogo} alt={ngo.name || "NGO"} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h3 className="font-display font-semibold text-earth-900">{ngo.name || "Organization"}</h3>
                  <p className="text-sm text-earth-600">
                    {ngo.eventsCount ? `${ngo.eventsCount} events posted` : "Verified NGO"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsFixed;
