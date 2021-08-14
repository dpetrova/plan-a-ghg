<template>
  <q-page padding>
    <!-- Settings section -->
    <q-list bordered padding class="q-mb-md">
      <q-item-label header class="text-primary">Settings</q-item-label>

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Toggle dark/light mode</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle color="primary" v-model="darkTheme" />
        </q-item-section>
      </q-item>

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Setup chart type</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-slider
            v-model="chartType"
            :min="0"
            :max="2"
            :step="1"
            label
            :label-value="chartTypes[chartType]"
            label-always
            markers
            snap
            color="primary"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <!-- More section -->
    <q-list bordered padding>
      <q-item-label header class="text-primary">More</q-item-label>

      <q-item @click="emailMe" tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Email me</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="mail" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'Settings',
  setup() {
    const $q = useQuasar()
    const store = useStore()

    const settings = computed(() => {
      return store.getters['settings/settings']
    })

    const chartTypes = computed(() => {
      return store.getters['settings/chartTypes']
    })

    const darkTheme = computed({
      get() {
        return settings.value.darkTheme
      },
      set(value) {
        $q.dark.set(value)
        store.dispatch('settings/toggleThemeMode', value)
      },
    })

    const chartType = computed({
      get() {
        return settings.value.chartType
      },
      set(value) {
        store.dispatch('settings/setupChartType', value)
      },
    })

    const emailMe = () => {
      window.location.href =
        'mailto:daniella_petrova@abv.bg?subject=GHG Emissions Dashboard Feedback'
    }

    return {
      settings,
      darkTheme,
      chartTypes,
      chartType,
      emailMe,
    }
  },
})
</script>
