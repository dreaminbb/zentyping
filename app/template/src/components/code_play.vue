<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import play_func from '@/module/play_func'
import { ref } from 'vue'
import '../assets/css/global.css'
import type { Ref } from 'vue'

const user_input: Ref<string> = ref('')
const is_playing: Ref<boolean> = ref(false)
const sample_code = `function greet() {
  console.log('Hello, world!');
}`
const char_index: Ref<number> = ref(0)
const line_index: Ref<number> = ref(0)
let line_index_count: number
const chart_all_spans_as_a_array: Ref<string[]> = ref([])
const char_spans = ref([])
new play_func(is_playing, user_input)

// todo
// タイピングして正誤で色をつてける。

function start_typing() {
  is_playing.value = true
  let line_index = sample_code.split('\n').length
  let char_index = sample_code.split('\n')[line_index].length

  console.log(char_spans.value[0], line_index, 22)
}

function handleKeydown(event: KeyboardEvent): void {
  user_input.value += event.key
  console.log(user_input.value)
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  start_typing()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// 構想的には列で分けるspanとの中で一文字づつspanで分ける。 フォーマットは保つ。
</script>

<template>
  <main id="code_play_main_container">
    <div id="code_display_container">
      <span
        v-for="(char, index) in sample_code.split('\n')"
        :key="index"
        ref="char_spans"
        class="each_line_elm"
      >
        <span
          v-for="(each_char, each_index) in char.split('')"
          :key="each_index"
          class="each_char_elm"
        >
          {{ each_char === ' ' ? '\u00A0' : each_char }} 
          <!-- ! ここに問題あり空白を表示させる。 -->
        </span>
      </span>
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
