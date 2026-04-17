import { api } from "../lib/api.js";

export const saveEvent = async (eventId) => {
  const res = await api.post("/users/save-event", { eventId });
  return res.data;
};

export const getSavedEvents = async () => {
  const res = await api.get("/users/saved-events");
  return res.data;
};

export const unsaveEvent = async (eventId) => {
  const res = await api.post("/users/unsave-event", { eventId });
  return res.data;
};

export const getRegisteredEvents = async () => {
  console.log('Fetching registered events...');
  try {
    const res = await api.get("/users/registered-events");
    console.log('Registered events response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching registered events:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};
