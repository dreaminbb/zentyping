<script setup lang="ts">
import { provide, ref, inject, type Ref, onMounted } from 'vue'
import { apiKey_github_sigin } from '@/main'

//githubでサインイン
function github_signin() {}
</script>

<template>
  <body>
    <div id="sign_in_fm">
      <div id="sign_with_other_and_mp_fm">
        <textarea
          class="usr_info_input"
          name="usr_ma"
          id="usr_ma"
          autocomplete="off"
          spellcheck="false"
          autocapitalize="none"
          maxlength="100"
        ></textarea>
        <textarea
          class="usr_info_input"
          name="usr_pw"
          id="usr_pw"
          autocomplete="off"
          spellcheck="false"
          autocapitalize="none"
          maxlength="100"
        ></textarea>

        <button id="sign_in_buttom">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="sign_in_icon">
            <path
              d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"
            />
          </svg>
        </button>

        <button @click="github_signin()" id="github_bar_fm" class="login_bar_fm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 496 512"
            id="github_icon"
            class="signin_svg_icon"
          >
            <path
              d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
            />
          </svg>
          <p id="sigin_with_github_char" class="sign_in_with_char">githubでサインイン</p>
        </button>

        <button id="google_bar_fm" class="login_bar_fm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
            id="google_icon"
            class="signin_svg_icon"
          >
            <path
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            />
          </svg>
          <p id="sigin_with_github_char" class="sign_in_with_char">googleでサインイン</p>
        </button>
      </div>

      <div id="sign_in_with_mp_fm">
        <div id="testarea_container">
          <textarea
            class="usr_info_input"
            name="new_usr_ma"
            id="new_usr_ma"
            autocomplete="off"
            spellcheck="false"
            autocapitalize="none"
            maxlength="100"
          ></textarea>
          <textarea
            class="usr_info_input"
            name="new_usr_pw"
            id="new_usr_pw"
            autocomplete="off"
            spellcheck="false"
            autocapitalize="none"
            maxlength="100"
          ></textarea>
        </div>
        <button id="sign_in_go_on">サインインアップ</button>
      </div>

      <div id="create-acount">
        <div id="testarea_container">
          <!-- <p>メールアドレス</p>
        <textarea name="new_usr_ma" id="new_usr_ma"></textarea>
        <P>パスワード</P>
        <textarea name="usr_pw" id="usr_pw"></textarea> -->
        </div>
      </div>
    </div>
  </body>
</template>

<style lang="scss">
#sign_in_fm {
  position: absolute;
  display: flex;
  height: 50%;
  width: 60%;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.3);

  .usr_info_input {
    position: absolute;
    padding: 0;
    margin: 0;
    resize: none;
    background: rgba(255, 255, 255, 0.34);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(15.1px);
    -webkit-backdrop-filter: blur(15.1px);
    border: 1px solid rgb(218, 218, 218);
    height: 10%;
    width: 70%;
    overflow: hidden;
    padding: 10px 10px 10px 10px;
    caret-color: rgb(224, 126, 124);
    color: #636363;
  }

  .usr_info_input:focus {
    border: white 2px solid;
    outline: none;
  }

  #sign_in_buttom {
    position: absolute;
    display: flex;
    top: 25%;
    right: 0;
    border: none;
    background-color: transparent;
    border-radius: 10px;
  }

  #sign_in_icon {
    background-color: transparent;
  }

  #sign_in_icon:hover {
    fill: #dedede;
  }

  #sign_with_other_and_mp_fm {
    left: 0;
    position: absolute;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    #usr_ma {
      top: 20%;
    }

    #usr_pw {
      top: 36%;
    }

    .login_bar_fm {
      @keyframes width_extend {
        0% {
          width: 50%;
        }
        100% {
          width: 70%;
        }
      }
      @keyframes hover_off {
        0% {
          width: 70%;
        }
        100% {
          width: 50%;
        }
      }

      position: absolute;
      display: flex;
      border: none;
      width: 50%;
      height: 10%;
      border-radius: 16px;
      animation: hover_off ease 0.5s forwards;

      .sign_in_with_char {
        position: absolute;
        right: 15%;
        top: 20%;
        color: rgb(209, 209, 209);
      }
    }

    @keyframes move_to_mid {
      0% {
        translate: (0%);
      }
      100% {
        translate: (50%);
      }
    }

    #github_bar_fm {
      bottom: 30%;
      background-color: rgba(#3c3c4c, 0.7);

      #github_icon {
        fill: #dedede;
        border-radius: 60px;
        filter: brightness(150%);
        width: 80px;
        height: 45px;
      }

      &:hover {
        animation: width_extend ease 0.5s forwards;

        .signin_svg_icon {
          animation: move_to_mid ease 0.5s forwards;
        }
      }
    }

    #google_bar_fm {
      bottom: 10%;
      background-color: rgba(#3c3c4c, 0.7);

      #google_icon {
        border-radius: 60px;
        filter: brightness(150%);
        width: 8dvh;
        height: 45px;
        color: aliceblue;
      }

      &:hover {
        animation: width_extend ease 0.5s forwards;

        .signin_svg_icon {
          animation: move_to_mid ease 0.5s forwards;
        }
      }
    }
  }

  #sign_in_with_mp_fm {
    right: 0;
    position: absolute;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    #new_usr_ma,
    #new_usr_pw {
      left: 15%;
    }

    #new_usr_ma {
      top: 20%;
    }

    #new_usr_pw {
      top: 50%;
    }

    #sign_in_go_on {
      position: absolute;
      display: flex;
      bottom: 10%;
      left: 30%;
      height: 8%;
      width: 45%;
      align-items: center;
      letter-spacing: 10px;
      justify-content: center;
      color: rgb(255, 255, 255);
      background-color: rgba(255, 255, 255, 0.3);
      border-radius: 50px;
      border: none;
    }
  }
}
</style>
