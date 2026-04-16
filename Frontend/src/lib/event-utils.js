const fallbackImage =
  "https://images.unsplash.com/photo-1594708767771-a7502209ff51?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

const normalizeVolunteer = (volunteer, index) => {
  if (!volunteer || typeof volunteer !== "object") {
    return {
      id: `volunteer-${index}`,
      name: "Volunteer",
      avatar: "",
      email: "",
      skillsPossessed: [],
    };
  }

  return {
    id: volunteer.id || volunteer._id || `volunteer-${index}`,
    name: volunteer.name || volunteer.fullname || "Volunteer",
    avatar: volunteer.avatar || volunteer.profilePic || "",
    email: volunteer.email || "",
    skillsPossessed: Array.isArray(volunteer.skillsPossessed) ? volunteer.skillsPossessed : [],
  };
};

export const normalizeEvent = (event) => {
  const locationText =
    typeof event?.location === "string"
      ? event.location
      : event?.location?.address || "";

  const volunteers = Array.isArray(event?.volunteers)
    ? event.volunteers.map(normalizeVolunteer)
    : [];

  const ngo = event?.organization || event?.ngoId || {};
  const ngoName = ngo?.name || "NGO";
  const ngoLogo = ngo?.logo || "";
  const currentVolunteers =
    typeof event?.currentVolunteers === "number" ? event.currentVolunteers : volunteers.length;
  const maxVolunteers = Number(event?.maxVolunteers || 0);

  return {
    ...event,
    _id: event?._id,
    title: event?.title || "Untitled event",
    description: event?.description || "No description available.",
    longDescription: event?.longDescription || event?.description || "No description available.",
    date: event?.date || "",
    timings: event?.timings || event?.time || "",
    time: event?.time || event?.timings || "",
    category: event?.category || "General",
    image: event?.image || event?.images?.[0] || fallbackImage,
    images: Array.isArray(event?.images) && event.images.length ? event.images : [event?.image || fallbackImage],
    location: {
      address: locationText || "Location TBD",
      coordinates: event?.location?.coordinates || event?.coordinates || { lat: 0, lng: 0 },
    },
    locationText: locationText || "Location TBD",
    volunteers,
    currentVolunteers,
    maxVolunteers,
    spotsLeft: Math.max(maxVolunteers - currentVolunteers, 0),
    skillsRequired: Array.isArray(event?.skillsRequired) ? event.skillsRequired : [],
    requirements: Array.isArray(event?.requirements) ? event.requirements : [],
    benefits: Array.isArray(event?.benefits) ? event.benefits : [],
    organization: {
      name: ngoName,
      logo: ngoLogo,
      rating: ngo?.rating || 4.8,
      eventsCount: Number(ngo?.eventsCount || 0),
      joinedDate: ngo?.joinedDate || "",
      email: ngo?.email || "",
    },
    ngoId: ngo,
  };
};

export const normalizeEvents = (events) =>
  Array.isArray(events) ? events.map(normalizeEvent) : [];
