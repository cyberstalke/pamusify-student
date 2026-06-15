import { client } from './client';

export const learningApi = {
  home:           ()                  => client.get('/api/learning/v1/home/'),
  units:          (level)             => client.get(`/api/learning/v1/units/${level ? `?level=${level}` : ''}`),
  lesson:         (id)                => client.get(`/api/learning/v1/lessons/${id}/`),
  updateProgress: (id, progress)      => client.post(`/api/learning/v1/lessons/${id}/progress/`, { progress }),
  classmates:     ()                  => client.get('/api/learning/v1/classmates/'),
  tasks:          (date)              => client.get(`/api/learning/v1/tasks/${date ? `?date=${date}` : ''}`),
  createTask:     (data)              => client.post('/api/learning/v1/tasks/', data),
  updateTask:     (id, data)          => client.patch(`/api/learning/v1/tasks/${id}/`, data),
  deleteTask:     (id)                => client.delete(`/api/learning/v1/tasks/${id}/`),
  userCourses:    ()                  => client.get('/api/learning/v1/user-courses/'),
};
