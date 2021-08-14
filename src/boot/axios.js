import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: `https://api.v2.emissions-api.org/api/v2`,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// handle response
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default boot(({ app, store }) => {
  // allow you to use this.$axios in Vue files, so you won't necessarily have to import axios in each vue file
  app.config.globalProperties.$axios = axios

  // allow you to use this.$api in Vue files, so you can easily perform requests against your app's API
  app.config.globalProperties.$api = api

  // allow you to use this.$api in Vuex store, so you can easily perform requests against your app's API
  store.$api = api
})

export { api }
