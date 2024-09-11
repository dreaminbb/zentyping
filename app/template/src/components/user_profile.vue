<script lang="ts" setup>

import { ref } from 'vue'
import { user_info } from '@/store/store'
import user_active_calender from '@/components/user_activity_calender.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


const formated_user_read_me = ref<string>(user_info().user_read_me.replace(/\n/g, '<br>'))
const is_edit_user_profile = ref<boolean>(false)
const new_user_name = ref<string>(user_info().new_user_name)
const new_user_read_me = ref<string>(user_info().user_new_read_me)
const new_user_github_link = ref<string>(user_info().new_user_github_link)
const new_user_twitter_link = ref<string>(user_info().new_user_twitter_link)
const editing_user_read_me = ref<string>(user_info().user_read_me)
const editing_user_name = ref<string>(user_info().user_name)
const user_read_me_value = user_info().user_read_me !== '' ? ref<string>(user_info().user_read_me) : ref<string>('tinnko')
const github_dot_com = 'github.com'
const x_twitter_dot_com = 'twitter.com'
const adding_github_link = ref<HTMLElement | null>(null)
const github_link = ref<string | undefined>(github_dot_com)
const x_twitter_link = ref<string>(x_twitter_dot_com)
const user_profile_changed_something = ref<boolean>(false)

const is_display_ac = ref<boolean>(true)

function link_textarea_focusing(link_name: string): void {
  if (link_name === 'github' && github_link.value === github_dot_com) {
    github_link.value = ''
  } else if (link_name === 'twitter') {
    x_twitter_link.value = ''
  }
}

function link_textarea_blur(link_name: string): void {
  if (link_name === 'github' && github_link.value === '') {
    github_link.value = github_dot_com
  } else if (link_name === 'twitter' && x_twitter_link.value === '') {
    x_twitter_link.value = x_twitter_dot_com
  }
}

function user_changed_name(): void {
  user_profile_changed_something.value = editing_user_name.value !== user_info().user_name
}

function user_changed_read_me(): void {
  if (editing_user_read_me.value !== user_info().user_read_me) {
    user_profile_changed_something.value = true
  } else {
    user_profile_changed_something.value = false
  }
}

// githubのユーザーは設定を変更できないようにする
function user_changed_github_link(): void {
  if (github_link.value !== user_info().user_github_link) {
    user_profile_changed_something.value = true
  } else {
    user_profile_changed_something.value = false
  }
}

function user_changed_twitter_link(): void {
  if (x_twitter_link.value !== user_info().user_twitter_link) {
    user_profile_changed_something.value = true
  } else {
    user_profile_changed_something.value = false
  }
}

//ここにAPIに変更リクエストを送信する処理を
function save_user_profile_edit(): void {
  if (user_profile_changed_something.value) {
    console.log("ユーザー情報を保存しました。")
  }
}
</script>

<template>
  <div id="profile_edit_fm" v-if="is_edit_user_profile">
    <div id="edit_user_name_fm">
      <span id="__user_name__">名前 :</span>
      <textarea id="edit_user_name" maxlength="25" v-model="editing_user_name" @input="user_changed_name"></textarea>
    </div>

    <textarea id="edit_user_read_me" maxlength="500" v-model="editing_user_read_me"
              @input="user_changed_read_me"></textarea>

    <div id="link_manager">
      <div id="link_icon_container">
        <font-awesome-icon :icon="['fab', 'github']" id="github_icon" class="github_twitter_icon" />
        <font-awesome-icon :icon="['fab', 'x-twitter']" class="github_twitter_icon" />
      </div>

      <div id="adding_link_container">
        <textarea
          name=""
          id="github_link"
          v-model="github_link"
          cols="30"
          rows="10"
          @focus="link_textarea_focusing('github')"
          @blur="link_textarea_blur('github')"
          @input="user_changed_github_link"
        ></textarea>
        <textarea
          name=""
          id="twitter_link"
          cols="30"
          rows="10"
          v-model="x_twitter_link"
          @focus="link_textarea_focusing('twitter')"
          @blur="link_textarea_blur('twitter')"
          @input="user_changed_twitter_link"
        ></textarea>
      </div>
    </div>

    <button id="save_btn" @click="save_user_profile_edit"
            :class="{ user_profile_changed_something_class:user_profile_changed_something,user_didnt_changed_profile_class:!user_profile_changed_something  }">
      保存
    </button>
    <font-awesome-icon
      icon="fa-solid fa-circle-xmark"
      id="exit_btn_icon"
      @click="is_edit_user_profile = false"
    />
  </div>

  <user_active_calender id="activity_calender" v-if="is_display_ac" />

  <div id="profile_rm" :class="{ be_fogged: is_edit_user_profile }">
    <div id="user_icon_name_fm">
      <img src="" alt="" id="user_icon" />
      <div id="user_name">{{ user_info().user_name }}</div>
    </div>
    <div id="link_container"></div>
    <span id="user_read_me" v-html="formated_user_read_me"></span>

    <button id="edit_profile_button" @click="is_edit_user_profile = true">
      <font-awesome-icon :icon="['fas', 'pen']" id="edit_profile_icon" />
    </button>

  </div>
