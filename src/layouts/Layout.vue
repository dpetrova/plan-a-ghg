<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title class="absolute-center">
          GHG dashboard
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-list>
        <q-item-label header class="text-grey-8"> Menu </q-item-label>
        <MenuLink v-for="link in linksList" :key="link.label" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import MenuLink from 'components/MenuLink.vue'

const linksList = [
  {
    label: 'Dashboard',
    icon: 'assessment',
    caption: 'Analyse GHG emmission trends',
    to: '/',
  },
  {
    label: 'Settings',
    icon: 'settings',
    caption: 'User preferencies',
    to: '/settings',
  },
  {
    label: 'Github Repo',
    icon: 'code',
    caption: 'github.com/dpetrova/plan-a-ghg',
    to: 'https://github.com/dpetrova/plan-a-ghg',
    external: true,
  },
]

import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    MenuLink,
  },

  setup() {
    const leftDrawerOpen = ref(false)

    return {
      linksList: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
    }
  },
})
</script>
