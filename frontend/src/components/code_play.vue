<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import result_display from '@/components/results_display.vue'
import code_switch_bar from '@/components/code_switch_bar.vue'
import { result_data_ref_obj, is_dislay_result_view } from '@/module/play_func'
import { ref } from 'vue'
import { store_code_type } from '@/interface'
import { code_load } from '@/module/code_load'
import { code_data } from '@/store/store'
import code_author from '@/components/code_author.vue'

export default defineComponent({
  name: 'code_play',
  components: {
    code_author,
    result_display,
    code_switch_bar
  },

  setup() {
    onMounted(async () => {
      try {
        code_load()
      } catch (e) {
        console.error(e)
      }
    })

    const code_play_elm_key = ref(0)
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

    function rerendering_code_display_elm(): void {
      code_play_elm_key.value++
    }

    return {
      result_display,
      code_switch_bar,
      code_author,
      result_data_ref_obj,
      is_dislay_result_view,
      code_data,
      code_play_elm_key,
      add_line_break_to_code_after_spliting,
      rerendering_code_display_elm
    }
  }
})
</script>
<template>
  <main id="code_play_main_container" v-if="!is_dislay_result_view" :key="code_play_elm_key">
    <div id="play_info_display_container">
      <div id="time_display" ref="ref_time_display"></div>
      <code_author
        :key="code_data().code_point"
        :author="
          code_data().code_data_obj?.[code_data().code_lang as keyof store_code_type]?.[
            code_data().code_point
          ]?.author as string
        "
      />
    </div>
    <code id="code_display_container">
      <div id="code_display_window" ref="ref_play_code_display_container">
        <span
          v-for="(char, index) in add_line_break_to_code_after_spliting(
            String(
              code_data().code_data_obj?.[code_data().code_lang as keyof store_code_type]?.[
                code_data().code_point
              ]?.code ?? ''
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
/*change font size at global.css*/

#code_play_main_container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 8% 84% 8%;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  justify-content: center;
  align-items: center;
  margin: 30px auto;
  bottom: 0;
  height: 100%;
  width: 55%;
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
  height: 90%;
  letter-spacing: 2px;
  border-radius: 15px;
  align-items: top;
  justify-content: center;
}

#code_display_window {
  width: 98%;
  height: 100%;
  margin: 2% auto;
}

.each_line_elm {
  width: 100%;
  margin: 0;
  padding-top: 10px;
  display: flex;
  text-align: left;
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
