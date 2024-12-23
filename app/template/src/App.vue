<script lang="ts" setup>
import { provide, type Ref, ref } from 'vue'
import { RouterView } from 'vue-router'
import { user_status } from '@/store/store'
import { session_manager } from '@/services/auth'
import base_header from './components/base_header.vue'

// const tools = ref(true)
// const login_button = ref(true)
// const user_profile: Ref<boolean> = ref(false)
// const header_normal_class = ref(true)
// const header_focus_class = ref(false)

// provide('tools', tools)
// provide('header_normal_class', header_normal_class)
// provide('header_focus_class', header_focus_class)

</script>

<template>
  <base_header />
  <div></div>
</template>

<style >

</style>
