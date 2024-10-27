<script lang="ts" setup>
import type { ranking_data_if } from '@/interface'
import { onBeforeMount, ref } from 'vue'
import { fetch_from_api as rf } from '@/services/fetching_deta'

const ranking_info_arr = ref<Array<ranking_data_if>>([])

onBeforeMount(async () => {
  const fetching_deta: any = await new rf().fetch_data({
    level: 'short',
    range_from: 0,
    range_to: 15
  })

  if (fetching_deta && fetching_deta['data']) {
    ranking_info_arr.value = fetching_deta['data']
  } else if (fetching_deta && fetching_deta['error']) {
    ranking_info_arr.value = fetching_deta['deta']
    console.log(fetching_deta['error'])
  }
})

const ranking_deta_label_arr: Array<string> = [
  '順位',
  'ユーザー名',
  '正入力率',
  '一秒間の正入力',
  '一秒間の入力',
  'タイム',
  'タイムスタンプ'
]
</script>

<template>
  <body>
    <table id="ranking_table">
      <tr id="ranking_label_fm">
        <th v-for="key in 7" :key="key">
          {{ ranking_deta_label_arr[key - 1] }}
        </th>
      </tr>
      <tr v-for="(user, index) in ranking_info_arr" :key="user.id" class="ranking_list">
        <td v-if="index != 0">
          {{ index + 1 }}
        </td>
        <div v-if="index == 0" class="fas fa-crown" id="crown"></div>
        <td>{{ user.name }}</td>
        <td>{{ user.correct_rate.toFixed(2) }}%</td>
        <td>{{ user.correct_per_second_num.toFixed(2) }}</td>
        <td>{{ user.input_per_second_num.toFixed(2) }}</td>
        <td>{{ user.time.toFixed(1) }}s</td>
        <td>{{ new Date(user.played_at).toLocaleString() }}</td>
      </tr>
    </table>
  </body>
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
    width: 90%;
    height: 100%; // ここを変えるとスクロールの長さが変わる(短いとできない)
    border-radius: 10%;
    border-collapse: collapse;
    color: white;
    color: rgb(48, 48, 48);

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
}
</style>
