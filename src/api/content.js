import { client } from './client';

export const contentApi = {
  stories: (level) => client.get(`/api/content/v1/stories/${level ? `?level=${level}` : ''}`),
  story:   (id)    => client.get(`/api/content/v1/stories/${id}/`),
  library: (type, level) => {
    const p = new URLSearchParams();
    if (type) p.set('type', type);
    if (level) p.set('level', level);
    const qs = p.toString();
    return client.get(`/api/content/v1/library/${qs ? `?${qs}` : ''}`);
  },
  vocabulary:     (lessonId) => client.get(`/api/content/v1/vocabulary/?lesson=${lessonId}`),
  reading:        (lessonId) => client.get(`/api/content/v1/reading/?lesson=${lessonId}`),
  listening:      (lessonId) => client.get(`/api/content/v1/listening/?lesson=${lessonId}`),
  wordGameTopics: ()         => client.get('/api/content/v1/word-game/topics/'),
};
