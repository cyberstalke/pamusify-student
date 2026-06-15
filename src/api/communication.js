import { client } from './client';

export const communicationApi = {
  notifications:     ()          => client.get('/api/communication/v1/notifications/'),
  markRead:          (id)        => client.post(`/api/communication/v1/notifications/${id}/read/`),
  markAllRead:       ()          => client.post('/api/communication/v1/notifications/read-all/'),
  myAnnouncements:   ()          => client.get('/api/communication/v1/announcements/my/'),
  events:            ()          => client.get('/api/communication/v1/events/'),
  conversations:     ()          => client.get('/api/communication/v1/conversations/'),
  startConversation: (user_id)   => client.post('/api/communication/v1/conversations/', { user_id }),
  messages:          (id)        => client.get(`/api/communication/v1/conversations/${id}/messages/`),
  sendMessage:       (id, data)  => client.post(`/api/communication/v1/conversations/${id}/messages/`, data),
};
