import { api } from "../lib/api.js";

export const fetchEvents = async () => {
  const res = await api.get("/events");
  return res.data;
};

export const fetchEventById = async (id) => {
  const res = await api.get(`/events/${id}`);
  return res.data;
};

export const fetchNgoEvents = async () => {
  const res = await api.get("/events/ngo/my-events");
  return res.data;
};

export const addEvent = async (payload) => {
  const res = await api.post("/events/add-event", payload);
  return res.data;
};

export const updateEvent = async (eventId, payload) => {
  const res = await api.patch(`/events/${eventId}`, payload);
  return res.data;
};

export const deleteEvent = async (eventId) => {
  const res = await api.delete(`/events/${eventId}`);
  return res.data;
};

export const volunteerForEvent = async (id) => {
  const res = await api.post(`/events/${id}/volunteer`);
  return res.data;
};

export const viewRegistrations = async (id) => {
  const res = await api.post(`/events/${id}/view-registrations`);
  return res.data;
};

export const fetchNgoApplications = async () => {
  const res = await api.get("/events/ngo/applications");
  return res.data;
};

export const approveRegistration = async (eventId, registrationId) => {
  const res = await api.post(`/events/${eventId}/registrations/${registrationId}/approve`);
  return res.data;
};

export const rejectRegistration = async (eventId, registrationId) => {
  const res = await api.post(`/events/${eventId}/registrations/${registrationId}/reject`);
  return res.data;
};