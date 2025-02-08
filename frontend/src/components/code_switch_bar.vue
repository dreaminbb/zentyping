<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { code_data } from '@/store/store'
import { code_load } from '@/module/code_load'

export default defineComponent({
  name: 'code_switch_bar',
  setup() {
    const selectedLang = ref<string | null>(null)
    onMounted(() => {
      selectedLang.value = code_data().code_lang
    })

    function switchLang(langName: string): void {
      try {
        selectedLang.value = langName
        code_data().code_point = 0
        code_data().store_lang_param_local_storage(langName)
        code_data().code_lang = langName
        code_load()
      } catch (e) {
        console.log(e)
      }
    }
    return { switchLang, selectedLang, code_data, code_load }
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
    <div
      class="code_change_fm"
      id="next_code"
      @click="
        () => {
          code_load(), code_data().code_point++
        }
      "
    >
      <font-awesome-icon icon="arrow-rotate-left" id="code_change_icon" />
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
  width: 22%;
  height: 90%;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  z-index: 10;
  /*if dont use z-index sometimes touching dosent work*/
}
.code_change_fm {
  display: flex;
  width: 10%;
  height: 90%;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
#next_code {
  z-index: 10;
}
</style>
