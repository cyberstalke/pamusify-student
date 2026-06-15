import { client } from './client';

export const quizApi = {
  take:                (id)               => client.get(`/api/quiz/v1/quizzes/${id}/take/`),
  submit:              (id, answers)      => client.post(`/api/quiz/v1/quizzes/${id}/submit/`, { answers }),
  leaderboard:         (period = 'weekly') => client.get(`/api/quiz/v1/leaderboard/?period=${period}`),
  grammar:             (lessonId)         => client.get(`/api/quiz/v1/grammar/?lesson=${lessonId}`),
  spelling:            (lessonId)         => client.get(`/api/quiz/v1/spelling/?lesson=${lessonId}`),
  pronunciationWord:   (id)               => client.get(`/api/quiz/v1/pronunciation/${id}/`),
  submitPronunciation: (quizId, score)    => client.post('/api/quiz/v1/pronunciation-result/', { quiz_id: quizId, score }),
};
