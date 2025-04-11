<script lang="ts">
import { defineComponent } from 'vue'
import code_play from '../components/code_play.vue'

export default defineComponent({
  name: 'code',
  components: {
    code_play
  },
  setup() {
    return {
      code_play
    }
  }
})
</script>

<template>
  <code_play />
</template>
