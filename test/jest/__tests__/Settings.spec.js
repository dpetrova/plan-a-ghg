import { describe, expect, it } from '@jest/globals'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import SettingsPage from '../../../src/pages/Settings.vue'
import { createStoreInstance, createWrapper } from './factory'
import settingsModule from '../../../src/store/settings'

// Specify here Quasar config you'll need to test your component
installQuasarPlugin()

let wrapper
let store

beforeEach(() => {
  store = createStoreInstance({
    modules: {
      settings: settingsModule,
    },
  })

  wrapper = createWrapper(
    SettingsPage,
    {
      global: {
        // provide: {
        //   store,
        // },
        plugins: [store],
      },
    },
    false
  )

  store.dispatch = jest.fn(() => Promise.resolve(true))
})

describe('Settings.vue', () => {
  it('open mail client with provided email address when "Email Me" is clicked', async () => {
    //console.log(wrapper.html())
    //const { vm } = wrapper

    //mock window.location
    delete window.location
    window.location = { assign: jest.fn() }

    await wrapper.find('[data-testid="email-me"]').trigger('click')
    expect(window.location.assign).toHaveBeenCalledWith(wrapper.vm.emailAddress)
  })

  it('setup dark theme mode when change it via toggle', async () => {
    //const toggle = wrapper.findComponent({ ref: 'theme-mode-toggle' }).vm
    const toggle = wrapper.vm.$refs['theme-mode-toggle']
    let initialMode = wrapper.vm.darkTheme

    //initially dark mode is not set
    expect(wrapper.vm.quasar.dark.mode).toBeUndefined()

    //toggle dark mode
    await toggle.$emit('update:modelValue', !initialMode)

    expect(wrapper.vm.quasar.dark.mode).toBe(!initialMode)
    expect(store.dispatch).toHaveBeenCalledWith(
      'settings/toggleThemeMode',
      !initialMode
    )
  })

  it('setup chart type when change it via slider', async () => {
    const slider = wrapper.vm.$refs['chart-type-slider']
    const initialType = wrapper.vm.chartType
    const newType = initialType + 1 //chartType is an intiget as initial is 0

    //change chart type
    await slider.$emit('update:modelValue', newType)

    expect(store.dispatch).toHaveBeenCalledWith(
      'settings/setupChartType',
      newType
    )
  })
})
