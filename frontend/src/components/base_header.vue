<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'base_header',
  setup() {
    return {
      SITE_SAME: import.meta.env.VITE_SITE_NAME
    }
  }
})
</script>

<template>
  <header>
    <h1>
      <header id="site_name">{{ SITE_SAME }} <i class="fa-solid fa-code"></i></header>
    </h1>
    <nav>
      <div>
        <div><font-awesome-icon class="nav_icon1" icon="crown" /></div>
      </div>
      <div>
        <div><font-awesome-icon class="nav_icon2" icon="gear" /></div>
      </div>
      <div>
        <div><font-awesome-icon class="nav_icon3" icon="bell" /></div>
      </div>
      <div>
        <div><font-awesome-icon class="nav_icon4" icon="user" /></div>
      </div>
    </nav>
  </header>
</template>
