import { date } from 'quasar'
import moment from 'moment'
const { subtractFromDate, addToDate, getDateDiff } = date

//use only a few for simplicity
const intervalValues = ['day', 'month', 'quarter', 'year']

/**
 * Setup default time range
 * @returns {Object} Default time period in format {from: 'YYYY-MM-DD', to: 'YYYY-MM-DD'}, calculated a week ago from today
 */
const constructDefaultTimeRange = () => {
  let today = new Date()
  let oneMonthEarlier = subtractFromDate(today, { days: 29 })
  return {
    from: moment(oneMonthEarlier).format('YYYY-MM-DD'),
    to: moment(today).format('YYYY-MM-DD'),
  }
}

/**
 * Calculate query interval depends on time range selected
 * @param {String} start Start date
 * @param {String} end End date
 * @returns {String} Element of predefined interval array
 */
const calculateAggregateInterval = (start, end) => {
  const diff = Math.abs(getDateDiff(moment(start), moment(end), 'days'))
  let order = (Math.log(diff) * Math.LOG10E + 1) | 0
  if (order > intervalValues.length - 1) order = intervalValues.length - 1
  return intervalValues[order]
}

const state = {
  averages: [],
  downloaded: false,
  product: null,
  //TODO: fetch all countries in production
  countries: [
    { name: 'Germany', code: 'DE' },
    { name: 'Bulgaria', code: 'BG' },
    { name: 'United Kingdom', code: 'GB' },
  ],
  country: null,
  period: constructDefaultTimeRange(),
  rangeBoundaries: null,
  intervalValues,
  interval: 0,
}

const mutations = {
  SET_AVERAGES(state, payload) {
    state.averages = payload
  },
  SET_RANGE_BOUNDARIES(state, boundaries) {
    state.rangeBoundaries = boundaries
  },
  SET_DOWNLOADED(state, value) {
    state.downloaded = value
  },
  UPDATE_PRODUCT(state, product) {
    state.product = product
  },
  UPDATE_COUNTRY(state, country) {
    state.country = country
  },
  UPDATE_PERIOD(state, period) {
    //set last date with available data samples if no range/or single date is selected
    let lastDay = state.rangeBoundaries
      ? subtractFromDate(moment(state.rangeBoundaries.last), { days: 1 })
      : new Date()
    if (!period) period = moment(lastDay).format('YYYY-MM-DD')
    state.period = period
  },
  UPDATE_AGGREGATION_INTERVAL(state, interval) {
    state.interval = interval
  },
}

const actions = {
  /**
   * Fetch average GHG emission data
   */
  async getAverages({ commit, state, getters }) {
    try {
      if (!state.product) return

      const apiEndpoint = !getters.query.params.interval
        ? 'average.json'
        : 'statistics.json'

      commit('SET_DOWNLOADED', false)
      const res = await this.$api.get(
        `/${state.product.name}/${apiEndpoint}`,
        getters.query
      )
      if (res) {
        commit('SET_AVERAGES', res)
        commit('SET_DOWNLOADED', true)
      }
    } catch (error) {
      console.log(error)
    }
  },
  /**
   * Fetch range of data currently available from the API
   */
  async getRangeBoundaries({ commit, state }) {
    try {
      if (!state.product) return
      const res = await this.$api.get(`/${state.product.name}/data-range.json`)
      if (res) {
        commit('SET_RANGE_BOUNDARIES', res)
      }
    } catch (error) {
      console.log(error)
    }
  },
  /**
   * Update selected product
   * @param {Object} product Selected product
   */
  selectProduct({ commit, dispatch }, product) {
    commit('UPDATE_PRODUCT', product)
    dispatch('getAverages')
    dispatch('getRangeBoundaries')
  },
  /**
   * Update selected country
   * @param {Object} country Selected country
   */
  selectCountry({ commit, dispatch }, country) {
    commit('UPDATE_COUNTRY', country)
    dispatch('getAverages')
  },
  /**
   * Update selected time period
   * @param {Object} range Selected time range
   */
  selectPeriod({ commit, dispatch }, range) {
    commit('UPDATE_PERIOD', range)
    dispatch('getAverages')
  },
  /**
   * Update selected aggregation interval
   * @param {Object} interval Selected interval
   */
  selectInterval({ commit, dispatch }, interval) {
    commit('UPDATE_AGGREGATION_INTERVAL', interval)
    dispatch('getAverages')
  },
}

const getters = {
  averages: (state) => {
    //process and return aggregated statistics data
    if (state.interval) {
      return [
        {
          name: state.country ? state.country.name : state.countries[0].name,
          data: state.averages.map((item) => {
            return {
              x: item.time.interval_start,
              y: item.value.average.toFixed(7),
            }
          }),
        },
      ]
    }

    //process and return no aggregated averages data
    return [
      {
        name: state.country ? state.country.name : state.countries[0].name,
        data: state.averages.map((item) => {
          return { x: item.start, y: item.average.toFixed(7) }
        }),
      },
    ]
  },
  countries: (state) => {
    return state.countries
  },
  country: (state) => {
    return state.country ? state.country : state.countries[0]
  },
  period: (state) => {
    return state.period
  },
  rangeBoundaries: (state) => {
    if (!state.rangeBoundaries) return null
    return {
      first: moment(state.rangeBoundaries.first).format('YYYY/MM/DD'),
      last: moment(state.rangeBoundaries.last).format('YYYY/MM/DD'),
    }
  },
  intervalValues: (state) => {
    return state.intervalValues
  },
  interval: (state) => {
    return state.interval
  },
  query: (state) => {
    const begin = state.period.from || state.period
    const end =
      state.period.to ||
      moment(addToDate(state.period, { days: 1 })).format('YYYY-MM-DD')

    let params = {
      country: state.country ? state.country.code : state.countries[0].code,
      begin,
      end,
    }

    if (state.interval) params.interval = intervalValues[state.interval]

    return { params }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
