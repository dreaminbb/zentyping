import { defineStore } from 'pinia'
import type { store_code_type } from '@/interface'

export const user_status = defineStore('user_status', {
  state: (): { is_login: boolean; is_user: boolean; is_admin: boolean } => ({
    is_login: true,
    is_user: false,
    is_admin: false
  })
})


export const code_data = defineStore('code_data', {
  actions: {
    store_lang_param_local_storage(lang: string): void {
      localStorage.setItem('code_lang', lang)
    },
    init_store(): void {
      this.ready = true
    }
  },
  state: (): { code_lang: string, code_point: number, code_data_obj: store_code_type, ready: boolean } => ({
    code_lang: localStorage.getItem('code_lang') === null ? 'rust' : localStorage.getItem('code_lang') as string,
    ready: false,
    code_point: 0,
    code_data_obj: {
      python: [
        {
          code: 'print("',
          url: 'https://github.com'
        },
        {
          code: 'def add(a, b):\n  return a + b',
          url: 'https://github.com'
        },
        {
          code: 'def subtract(a, b):\n  return a - b',
          url: 'https://github.com'
        },
        {
          code: 'def multiply(a, b):\n  return a * b',
          url: 'https://github.com'
        },
        {
          code: 'def divide(a, b):\n  if b == 0:\n    raise ValueError("Division by zero")\n  return a / b',
          url: 'https://github.com'
        }
      ],
      rust: [
        {
          code: 'fn main() {\n  println!("Hello, World!");\n}',
          url: 'https://github.com'
        },
        {
          code: 'fn add(a: i32, b: i32) -> i32 {\n  a + b\n}',
          url: 'https://github.com'
        },
        {
          code: 'fn subtract(a: i32, b: i32) -> i32 {\n  a - b\n}',
          url: 'https://github.com'
        },
        {
          code: 'fn multiply(a: i32, b: i32) -> i32 {\n  a * b\n}',
          url: 'https://github.com'
        }
      ],
      typescript: [
        {
          code: 'function main():void {\n return\n}',
          url: 'https://github.com'
        },
        {
          code: 'function add(a: number, b: number): number {\n  return a + b;\n}',
          url: 'https://github.com'
        },
        {
          code: 'function subtract(a: number, b: number): number {\n  return a - b;\n}',
          url: 'https://github.com'
        },
        {
          code: 'function multiply(a: number, b: number): number {\n  return a * b;\n}',
          url: 'https://github.com'
        },
        {
          code: 'function divide(a: number, b: number): number {\n  if (b === 0) throw new Error("Division by zero");\n  return a / b;\n}',
          url: 'https://github.com'
        }
      ]
    }
  })
})


export const codes_storege = defineStore('codes_storage', {
  actions: {
  },
  state: (): { store_code: store_code_type } => ({
    store_code: {
      python: null,
      rust: null,
      typescript: null
    }
  })
})


export const user_settings = defineStore('user_settings', {
  state() {
    return {}
  }
})
