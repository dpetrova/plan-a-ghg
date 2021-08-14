const state = {
  products: [],
}

const mutations = {
  SET_PRODUCTS(state, payload) {
    state.products = payload
  },
}

const actions = {
  async getProducts({ commit, dispatch, state }) {
    try {
      const res = await this.$api.get('products.json')
      if (res) {
        commit('SET_PRODUCTS', res)
      }
    } catch (error) {
      console.log(error)
    }
  },
}

const getters = {
  products: (state) => {
    return [...state.products].sort((a, b) => a.name.localeCompare(b.name))
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