</template>

<style lang="scss" >
.be_fogged {
  filter: blur(10px);
}

.user_profile_changed_something_class {
  background: #b9b9b9;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.user_didnt_changed_profile_class {
  background: #333333;
}

#profile_edit_fm {
  position: absolute;
  display: flex;
  width: 80%;
  height: 90%;
  left: 10%;
  //background: rgb(0, 0, 0);
  background: transparent;
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  top: 5%;
  z-index: 1;
  padding: 20px;

  textarea {
    resize: none;
    overflow: hidden;
  }

  textarea:focus {
    outline: none;
    border: #c7caff;
    box-shadow: #ffffff 0px 0px 10px 3px;
  }

  #edit_user_name_fm {
    position: absolute;
    display: flex;
    width: 90%;
    right: 5%;
    top: 5%;
    border-radius: 20px;
    height: 5%;
    padding: 20px 30px 20px 30px;
    background: transparent;
    border: none;
    align-items: center;
    color: var(--main--font-color);

    #__user_name__ {
      position: absolute;
      display: flex;
      width: 10%;
      left: 10%;
      height: 100%;
      background: transparent;
      justify-content: center;
      align-items: center;
      font-size: 1rem;
    }

    #edit_user_name {
      position: absolute;
      display: flex;
      width: 65%;
      right: 13%;
      border-radius: 20px;
      padding: 5px 20px 10px 20px;
      height: 100%;
      background: transparent;
      color: var(--main--font-color);
      border: solid 1px rgba(255, 255, 255, 0.52);
      text-align: center;
      justify-self: center;
      font-size: 1.3rem;
    }
  }

  #edit_user_read_me {
    position: absolute;
    display: flex;
    width: 80%;
    border-radius: 20px;
    background: transparent;
    border: solid 1px rgba(255, 255, 255, 0.52);
    color: var(--main--font-color);
    height: 50%;
    top: 20%;
    right: 10%;
    padding: 20px;
    font-size: 1rem;
  }

  #link_manager {
    position: absolute;
    display: flex;
    //grid-template-columns: ;
    //grid-template-rows: repeat(2, 1fr);
    //grid-column-gap: 0px;
    //grid-row-gap: 0px;
    bottom: 10%;
    border-radius: 20px;
    left: 10%;
    width: 80%;
    height: 13%;
    background: transparent;

    .link_char {
      color: var(--main--font-color);
    }

    #link_icon_container {
      position: absolute;
      display: grid;
      grid-template-rows: repeat(2, 1fr);
      grid-column-gap: 0px;
      grid-row-gap: 0px;
      width: 10%;
      height: 100%;
      border-radius: 20px 0 0 20px;
      left: 0;
      background: transparent;
      justify-content: center;
      align-items: center;

      .github_twitter_icon {
        //width: 90% ;
        height: 80%;
        color: white;
        //justify-self: cent  er;
        //align-self: center;
      }
    }

    #adding_link_container {
      position: absolute;
      display: grid;
      grid-template-rows: repeat(2, 1fr);
      grid-column-gap: 0px;
      grid-row-gap: 5px;
      width: 90%;
      height: 100%;
      right: 0;

      textarea {
        padding: 15px 30px 10px 30px;
        border-radius: 10px;
        background: transparent;
        color: var(--main--font-color);
      }
    }
  }

  #save_btn {
    position: absolute;
    display: flex;
    border: white;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    width: 100px;
    height: 45px;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    letter-spacing: 5px;
    bottom: 10px;
    right: 10px;
  }
}

