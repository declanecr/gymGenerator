import api from '../src/api/axios';

export const fetchExamples = async () => {
  const { data } = await api.get('/example');
  return data;
};
