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
<<<<<<< HEAD:app/template/src/components/base_header.vue
    <h1>{{ config.site_name }}</h1>
  </header>
</template>

=======
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
>>>>>>> 3b029bb2654fe688af71880c744608ac69794a1d:template/src/components/base_header.vue
