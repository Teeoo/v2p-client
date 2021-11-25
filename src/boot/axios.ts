import { boot } from 'quasar/wrappers';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { LoadingBar } from 'quasar';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const api = axios.create({ baseURL: process.env.baseURL });

api.interceptors.request.use(
  async (request) => {
    LoadingBar.start();
    return Promise.resolve(request);
  },
  async (error) => {
    LoadingBar.stop();
    return Promise.reject(error);
  }
);

api.interceptors.response.use(async (response: AxiosResponse) => {
    LoadingBar.stop();
    return Promise.resolve(response.data);
  },
  async (error: AxiosError) => {
    LoadingBar.stop();
    return Promise.reject(error.response?.data);
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
