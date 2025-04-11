<script lang="ts">
import { defineComponent } from 'vue'
import { handle_sgin_in, handle_sign_out } from '@/firebase/github_auth'
import { user_status, user_info } from '@/store/store'

export default defineComponent({
  name: 'base_header',
  setup() {
    return {
      handle_sgin_in,
      handle_sign_out,
      user_status,
      user_info,
    }
  }
})
</script>

<template>
  <header>
    <h1>
  <router-link to="/">
      <header id="site_name">zentyping<i class="fa-solid fa-code"></i></header>
  </router-link>
    </h1>
    <nav>
      <router-link to="/about_owner">
        <div><font-awesome-icon class="nav_icon1" icon="book" /></div>
      </router-link>
      <router-link to="/info">
        <div><font-awesome-icon class="nav_icon2" icon="info" /></div>
      </router-link>
      <router-link to="/sc_doc">
        <div><i class="fa-solid fa-keyboard nav_icon3"></i></div>
      </router-link>

      <div>
        <a
          href="https://github.com/dreaminbb/zentyping.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <font-awesome-icon class="nav_icon_github" :icon="['fab', 'github']" />
        </a>
      </div>

      <div id="user_name_display">
        {{ user_info().user_name === null ? 'Sign in with Github =>' : user_info().user_name }}
        <img
          v-if="user_info().user_name !== null"
          :src="user_info().user_icon_url"
          alt="User Photo"
        />
      </div>

      <div>
        <div @click="handle_sgin_in" v-if="!user_status().is_login">
          <font-awesome-icon class="nav_icon4" icon="user" />
        </div>
      </div>

      <div @click="handle_sign_out" v-if="user_status().is_login">
        <font-awesome-icon class="nav_icon5" icon="right-from-bracket" />
      </div>
    </nav>
  </header>
</template>
