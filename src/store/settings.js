import { LocalStorage } from 'quasar'

const chartTypes = ['line', 'area', 'bar']

const state = {
  chartTypes,
  settings: {
    darkTheme: false,
    chartType: 0,
  },
}

const mutations = {
  SET_SETTINGS(state, settings) {
    Object.assign(state.settings, settings)
  },
  SET_THEME_MODE(state, value) {
    state.settings.darkTheme = value
  },
  SET_CHART_TYPE(state, index) {
    state.settings.chartType = index
  },
}

const actions = {
  /**
   * Toggle light/dark theme mode
   */
  toggleThemeMode({ commit, dispatch }, value) {
    commit('SET_THEME_MODE', value)
    dispatch('storeSettings')
  },
  /**
   * Setup chart type
   */
  setupChartType({ commit, dispatch }, value) {
    commit('SET_CHART_TYPE', value)
    dispatch('storeSettings')
  },
  /**
   * Set settings in LocalStorage
   */
  storeSettings({ state }) {
    LocalStorage.set('settings', state.settings)
  },
  /**
   * Get settings from LocalStorage
   */
  getSettings({ commit }) {
    let settings = LocalStorage.getItem('settings')
    if (settings) {
      commit('SET_SETTINGS', settings)
    }
  },
}

const getters = {
  settings: (state) => {
    return state.settings
  },
  chartTypes: (state) => {
    return state.chartTypes
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
