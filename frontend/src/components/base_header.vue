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
  <header>
    <h1>
      <header id='site_name' >{{ config.site_name }} <i class="fa-solid fa-code"></i></header>
    </h1>
    <nav>
      <div>
        <div ><font-awesome-icon class="nav_icon1"  icon="crown" /></div>
      </div>
      <div>
        <div ><font-awesome-icon class="nav_icon2"  icon="gear" /></div>
      </div>
      <div>
        <div ><font-awesome-icon class="nav_icon3" icon="bell" /></div>
      </div>
      <div>
        <div ><font-awesome-icon class="nav_icon4" icon="user" /></div>
      </div>
    </nav>
  </header>
</template>
