<script lang="ts">
import { defineComponent } from 'vue'
import type { result_data_itf } from '@/module/play_func'

export default defineComponent({
  name: 'result_view',
  props: {
    result_data: {
      type: Object as () => result_data_itf,
      required: true
    }
  },
  setup() {}
})
</script>

<template>
  <main id="result_main_container">
    <div id="wpm_acc_time_container">
      <div class="wpm_acc_time_class">毎分単語数 {{ result_data.wpm }}</div>
      <div class="wpm_acc_time_class">正入力率 {{ result_data.acc }} %</div>
      <div class="wpm_acc_time_class">時間 {{ result_data.time.toFixed(2)}} 秒</div>
    </div>
  </main>
</template>

<style>
#result_main_container {
  width: 100%;
  height: 100%;
}

#wpm_acc_time_container{
  width: 100%;
  display: flex;
  justify-content: space-around;
  top: 0;
}
</style>
