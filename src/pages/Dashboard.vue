<template>
  <q-page class="q-pa-md">
    <div class="row">
      <!-- DATA FILTERS -->
      <div class="col-12 col-md-3">
        <!-- GHG type -->
        <div class="q-pa-md">
          <div class="q-mb-sm text-h5">
            GHG type
            <q-badge rounded color="grey-3 text-black" align="top"
              >?
              <q-tooltip class="text-subtitle2"
                >Select which GHG type data to plot.</q-tooltip
              ></q-badge
            >
          </div>
          <q-select
            filled
            autocomplete="name"
            v-model="product"
            :options="products"
            option-value="name"
            option-label="name"
            label="Products"
          />
        </div>

        <!-- Country -->
        <div class="q-pa-md">
          <div class="q-mb-sm text-h5">
            Country
            <q-badge rounded color="grey-3 text-black" align="top"
              >?
              <q-tooltip class="text-subtitle2"
                >Select which country data to plot.</q-tooltip
              ></q-badge
            >
          </div>
          <q-select
            filled
            v-model="country"
            :options="countries"
            option-value="code"
            option-label="name"
            label="Country"
          />
        </div>

        <!-- Time period -->
        <div class="q-pa-md" v-if="period && rangeBoundaries">
          <div class="q-mb-sm text-h5">
            Date range
            <q-badge rounded align="top" color="grey-3 text-black">
              ?
              <q-tooltip class="text-subtitle2"
                ><div>Select range or single date for data to plot.</div>
                <div>Deselect it with click on selection.</div>
              </q-tooltip></q-badge
            >
          </div>
          <q-date
            v-model="period"
            range
            mask="YYYY-MM-DD"
            today-btn
            :options="
              (date) =>
                date >= rangeBoundaries.first && date <= rangeBoundaries.last
            "
          />
        </div>

        <!-- Data aggregation-->
        <div class="q-pa-md">
          <div class="q-mb-lg text-h5">
            Aggregate data
            <q-badge rounded color="grey-3 text-black" align="top"
              >?
              <q-tooltip class="text-subtitle2"
                >Select interval by which data will be aggregated.</q-tooltip
              ></q-badge
            >
          </div>
          <q-slider
            v-model="interval"
            :min="0"
            :max="intervalValues.length - 1"
            :step="1"
            label
            :label-value="intervalValues[interval]"
            label-always
            markers
            snap
            color="primary"
          />
        </div>
      </div>

      <!-- DATA REPRESENTATION-->
      <div class="col-12 col-md-9">
        <div class="q-pa-md">
          <div class="q-mb-sm text-h5">
            GHG emissions
            <q-badge rounded color="grey-3 text-black" align="top"
              >?
              <q-tooltip class="text-subtitle2"
                ><div>
                  Density of a given GHG for a given country over a given date
                  range.
                </div>
                <div>
                  Use toolbar tools to zoom in/zoom out/select a rectangle with
                  desired range.
                </div></q-tooltip
              ></q-badge
            >
          </div>
          <!-- load data -->
          <template v-if="!statsDownloaded">
            <loading />
          </template>
          <!-- plot data -->
          <template
            v-else-if="
              statsDownloaded && stats && stats.length && stats[0].data.length
            "
          >
            <q-card flat>
              <apexchart
                width="100%"
                height="500px"
                :type="chartTypes[settings.chartType]"
                :options="chartOptions"
                :series="stats"
              ></apexchart>
            </q-card>
          </template>
          <!-- no data -->
          <template v-else>
            <no-data-banner />
          </template>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import Loading from 'src/components/Loading.vue'
import NoDataBanner from 'src/components/NoDataBanner.vue'
import moment from 'moment'

export default defineComponent({
  name: 'Dashboard',
  components: { Loading, NoDataBanner },
  setup() {
    const store = useStore()

    /* CHART PROPERTIES */
    const stats = computed(() => {
      return store.getters['statistics/averages']
    })

    const statsDownloaded = computed(() => {
      return store.state.statistics.downloaded
    })

    const settings = computed(() => {
      return store.getters['settings/settings']
    })

    const chartTypes = computed(() => {
      return store.getters['settings/chartTypes']
    })

    const intervalValues = computed(() => {
      return store.getters['statistics/intervalValues']
    })

    const interval = computed({
      get() {
        return store.getters['statistics/interval']
      },
      set(value) {
        store.dispatch('statistics/selectInterval', value)
      },
    })

    let chartOptions = reactive({
      theme: {
        mode: settings.value.darkTheme ? 'dark' : 'light',
        palette: 'palette1',
      },
      chart: {
        height: 'auto',
        width: '100%',
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: true,
          offsetX: -100,
          offsetY: 0,
          autoSelected: 'zoom',
        },
        animations: {
          enabled: false,
        },
        redrawOnParentResize: true,
        redrawOnWindowResize: true,
      },
      dataLabels: {
        enabled: settings.value.chartType < 2,
      },
      stroke: {
        curve: 'smooth',
      },
      title: {
        text: '',
        align: 'left',
        style: {
          fontSize: '18px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 600,
        },
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#2a2929', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      markers: {
        size: 1,
      },
      xaxis: {
        type: 'datetime',
        title: {
          text: 'Date',
          style: {
            fontSize: '16px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
          },
        },
        labels: {
          rotate: -65,
          rotateAlways: true,
          formatter: function (val, timestamp) {
            return moment(new Date(timestamp)).format('DD MMM YYYY')
          },
        },
      },
      yaxis: {
        title: {
          text: 'GHG, [ppb]',
          style: {
            fontSize: '16px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
          },
        },
        labels: {
          style: {},
        },
      },
      legend: {
        showForSingleSeries: true,
        position: 'right',
        verticalAlign: 'top',
        floating: false,
        containerMargin: {
          left: 35,
          right: 60,
        },
      },
      tooltip: {
        enabled: true,
      },
      responsive: [
        {
          breakpoint: 667,
          options: {
            legend: {
              position: 'top',
              horizontalAlign: 'left',
            },
            chart: {
              toolbar: {
                offsetX: 0,
              },
            },
          },
        },
      ],
    })

    /* FILTER PROPERTIES */
    const products = computed(() => {
      return store.getters['products/products']
    })

    const product = computed({
      get() {
        return store.state.statistics.product
      },
      set(value) {
        store.dispatch('statistics/selectProduct', value)
        chartOptions.yaxis.title.text = `${value.name}, [ppb]`
      },
    })

    const countries = computed(() => {
      return store.getters['statistics/countries']
    })

    const country = computed({
      get() {
        return store.getters['statistics/country']
      },
      set(value) {
        store.dispatch('statistics/selectCountry', value)
      },
    })

    const rangeBoundaries = computed(() => {
      return store.getters['statistics/rangeBoundaries']
    })

    const period = computed({
      get() {
        return store.getters['statistics/period']
      },
      set(value) {
        store.dispatch('statistics/selectPeriod', value)
      },
    })

    onMounted(async () => {
      await store.dispatch('products/getProducts')

      //setup default GHG type
      if (!product.value) {
        await store.dispatch('statistics/selectProduct', products.value[0])
      }

      await store.dispatch('statistics/getRangeBoundaries')

      chartOptions.yaxis.title.text = `${product.value.name}, [ppb]`
      store.dispatch('statistics/getAverages')
    })

    return {
      stats,
      products,
      countries,
      country,
      rangeBoundaries,
      period,
      statsDownloaded,
      chartOptions,
      product,
      settings,
      chartTypes,
      intervalValues,
      interval,
    }
  },
})
</script>

<style lang="scss" scoped></style>
