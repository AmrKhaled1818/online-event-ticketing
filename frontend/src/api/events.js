import api from './api';

export const getAllEvents = async () => {
  const res = await api.get('/events');
  return res.data;
};

export const getMyEvents = async () => {
  const res = await api.get('/events/my');
  return res.data;
};

export const deleteEvent = async (id) => {
  return await api.delete(`/events/${id}`);
};
