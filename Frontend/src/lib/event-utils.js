const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect fill='%23f3f4f6' width='800' height='400'/%3E%3Ctext fill='%236b7280' font-family='Arial' font-size='24' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EEvent Image%3C/text%3E%3C/svg%3E";

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

  const eventImage = event?.image || event?.images?.[0] || fallbackImage;
  console.log('Event image URL:', eventImage);
  console.log('Original event data:', event);

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
    image: eventImage,
    images: Array.isArray(event?.images) && event.images.length ? event.images : [eventImage],
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

export const handleImageError = (event) => {
  console.log('Image failed to load, using fallback:', event.target.src);
  // Fallback to SVG if Cloudinary image fails to load due to tracking prevention
  const fallbackSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect fill='%23f3f4f6' width='400' height='200'/%3E%3Ctext fill='%236b7280' font-family='Arial' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EEvent Image%3C/text%3E%3C/svg%3E";
  event.target.src = fallbackSvg;
  event.target.onerror = null; // Prevent infinite loop
};
