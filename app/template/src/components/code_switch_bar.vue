<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { code_param } from '@/store/store'
export default defineComponent({
  name: 'code_switch_bar',
  setup() {
    const selectedLang = ref<string | null>(null)
    onMounted(() => {
      selectedLang.value = code_param().code_lang ? code_param().code_lang : 'rust'
      console.log(code_param().code_lang, selectedLang.value)
    })
    function switchLang(langName: string): void {
      try {
        selectedLang.value = langName
        code_param().store_long_param_local_storage(langName)
      } catch (e) {
        console.log(e)
      }
    }
    return { switchLang, selectedLang }
  }
})
</script>

<template>
  <div id="main_container">
    <div
      v-for="lang in ['python', 'rust', 'typescript']"
      :class="{ lang_switch_fm: true, chosen_switch: selectedLang === lang }"
      @click="switchLang(lang as any)"
      :key="lang"
    >
      <i :class="`nf nf-dev-${lang} lang`"></i>
    </div>
  </div>
</template>

<style scoped>
#main_container {
  width: 80%;
  height: 50px;
  margin: 0 auto;
  display: flex;
  background-color: transparent;
  justify-content: space-between;
  align-items: center;
}

.lang_switch_fm {
  display: flex;
  width: 30%;
  height: 90%;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  z-index: 10;
  /*if dont use z-index sometimes touching dosent work*/
}
</style>
