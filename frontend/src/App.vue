<script lang="ts">
import { defineComponent } from 'vue'
import base_header from './components/base_header.vue'
import code_play from './components/code_play.vue'
import base_footer from './components/base_footer.vue'
export default defineComponent({
  components: {
    base_header,
    code_play,
    base_footer
  },
  setup() {
    return {
      base_header,
      code_play,
      base_footer
    }
  }
})
</script>

<template>
  <main id="main_container">
    <base_header id="base_header_comp" />
    <code_play id="code_play_comp" />
    <base_footer id="base_footer_comp" />
  </main>
</template>

<style></style>
