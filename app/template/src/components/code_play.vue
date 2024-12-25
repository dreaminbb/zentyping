y
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import play_func from '@/module/play_func'
import { ref } from 'vue'
import '../assets/css/global.css'
import type { Ref } from 'vue'


const code_display_container = ref<HTMLElement | null>(null)
const char_spans = ref([])

// todo
// タイピングして正誤で色をつてける。


const sample_code = `function greet() {
  console.log('Hello, world!');
}`


onMounted(() => {
  play_func.init(sample_code)
  play_func.fetch_char_spans_ignore_space_after_line_break_as_elm(code_display_container)
})

// play_func -> プレイに関する関数をまとめたモジュール
// ここでは、コードの表示と、関数の実行を行う。

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
