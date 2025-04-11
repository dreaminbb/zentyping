<script lang="ts">
import { defineComponent } from 'vue'
import sc_doc_md from '@/components/sc_doc_md.vue'

export default defineComponent({
  name: 'sc_doc',
  components: {
    sc_doc_md
  },
  setup() {
    return {
      sc_doc_md
    }
  }
})
</script>

<template>
    <sc_doc_md />
</template>

<style></style>
