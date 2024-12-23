<script lang="ts">
import { defineComponent } from 'vue'
import config from '@/config'

export default defineComponent({
  name: 'base_header',
  setup() {
    return {
      config
    }
  }
})
</script>

<template>
  <header id="header_container">
    <h1>
      <router-link id='site_name' to="/">{{ config.site_name }} <i class="fa-solid fa-code"></i></router-link>
    </h1>
    <nav>
      <div>
        <router-link to="/ranking"><font-awesome-icon class="nav_icon1"  icon="crown" /></router-link>
      </div>
      <div>
        <router-link to="/setting"><font-awesome-icon class="nav_icon2"  icon="gear" /></router-link>
      </div>
      <div>
        <router-link to="/notic"><font-awesome-icon class="nav_icon3" icon="bell" /></router-link>
      </div>
      <div>
        <router-link to="/profile"><font-awesome-icon class="nav_icon4" icon="user" /></router-link>
      </div>
    </nav>
  </header>
</template>
