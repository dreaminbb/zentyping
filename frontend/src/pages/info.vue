<script lang="ts">
import { defineComponent } from 'vue'
import info_md_comp from '@/components/info_md_comp.vue'

export default defineComponent({
  name: 'info',
  components: {
    info_md_comp
  },
  setup() {
    return {
      info_md_comp
    }
  }
})
</script>

<template>
  <info_md_comp />
</template>

<style></style>
