import { boot } from 'quasar/wrappers'
import VueApexCharts from 'vue3-apexcharts'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  // make <apexchart> component available everywhere
  app.use(VueApexCharts)

  // allow you to use this.$apexcharts (for Vue Options API form)
  app.config.globalProperties.$apexcharts = VueApexCharts
})
