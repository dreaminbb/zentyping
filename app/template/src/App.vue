<script lang="ts">
import { defineComponent, provide, type Ref, ref } from 'vue'
import { RouterView } from 'vue-router'
import { user_status } from '@/store/store'
import base_header from './components/base_header.vue'
import play_test from './components/play_test.vue'
import base_footer from './components/base_footer.vue'
export default defineComponent({
  components: {
    base_header,
    play_test,
    base_footer
  },
  setup() {
    return {
      base_header,
      play_test,
      base_footer
    }
  }
})
</script>

<template>
  <main id="main_container">
    <base_header />
    <play_test />
    <base_footer />
  </main>
  </template>

<style></style>
