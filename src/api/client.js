import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://api.englifie.uz';

async function request(path, { body, headers: extra, ...opts } = {}) {
  const token = await AsyncStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...extra,
  };
  const res = await fetch(`${BASE_URL}${path}`, {
    ...opts,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(json.detail || 'Request failed');
    err.status = res.status;
    err.data = json;
    throw err;
  }
  return json;
}

export const client = {
  get:    (path)        => request(path, { method: 'GET' }),
  post:   (path, body)  => request(path, { method: 'POST', body }),
  patch:  (path, body)  => request(path, { method: 'PATCH', body }),
  delete: (path)        => request(path, { method: 'DELETE' }),
};

export async function uploadFile(uri, filename = 'file', type = 'image/jpeg') {
  const token = await AsyncStorage.getItem('authToken');
  const form = new FormData();
  form.append('file', { uri, name: filename, type });
  const res = await fetch(`${BASE_URL}/api/uploads/v1/upload-file/`, {
    method: 'POST',
    headers: { Authorization: `Token ${token}` },
    body: form,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw json;
  return json;
}
