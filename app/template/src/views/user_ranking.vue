<script lang="ts" setup>
import type { ranking_data_if } from '@/interface'
import { onMounted, ref, type Ref } from 'vue'
import { ranking_data_manager } from '../services/fetching_data'
import play_result from '@/components/play_result.vue'

// クリック => グラフのデータを関数で返す => グラフを表示する
const is_display_result_chart: Ref<boolean> = ref<boolean>(false)
const displaying_level: Ref<string> = ref<string>('short')
const rdm_ins = ref(new ranking_data_manager())
const result_data: Ref<ranking_data_if> = ref<ranking_data_if>({} as ranking_data_if)
const type_to_search_user_text: string = '/user:{名前}   又は   /rank:{順位}'
const short_level = ref<HTMLElement>()
const normal_level = ref<HTMLElement>()
const long_level = ref<HTMLElement>()

// onBeforeMount(async () => {}})
// todo ここでfetch_dataを呼び出すと、eデータが取得される前にDOMが描画されてしまう
onMounted(async () => {
  await rdm_ins.value.fetch_data({
    level: 'short',
    range_from: 0,
    range_to: 40,
    target_user_name: null
  })
  short_level.value?.classList.add('chosen_level')
  await rdm_ins.value.fetch_data({
    level: 'short',
    range_from: null,
    range_to: null,
    target_user_name: 'fap_bro'
  })
})

function search_user_by_name(target_user_name: string, level: string): void {
  console.log(target_user_name)
  const target_level: Array<ranking_data_if> =
    rdm_ins.value.ranking_data_obj[level as 'short' | 'normal' | 'long']
  console.log(target_level, '実行時')
  const value_obj = target_level.find((item) => item.name.includes(target_user_name))
  console.log(value_obj , 'value_obj')
  if(value_obj){
    console.log('user exists')
  }else{
    console.log('user does not exist')
  }
}
search_user_by_name('oppai_user', 'short')

async function switch_level(level: 'short' | 'normal' | 'long'): Promise<void> {
  console.log(rdm_ins.value.ranking_data_obj[level as 'short' | 'normal' | 'long'])
  displaying_level.value = level
  console.log(rdm_ins.value.ranking_data_obj, '33')

  if (rdm_ins.value.ranking_data_obj[level as 'short' | 'normal' | 'long'].length === 0) {
    console.log('fetching data')
    await rdm_ins.value.fetch_data({
      level: level,
      range_from: 0,
      range_to: 40,
      target_user_name: null
    })
  }
  if (
    short_level.value &&
    normal_level.value &&
    long_level.value &&
    ['short', 'normal', 'long'].includes(level)
  ) {
    short_level.value.classList.remove('chosen_level')
    normal_level.value.classList.remove('chosen_level')
    long_level.value.classList.remove('chosen_level')
    switch (level) {
      case 'short':
        short_level.value.classList.add('chosen_level')
        break
      case 'normal':
        normal_level.value.classList.add('chosen_level')
        break
      case 'long':
        long_level.value.classList.add('chosen_level')
        break
      default:
        console.error('Invalid level')
        break
    }
  } else {
    console.error('Element is not found')
  }
}

function show_off_display_result_chart_keydown(event: KeyboardEvent): void {

  if (KeyboardEvent && event instanceof KeyboardEvent) {
    if (event.key === 'Escape') {
      console.log('Escape key is pressed')
      is_display_result_chart.value = false
      removeEventListener('keydown', show_off_display_result_chart_keydown)
    }
  }
}

function show_off_display_result_chart(): void {
  is_display_result_chart.value = false
  removeEventListener('keydown', show_off_display_result_chart_keydown)
}
function display_charts(index: number): ranking_data_if | void {
  const tmp = rdm_ins.value.ranking_data_obj[displaying_level.value as 'short' | 'normal' | 'long']

  if (rdm_ins.value.ranking_data_obj && tmp[index]) {
    result_data.value = tmp[index]
  } else {
    console.error('Invalid index or ranking data array is undefined')
  }
  console.log(tmp[index])
  addEventListener('keydown', show_off_display_result_chart_keydown)
  console.log(is_display_result_chart.value)
  is_display_result_chart.value = true
  return tmp[index]
}
</script>

