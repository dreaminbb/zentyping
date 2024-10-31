<script lang="ts" setup>
import type { ranking_data_if } from '@/interface'
import { onBeforeMount, onMounted, ref, type Ref } from 'vue'
import { ranking_data_manager } from '@/services/fetching_deta'
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
    range_to: 30
  })
  if (!rdm_ins.value.ranking_data_arr) {
    rdm_ins.value.ranking_data_arr = []
  }
  console.log('on before mount')
  console.log(rdm_ins.value.ranking_data_arr, 'rdm_ins.ranking_data_arr')
})

function display_charts(index: number): ranking_data_if {
  is_display_result_chart.value = true

  if (rdm_ins.value.ranking_data_arr && rdm_ins.value.ranking_data_arr[index]) {
    result_data.value = rdm_ins.value.ranking_data_arr[index]
  } else {
    console.error('Invalid index or ranking data array is undefined')
  }
  console.log(rdm_ins.value.ranking_data_arr[index])
  return rdm_ins.value.ranking_data_arr[index]
}
</script>

<template>
  <div>
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

    <div id="rusult_area" v-if="is_display_result_chart">
      <play_result :data="result_data" />
    </div>
  </div>
</template>

<style lang="scss">
body {
  height: 700%;
  width: 100%;
  background: rgba(169, 147, 147, 0.5);
  overflow-x: hidden;
  overflow-y: scroll;

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

  #rusult_area {
    position: absolute;
    background: rgba(169, 147, 147, 0.7);
    top: 20%;
    right: 10%;
    width: 80%;
    height: 300px;
    padding: 10px;
    display: grid;
    grid-template-columns: 0.3fr 1fr;
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;

    #line_chart {
      .div1 {
        grid-area: 1 / 1 / 2 / 2;
      }
    }
  }
}
</style>
