<template>
  <router-view />
</template>

<script>
import { defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'App',
  setup() {
    const $q = useQuasar()
    const store = useStore()

    const settings = computed(() => {
      return store.getters['settings/settings']
    })

    onMounted(async () => {
      //get stored user preferencies
      await store.dispatch('settings/getSettings')

      // toggle dark theme if user saved such preferencies
      $q.dark.set(settings.value.darkTheme)
    })
  },
})
</script>
