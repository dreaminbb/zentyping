<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'code_author',
  props: {
    author: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const is_written_by_ai = props.author === 'AI'
    return {
      is_written_by_ai,
      author: props.author
    }
  }
})
</script>
<template>
  <div v-if="is_written_by_ai">AI</div>
  <a :href="`https://github.com/${author}`" v-if="!is_written_by_ai"
    ><i class="nf nf-fa-pen"></i> {{ author }}</a
  >
</template>

<style>
a {
  color: var(--primary-text-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: var(--accent-color);
  empty-cells: show;
  text-decoration: underline;
}
</style>
