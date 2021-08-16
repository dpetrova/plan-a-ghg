import { createStore, useStore } from 'vuex'
import { mount, shallowMount } from '@vue/test-utils'
import Quasar, * as All from 'quasar'
import merge from 'lodash.merge'

export function createStoreInstance(overrides) {
  //mock vuex
  const defaultStoreConfig = {
    state: {},
    actions: {},
    getters: {},
    mutations: {},
    modules: {},
  }

  return createStore(merge(defaultStoreConfig, overrides))
}

export function createWrapper(component, overrides, shallow = true) {
  const defaultMountingConfig = {
    global: {
      plugins: All,
      //directives: All,
      //components: All,
      //   provide: {
      //     store: createStoreInstance(),
      //   },
      //   mocks: {},
      //   stubs: {
      //     apexchart: true,
      //   },
      //   router: {}
    },
  }

  return shallow
    ? shallowMount(component, merge(defaultMountingConfig, overrides))
    : mount(component, merge(defaultMountingConfig, overrides))
}
