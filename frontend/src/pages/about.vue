<script lang="ts">
import { defineComponent } from 'vue'
import about_md_comp from '@/components/about_md_comp.vue'

export default defineComponent({
  name: 'about',
  components: {
    about_md_comp
  },
  setup() {
    return {
      about_md_comp
    }
  }
})
</script>

<template>
    <about_md_comp />
</template>

<style></style>
