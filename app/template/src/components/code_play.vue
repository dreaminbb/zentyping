<script setup lang="ts">
import { onMounted , onUnmounted } from 'vue'
import { ref } from 'vue'

const user_input = ref('')
const sample_code = `function greet() {
  console.log('Hello, world!');
  }`

function handleKeydown(event: KeyboardEvent) {
  user_input.value += event.key
  console.log(user_input.value)
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <main id="code_play_main_container">
    <div id="code_display_container">
      <pre>
        <code>
          <span v-for="(line, index) in sample_code.split('\n')" :key="index">
            {{ line }}
          </span>
        </code>
      </pre>
    </div>
  </main>
</template>

<!-- ref="textarea"
@input="typing"
@keydown="typing_keydown"
@focus="type_input_focus"
@blur="type_input_lost_focus"
@compositionstart="compositionStart"
@compositionend="compositionEnd" -->
