import { client } from './client';

export const assessmentApi = {
  myResults: () => client.get('/api/assessment/v1/results/my/'),
};