<template>
  <div id="ranking_main">
    <div id="ranking_action_container">
      <table id="each_ranking_level_container">
        <th id="short_level" @click="switch_level('short')" ref="short_level">short</th>
        <th id="normal_level" ref="normal_level" @click="switch_level('normal')">normal</th>
        <th id="long_level" ref="long_level" @click="switch_level('long')">long</th>
      </table>

      <textarea
        name="search_user"
        autocomplete="off"
        spellcheck="false"
        autocapitalize="none"
        autocorrect="off"
        autofocus
        resize="none"
        v-model="type_to_search_user_text"
        id="search_bar"
      ></textarea>
      <!-- 
      <div id="goto_top_ranker" class="user_or_top_ranker">
        <i class="fas fa-crown"></i>
      </div> -->

      <div id="goto_self_ranking" class="user_or_top_ranker">
        <i class="fa-solid fa-user"></i>
        <div id="users_ranking">{{}}</div>
      </div>
    </div>
    <table id="ranking_table">
      <tr id="ranking_label_fm">
        <th v-for="key in 7" :key="key">
          {{
            [
              '順位',
              'ユーザー名',
              '正入力率',
              '一秒間の正入力',
              '一秒間の入力',
              'タイム',
              'タイムスタンプ'
            ][key - 1]
          }}
        </th>
      </tr>
      <tr
        v-for="(user, index) in rdm_ins.ranking_data_obj[
          displaying_level as 'short' | 'normal' | 'long'
        ]"
        :key="`${user.id}-${index}`"
        class="ranking_list"
        @click="() => display_charts(index)"
      >
        <td>{{ index + 1 }}</td>
        <td>{{ user.name }}</td>
        <td>{{ user.correct_rate.toFixed(2) }}%</td>
        <td>{{ user.correct_per_second_num.toFixed(2) }}</td>
        <td>{{ user.input_per_second_num.toFixed(2) }}</td>
        <td>{{ user.time.toFixed(1) }}s</td>
        <td>{{ new Date(user.played_at).toLocaleString() }}</td>
      </tr>
    </table>

    <div id="play_result_container" v-if="is_display_result_chart">
      <play_result :data="result_data" id="play_result_comp" />
      <button @click="show_off_display_result_chart()">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// theme color => tokyo night
@import '../assets/css/main.css';
:root {
  --ranking-row-height: 60px;
}

.chosen_level {
  background: var(--secondary-color) !important;
  color: var(--text-color) !important;
}

#ranking_main {
  height: 700%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;

  #ranking_action_container {
    position: absolute;
    display: grid;
    grid-template-columns: 1fr 0.8fr 0.3fr;
    grid-column-gap: 20px;
    color: var(--font-color);
    height: 5%;
    width: 80%;
    right: 10%;
    top: 15%;
    justify-content: center;
    align-items: center;

    #each_ranking_level_container {
      height: var(--ranking-row-height);
      width: 100%;
      display: grid;
      height: 80%;
      justify-content: center;
      align-items: center;
      grid-template-columns: 1fr 1fr 1fr;
      border-radius: 10px;
      // ここでバックグラウンドをしていすると、クリック時に背景色が変わらない

      th {
        cursor: pointer;
        text-align: center;
        justify-self: center;
        align-self: center;
        width: 90%;
        height: 90%;
        line-height: 30px;
        border-radius: 20px;
        color: var(--font-color);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.3);

        &:hover {
          background-color: var(--secondary-color);
          color: var(--text-color);
        }
      }
    }

    .user_or_top_ranker {
      display: flex;
      cursor: pointer;
      background-color: transparent;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      justify-self: center;
      align-self: center;
      justify-content: center;
      align-items: center;
      i {
        font-size: 1rem;
        color: var(--sub-font-color);
      }
      &:hover {
        background-color: var(--secondary-color);
        i {
          color: var(--font-color);
        }
      }
    }

    textarea {
      border-radius: 20px;
      height: 25px;
      border: solid 1px var(--font-color);
      background: transparent;
      color: var(--font-color);
      text-overflow: ellipsis;
      text-align: center;
      vertical-align: middle;
      line-height: 25px;
      resize: none;
    }
    // [class^='fa-'] {
    //   font-size: 1.5rem;
    // }
  }

  #ranking_table {
    position: absolute;
    text-align: center;
    top: 20%;
    width: 80%;
    right: 10%;
    height: 100%; // ここを変えるとスクロールの長さが変わる(短いとできない)
    border-radius: 10%;
    border-collapse: collapse;
    color: white;
    color: rgb(48, 48, 48);

    tr {
      height: 50px;
    }

    tr:nth-child(1) {
      background-color: var(--background-color);
    }

    tr:nth-child(even) {
      background: transparent;
      color: rgba(255, 255, 255, 0.502);
    }
    tr:nth-child(odd) {
      background: var(--primary-color);
    }

    #crown {
      position: relative;
      top: 30%;
    }
  }

  #play_result_container {
    position: absolute;
    background: var(--sub-background-color);
    top: 20%;
    right: 5%;
    width: 90%;
    height: 45%;
    border-radius: 10px;
    display: grid;
    grid-template-columns: 95% 5%;

    #play_result_comp {
      position: relative;
      width: 90%;
      height: 95%;
      justify-self: center;
      align-self: center;
    }

    button {
      position: relative;
      width: 40px;
      height: 40px;
      opacity: 0.8;
      justify-self: right;
      background: transparent;
      border-radius: 20px;
      color: var(--sub-font-color);
      border: none;
      font-size: 1.5rem;
      cursor: pointer; // マウスが重なった時にカーソルが変わる
      transition: 0.3s;
      &:hover {
        box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.5);
        background: var(--primary-color);
        color: var(--text-color);
        justify-self: right;
        width: 50px;
        height: 50px;
        transition: 0.3s ease;
      }
    }
  }
}
</style>
