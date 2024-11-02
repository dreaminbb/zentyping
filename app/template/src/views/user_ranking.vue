<script lang="ts" setup>
import type { ranking_data_if } from '@/interface'
import { onBeforeMount, onMounted, ref, type Ref } from 'vue'
import { ranking_data_manager } from '../services/fetching_data'
import play_result from '@/components/play_result.vue'

// クリック => グラフのデータを関数で返す => グラフを表示する
const is_display_result_chart: Ref<boolean> = ref<boolean>(false)
const rdm_ins = ref(new ranking_data_manager())
const result_data: Ref<ranking_data_if> = ref<ranking_data_if>({} as ranking_data_if)

// onBeforeMount(async () => {})
onMounted(async () => {
  console.log('on mounted')
  console.log(rdm_ins.value.ranking_data_arr, 'rdm_ins.ranking_data_arr')
  await rdm_ins.value.fetch_data({
    level: 'short',
    range_from: 0,
    range_to: 40
  })
  if (!rdm_ins.value.ranking_data_arr) {
    rdm_ins.value.ranking_data_arr = []
  }
  console.log('on before mount')
  console.log(rdm_ins.value.ranking_data_arr, 'rdm_ins.ranking_data_arr')
})

function display_charts(index: number): ranking_data_if {
  if (rdm_ins.value.ranking_data_arr && rdm_ins.value.ranking_data_arr[index]) {
    result_data.value = rdm_ins.value.ranking_data_arr[index]
  } else {
    console.error('Invalid index or ranking data array is undefined')
  }
  console.log(rdm_ins.value.ranking_data_arr[index])
  is_display_result_chart.value = true
  return rdm_ins.value.ranking_data_arr[index]
}
</script>

<template>
  <div id="ranking_main">
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
        v-for="(user, index) in rdm_ins.ranking_data_arr"
        :key="user.id"
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
#ranking_main {
  height: 700%;
  width: 100%;
  background: rgba(169, 147, 147, 0.5) !important;
  overflow-x: hidden;
  overflow-y: scroll;

  // なんか知らんけどグラフがビヨーンって伸びるので copilot これを修正してくれ

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
      border-bottom: 1px solid #ddd;
    }

    tr:nth-child(1) {
      background: rgba(169, 147, 147, 0.7);
      border-radius: 10%;
    }

    tr:nth-child(even) {
      background: #ddd;
    }

    #crown {
      position: relative;
      top: 30%;
    }
  }

  #play_result_container {
    position: absolute;
    background: rgba(169, 147, 147, 0.7);
    top: 20%;
    right: 5%;
    width: 90%;
    height: 45%;

    #play_result_comp {
      position: relative;
      width: 90%;
      height: 95%;
      justify-self: center;
      align-self: center;
    }
  }
}
</style>
