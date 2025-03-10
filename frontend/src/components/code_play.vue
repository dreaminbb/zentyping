<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import result_display from '@/components/results_display.vue'
import code_switch_bar from '@/components/code_switch_bar.vue'
import { result_data_ref_obj, is_dislay_result_view } from '@/module/play_func'
import { code_load } from '@/module/code_load'
import { code_data } from '@/store/store'

export default defineComponent({
  name: 'code_play',
  components: {
    result_display,
    code_switch_bar
  },

  setup() {
    onMounted(() => {
      try {
        code_load()
      } catch (e) {
        console.error(e)
      }
    })

    // If split code by line break. This line break are romoved. So this func readd line break.
    function add_line_break_to_code_after_spliting(
      splited_code: Array<string>
    ): Array<string> | void {
      if (!splited_code.length) return
      const line_index: number = splited_code.length - 1
      const return_code: Array<string> = []
      for (let i = 0; i < line_index; i++) {
        const tmp: Array<string> = (splited_code[i] ?? '').split('')
        tmp.push('\n')
        return_code.push(tmp.join(''))
      }
      return_code.push(splited_code[line_index] ?? '')
      return return_code
    }

    return {
      result_display,
      code_switch_bar,
      result_data_ref_obj,
      is_dislay_result_view,
      code_data,
      add_line_break_to_code_after_spliting
    }
  }
})
</script>
<template>
  <main id="code_play_main_container" v-if="!is_dislay_result_view">
    <div id="play_info_display_container">
      <div id="time_display" ref="ref_time_display"></div>
    </div>
    <code id="code_display_container">
      <div id="code_display_window" ref="ref_play_code_display_container">
        <span
          v-for="(char, index) in add_line_break_to_code_after_spliting(
            String(
              (code_data().code_data_obj[
                code_data().code_lang as 'python' | 'rust' | 'typescript'
              ]?.[code_data().code_point]?.code as string) ?? '404'
            ).split('\n')
          )"
          :key="index"
          ref="char_spans"
          class="each_line_elm"
        >
          <span
            v-for="(each_char, each_index) in char.split('')"
            :key="each_index"
            :class="{
              each_char_elm: true,
              untyped: true,
              space_elm: each_char === ' ',
              line_break_elm: each_char === '\n'
            }"
            >{{ each_char === ' ' ? '\u00A0' : each_char }}</span
          >
        </span>
      </div>
    </code>
    <code_switch_bar />
  </main>
  <main id="result_view_container" v-if="is_dislay_result_view">
    <result_display v-if="is_dislay_result_view" :result_data="result_data_ref_obj" />
  </main>
</template>

<style>
#code_play_main_container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 10% 80% 10%;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  justify-content: center;
  align-items: center;
  margin: 30px auto;
  bottom: 0;
  height: 100%;
  width: 60%;
  font-size: 2rem;
}

#play_info_display_container {
  display: flex;
  width: 100%;
  top: 0;
  width: 100%;
  height: 100%;
  justify-content: space-around;
  align-items: center;
}

#code_play_main_container #code_display_container code {
  width: 100%;
  height: 100%;
}

#code_display_container {
  width: 100%;
  height: 100%;
  font-size: 1.5rem;
  font-family: 'Courier New', Courier, monospace;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
}

#code_display_window {
  width: 80%;
  height: 80%;
  margin: 10% auto;
}

#type_input {
  position: absolute;
  background: transparent;
  text-decoration: none;
  outline: none;
  border: none;
  resize: no ne;
  width: 0;
  height: 0;
  cursor: none;
}
</style>
