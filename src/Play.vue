<script>
import { ref, onMounted } from 'vue'

const writting = 'おだいをかいてみよう'
const displayText = ref('')
onMounted(() => {
  let index = 0
  setInterval(() => {
    if (index < writting.length) {
      displayText.value += writting.charAt(index)
      index++
    } else {
      index = 0
      displayText.value = ''
    }
  }, 300) // 1秒ごとに文字を追加
})
</script>
<template>
  <div>
    <h1>GamePlay</h1>
  </div>
</template>
<style scoped>
h1 {
  color: red;
}
</style>
