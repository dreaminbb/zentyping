<script setup lang="ts">
import { ref } from 'vue'
import user_play_history from '@/components/user_play_history.vue'
import user_profile from '@/components/user_profile.vue'

const user_icon_display = ref()

const is_display_user_profile = ref<boolean>(false)
const is_display_user_play_history = ref<boolean>(true)
const is_display_ranking_view = ref<boolean>(false)
const is_display_setting_view = ref<boolean>(false)
const is_display_help_view = ref<boolean>(false)

const color = 'rgba(0, 0, 0, 0.5)'
const ranking_view = ref<boolean>(false)
const user_setting_view = ref<boolean>(false)
const help_view = ref<boolean>(false)


function display_user_profile(): void {
  is_display_user_profile.value = true
  is_display_user_play_history.value = false
}

function display_user_play_history(): void {
  is_display_user_profile.value = false
  is_display_user_play_history.value = true
}


async function fetch_user_info(): Promise<void> {
  if (document.cookie) {
    try {
      const response: Response = await fetch('http://localhost:8000/user/info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      if (response.status === 200) {
        if (data) {
          // play_history_value.value = data['play_history']
          // user_name.value = data['name'] as string
          // bio.value = data['bio'] as string
          // joined_day.value = data['created_at'].split('T')[0].replace(/-/g, ':') as string
          // play_count.value = data['total_result']['play_count'] as number
          //
          //
          // const total_time: number = data['total_result']['total_time'] as number
          // const activity_calender_value: Array<{
          //   week_number: number,
          //   dray_of_week: string,
          //   play_count_in_day: number
          // }> | undefined = data['activity_calender'] || undefined
          //
          //
          // if (activity_calender_value) {
          //   generate_user_activity_calender(activity_calender_value, 2024)
          // } else {
          //   console.log('no activity_calender')
          // }
          // format_time((total_time))
          // short_correct_rate.value = data['total_result']['short_correct_rate'] as number
          // normal_correct_rate.value = data['total_result']['normal_correct_rate'] as number
          // long_correct_rate.value = data['total_result']['long_correct_rate'] as number
        } else {
          // console.log('you are bad boy')
          // user_name.value = '(:'
          // formated_time.value = '00:00'
        }
      } else if (response.status === 401) {
        console.log('ログインし直してください')
        return
      } else if (response.status === 500) {
        console.log('サーバー側でエラーが発生しました')
        return
      }
    } catch (error) {
      console.error(error)
      return
    }
  } else {
    console.log('no cookie???')
    return
  }
}
</script>

<template>
  <body>
  <div id="display_all_profile">

    <div id="menu_bar_fm">
      <div id="menu_bar">
        <div id="user_profile_button" :class="{menu_item:true , active_menu:is_display_user_profile}"
             @click="display_user_profile">
          <font-awesome-icon :icon="['fas', 'user']" class="menu_icon" />
        </div>
        <div id="user_play_info" :class="{menu_item:true , active_menu:is_display_user_play_history}"
             @click="display_user_play_history">
          <font-awesome-icon :icon="['fas', 'list']" class="menu_icon" />
        </div>
        <div id="ranking_view" :class="{menu_item:true , active_menu:is_display_ranking_view}">
          <font-awesome-icon :icon="['fas', 'ranking-star']" class="menu_icon" />
        </div>
        <div id="user_setting" :class="{menu_item:true , active_menu:is_display_setting_view}">
          <font-awesome-icon :icon="['fas', 'gear']" class="menu_icon" />
        </div>
        <div id="help " :class="{menu_item:true , active_menu:is_display_help_view}">
          <font-awesome-icon :icon="['fas', 'question']" class="menu_icon" />
        </div>
      </div>
    </div>
    <div id="viewer_container">
      <user_profile class="view_elms" v-if="is_display_user_profile" />
      <user_play_history class="view_elms" v-if="is_display_user_play_history" />
    </div>
  </div>
  </body>
</template>

<style lang="scss">


:root {
  --main-bg-color: #1a1a1a;
  --main-icon-color: #dabfbf;
  --main--font-color: #f0f0f0;
  --sub--font-color: #808080;
  --active_border_color: rgb(35, 33, 41);
  --active_bg_color: rgb(40, 39, 48);
  --diactive--border-color: rgb(40, 39, 48);
}

.active_menu {
  background: var(--active_bg_color);
  border: 1px solid var(--active_border_color);
  animation: forwards 0.3s get_longer;
}

@keyframes get_longer {
  0% {
    justify-content: center;
  }
  100% {
    width: 90%;
    box-shadow: #9ba4f3 0px 0px 10px 0px;
  }
}

#display_all_profile {
  position: absolute;
  top: 8%;
  left: 5%;
  display: flex;
  height: 90%;
  width: 90%;
  background: transparent;
  border-radius: 16px;
  justify-content: center;
  padding: 10px;

  #menu_bar_fm {
    position: absolute;
    display: flex;
    left: 0;
    height: 100%;
    width: 20%;
    background: transparent;
    border-radius: 16px;
    justify-content: center;
    align-items: center;

    #menu_bar {
      position: absolute;
      top: 0;
      width: 100%;
      height: 50%;
      background: transparent;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: repeat(5, 1fr);
      grid-row-gap: 10px;
      text-align: center;
      padding: 10px;
    }


    .menu_item {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 20px;
      width: 20%;
      color: var(--sub--font-color);


      .menu_icon {
        justify-self: center;
        color: var(--sub--font-color);
        font-size: 1.5rem;
      }
    }

    .menu_item:hover {
      background: var(--diactive--border-color);
      border: none;
    }
  }
}

#viewer_container {
  position: absolute;
  height: 100%;
  right: 0;
  width: 80%;
  background: transparent;
  border-radius: 20px;


  .view_elms {
    width: 100%;
    height: 100%;
  }
}
</style>