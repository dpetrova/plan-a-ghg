<template>
  <!-- external links -->
  <q-item clickable tag="a" target="_blank" :href="to" exact v-if="external">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ label }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
  <!-- internal links -->
  <q-item clickable :to="to" exact v-else>
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ label }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MenuLink',
  props: {
    label: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: '',
    },
    to: {
      type: String,
      default: '#',
    },
    icon: {
      type: String,
      default: '',
    },
    external: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
