<script setup lang="ts">
import { onMounted } from 'vue'
import play_func from '@/module/play_func'
import { ref } from 'vue'
import '../assets/css/global.css'
import type { Ref } from 'vue'

const code_display_container: Ref<HTMLElement | null> = ref<HTMLElement | null>(null)
const char_spans: Ref<HTMLElement[]> = ref<HTMLElement[]>([])

const sample_code = `function main(): void {
  console.log('I use mac,btw')
}`

//If split code by line break. This line break are romoved. So this func readd line break.
function add_line_break_to_code_after_spliting(splited_code: Array<string>): Array<string> {
  const line_index: number = splited_code.length - 1
  const return_code: Array<string> = []
  for (let i = 0; i < line_index; i++) {
    const tmp: Array<string> = splited_code[i].split('')
    tmp.push('\n')
    return_code.push(tmp.join(''))
  }
  return_code.push(splited_code[line_index])
  return return_code
}

onMounted(() => {
  try {
    play_func.init_set_start(sample_code , code_display_container.value as HTMLElement)
  } catch (e) {
    console.error(e)
  }
})
</script>
<template>
  <main id="code_play_main_container">
    <code id="code_display_container" ref="code_display_container">
      <span
        v-for="(char, index) in add_line_break_to_code_after_spliting(sample_code.split('\n'))"
        :key="index"
        ref="char_spans"
        class="each_line_elm"
      >
        <span
          v-for="(each_char, each_index) in char.split('')"
          :key="each_index"
          :class="{
            each_char_elm: true,
            space_elm: each_char === ' ',
            line_break_elm: each_char === '\n'
          }"
          >{{ each_char === ' ' ? '\u00A0' : each_char }}</span
        >
      </span>
    </code>
  </main>
</template>