#exit_btn_icon {
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  color: rgba(195, 195, 195, 0.34);
  border-radius: 90px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  &:hover {
    box-shadow: rgba(255, 255, 255, 0.11) 1px 1px 10px 5px;
    color: #a5a5a5;
    animation: deg360 0.3s linear;

    @keyframes deg360 {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(180deg);
      }
    }
  }
}

#edit_profile_button {
  position: absolute;
  display: flex;
  width: 50px;
  height: 50px;
  top: 5%;
  left: 0;
  border-radius: 50px;
  right: 0;
  background: rgba(193, 193, 193, 0.07);
  border: none;
  justify-content: center;
  align-items: center;

  &:hover {
    background: rgb(197, 197, 197);

    #edit_profile_icon {
      color: black;
    }
  }

  #edit_profile_icon {
    color: var(--main--font-color);
    height: 1.5rem;
    width: 1.5rem;
  }
}

#profile_rm {
  width: 100%;
  height: 100%;

  #user_icon_name_fm {
    position: absolute;
    display: flex;
    top: 7.5%;
    width: 23%;
    left: 5%;
    height: 41%;
    background: transparent;
    justify-content: center;
    align-items: center;
    padding: 10px;

    #user_icon {
      position: absolute;
      display: flex;
      width: 250px;
      height: 250px;
      top: 0;
      justify-self: center;
      background-color: rgba(106, 106, 106, 0.74);
      border-radius: 200px;
    }

    #user_name {
      position: absolute;
      display: flex;
      bottom: 2.5%;
      height: 10%;
      width: 90%;
      background: transparent;
      border-radius: 10px;
      border: white 1px solid;
      color: var(--main--font-color);
      justify-content: center;
      align-items: center;
      letter-spacing: 3px;
    }
  }

  #user_read_me {
    white-space: pre-line;
    word-wrap: break-word; /* Allows long words to be broken and wrapped to the next line */
    word-break: break-all; /* Ensures that text will break and wrap within the element */
    text-align: left;
    line-height: 2;
    position: absolute;
    display: flex;
    background: transparent;
    width: 65%;
    height: 40%;
    top: 7.5%;
    right: 5%;
    border-radius: 20px;
    border: 2px solid rgb(255, 255, 255);
    padding: 10px 20px 10px 20px;
    color: var(--main--font-color);

    #keyboard_fm {
      position: absolute;
      display: flex;
      padding: 10px;
      bottom: 0;
      width: 100%;
      height: 15%;
      right: 0;
      border-top: 2px solid rgb(255, 255, 255);
      border-radius: 10px;
    }
  }
}

#activity_calender {
  position: absolute;
  display: flex;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 50%;
  background: transparent;
  border: none;
  border-radius: inherit;
  justify-content: center;
  align-items: center;

  //曜日の表示
  #day_of_week_display {
    position: absolute;
    height: 50%;
    width: 2%;
    left: 1%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, minmax(3px, 1fr));
    grid-row-gap: 10px;
    color: var(--main--font-color);
  }

  #day_of_week_display div {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  //アクティブカレンダーの中身
  #calender_body {
    left: 3%;
    padding-left: 10px;
    position: absolute;
    height: 40%;
    width: 95%;
    display: grid;
    grid-column-gap: 5px;
    grid-row-gap: 5px;

    #same_day_of_week {
      display: flex;
      background: transparent;
      grid-column-gap: 5px;
    }

    .active_days {
      width: 100%;
      height: 100%;
      display: flex;
      border: 1px solid;
      border-radius: 5px;
      border-color: var(--sub--font-color);
    }

  }

  #active_level_sample {
    position: absolute;
    display: grid;
    bottom: 10%;
    right: 10%;
    height: 5%;
    grid-template-columns: 2fr repeat(5, 15px) 2fr;
    grid-template-rows: 15px;
    grid-column-gap: 15px;
    grid-row-gap: 10px;
    align-items: center;

    .active_sample_char {
      color: var(--main--font-color);
    }

    .active_level_sample_eml {
      width: 100%;
      height: 100%;
      border: 1px solid;
      border-radius: 5px;
      border-color: var(--sub--font-color);
      padding-left: 10px;
    }
  }
}

</style>
