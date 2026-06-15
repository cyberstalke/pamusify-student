import { client } from './client';

export const attendanceApi = {
  scanQR: (code) => client.post('/api/accounts/v1/qrcode/scan/', { code }),
};
