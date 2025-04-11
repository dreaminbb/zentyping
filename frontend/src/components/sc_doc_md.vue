<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()
const content = ref('')

// マークダウンファイルをロードする
onMounted(async () => {
  try {
    const response = await fetch('../../md/sc_doc.md') // 静的ファイルのパス
    const text = await response.text()
    content.value = md.render(text)
  } catch (error) {
    console.error('Failed to load markdown:', error)
    content.value = '# 読み込みに失敗しました'
  }
})
</script>

<template>
  <div class="markdown-container">
    <div class="markdown-content" v-html="content"></div>
  </div>
</template>

<style scoped>
.markdown-container {
  padding-top: 70px;
  display: flex;
  width: 100%;
  justify-content: center;
}

.markdown-content {
  font-size: 2.1rem;
  line-height: 1.6;
  width: 60%;
}
</style>
