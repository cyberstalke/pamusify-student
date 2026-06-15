import { client } from './client';

export const authApi = {
  login:         (username, password) => client.post('/api/accounts/v1/auth/login/', { username, password }),
  logout:        ()                   => client.post('/api/accounts/v1/auth/logout/'),
  registerDevice:(device_token, device_type) => client.post('/api/accounts/v1/device-token/', { device_token, device_type }),
  getProfile:    ()                   => client.get('/api/accounts/v1/user/profile/'),
  updateProfile: (data)               => client.patch('/api/accounts/v1/user/profile/', data),
  getStats:      ()                   => client.get('/api/accounts/v1/user/stats/'),
  getAchievements: ()                 => client.get('/api/accounts/v1/user/achievements/'),
};
