y
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
const code_display_container = ref<HTMLElement | null>(null)
const chart_all_spans_as_a_array: Ref<any> = ref([])
const char_spans = ref([])
new play_func(is_playing, user_input)

// todo
// タイピングして正誤で色をつてける。

function start_typing() {
  is_playing.value = true
  let line_index = sample_code.split('\n').length
}

function handleKeydown(event: KeyboardEvent): void {
  user_input.value += event.key
  console.log(user_input.value)
}

function fetch_char_spans_ignore_space_after_line_break_as_elm(): void {
  if (code_display_container.value === null) return
  const char_spans = (code_display_container.value as HTMLElement).querySelectorAll(
    '.each_char_elm'
  )
  char_spans.forEach((char_span: any) => {
    chart_all_spans_as_a_array.value.push(char_span)
  })
  console.log(char_spans)
}

function play_init():void{
  is_playing.value = false
  user_input.value = ''
  char_index.value = 0
  line_index.value = 0
  chart_all_spans_as_a_array.value = []
  char_spans.value = []
  fetch_char_spans_ignore_space_after_line_break_as_elm()
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  console.log(code_display_container.value, 37)
  play_init()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// 構想的には列で分けるspanとの中で一文字づつspanで分ける。 フォーマットは保つ。
</script>

<template>
  <main id="code_play_main_container">
    <code id="code_display_container" ref="code_display_container">
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
          >{{ each_char === ' ' ? '\u00A0' : each_char }}</span
        >
      </span>
    </code>
  </main>
</template>

<!-- ref="textarea"
@input="typing"
@keydown="typing_keydown"
@focus="type_input_focus"
@blur="type_input_lost_focus"
@compositionstart="compositionStart"
@compositionend="compositionEnd" -->
<style>
#code_play_main_container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

#code_display_container {
  width: 90%;
  height: 80%;
  margin: 10% 5%;
  font-size: 1.5rem;
  font-family: 'Courier New', Courier, monospace;
  padding: 1rem;
  border-radius: 5px;
}

.each_line_elm {
  display: block;
}

.each_char_elm {
  display: inline-block;
}
</style>
