<script lang="ts">
import { defineComponent } from 'vue'
import config from '@/config'

export default defineComponent({
  name: 'base_header',
  setup() {
    return {
      config
    }
  }
})
</script>

<template>
  <header id="header_container">
    <h1>{{ config.site_name }}</h1>
  </header>
</template>

