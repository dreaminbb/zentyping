import { type Ref, ref } from 'vue'
import { store_code_type, type result_data_itf } from '../interface'
import { code_load } from './code_load'
import { code_data } from '../store/store'
import short_cut_ins from './short_cut_manager'
import config from '@/config'

export const result_data_ref_obj: Ref<result_data_itf> = ref<result_data_itf>({
  wpm: 0,
  acc: 0,
  time: 0,
  wpm_arr: []
})
export const is_dislay_result_view: Ref<boolean> = ref<boolean>(false)

class play_func {
  private line_break: string
  private user_input: string
  public is_playing: boolean
  private type_counter: number
  private time_value: number
  private char_all_spans_as_array_elm: Array<HTMLTemplateElement>
  private essenced_spans_for_comparison: Array<HTMLSpanElement>
  public result_data: result_data_itf
  private char_index: number
  private timer_score_watcher_func: NodeJS.Timer | number
  private check_afk_typing_timer_func: NodeJS.Timer | number
  public timer_func: NodeJS.Timer | number
  public line_index: number
  public char_spans: Array<HTMLSpanElement>
  public splited_code_arr: Array<string>
  private time_display_display: HTMLElement | null
  public wpm_every_second_arr: Array<number>
  public acc_every_secend_arr: Array<number>
  public raw_code: string
  public play_code_display_container: HTMLElement | null
  private handle_keydown_for_play_ground: (e: KeyboardEvent) => void
  private ignoredKeys: Array<string> = [
    'Shift',
    'Control',
    'Alt',
    'Meta',
    'CapsLock',
    'Tab',
    'Escape',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'PageUp',
    'PageDown',
    'End',
    'Home',
    'Insert',
    'Delete',
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'F9',
    'F10',
    'F11',
    'F12'
  ]

  constructor() {
    this.user_input = ''
    this.line_break = '\n'
    this.raw_code = ''
    this.char_all_spans_as_array_elm = []
    this.is_playing = false
    this.time_value = 0.0
    this.char_index = 0
    this.type_counter = 0
    this.line_index = 0
    this.timer_func = 0
    this.check_afk_typing_timer_func = 0
    this.timer_score_watcher_func = 0
    this.result_data = { wpm: 0, acc: 0, time: 0, wpm_arr: [] }
    this.essenced_spans_for_comparison = []
    this.char_spans = []
    this.wpm_every_second_arr = []
    this.acc_every_secend_arr = []
    this.play_code_display_container = null
    this.time_display_display = null
    this.play_code_display_container = null
    this.splited_code_arr = []
    this.handle_keydown_for_play_ground = this.handle_keydown_for_play.bind(this)
  }

  private reset_state(): void {
    window.removeEventListener('keydown', this.handle_keydown_for_play_ground)
    this.user_input = ''
    this.line_break = '\n'
    this.char_all_spans_as_array_elm = []
    this.is_playing = false
    this.time_value = 0.0
    this.char_index = 0
    this.type_counter = 0
    this.line_index = 0
    // this.timer_func = 0;
    // this.timer_score_watcher_func = 0;
    this.result_data = { wpm: 0, acc: 0, time: 0, wpm_arr: [] }
    this.essenced_spans_for_comparison = []
    this.char_spans = []
    this.wpm_every_second_arr = []
    this.acc_every_secend_arr = []
    this.play_code_display_container = null
    this.time_display_display = null
    this.play_code_display_container = null
    this.splited_code_arr = []
  }

  //* When first charater typed run this. So there is this func in handle_keydown_for_play_ground()
  public init(code: string): void {
    this.reset_state()
    this.time_display_display = document.getElementById('time_display') as HTMLElement
    this.play_code_display_container = document.getElementById(
      'code_display_container'
    ) as HTMLElement
    // // console.log(this.play_code_display_container, this.time_display_display)
    if (!this.play_code_display_container || !this.time_display_display) {
      throw new Error('something is null')
    }
    this.splited_code_arr = code.split('')
    this.user_input = ''
    this.time_value = 0.0
    this.char_index = 0
    this.line_index = 0
    this.raw_code = code
    this.time_display_display.textContent = '0.0s'
    this.char_all_spans_as_array_elm = []
    this.essenced_spans_for_comparison = []
    this.char_spans = []
    window.addEventListener('keydown', this.handle_keydown_for_play_ground)

    this.fetch_char_spans_ignore_space_after_line_break_as_elm()
    // add utyped class to all spans
    // // console.log(this.essenced_spans_for_comparison)
    // // console.log('init')
    this.add_untyped_class_to_all_spans()
    this.add_cursor_to_first_char()
  }

  private add_untyped_class_to_all_spans(): void {
    // console.log('add untyped class to all spans function')
    try {
      this.essenced_spans_for_comparison.forEach((value: HTMLElement) => {
        value.classList.add('untyped')
        // We need also romve cursor class which added :after way
        value.classList.remove('correct', 'incorrect', 'incorrect_space', 'current_type_char')
      })
    } catch (e) {
      console.error(e)
    }
  }

  //So when user type we have to add cursor to the first char.
  private add_cursor_to_first_char(): void {
    try {
      this.essenced_spans_for_comparison[0]?.classList.add('current_type_char')
    } catch (e) {
      console.error(e)
    }
  }

  public delete(): void {
    this.reset_state()
    window.removeEventListener('keydown', this.handle_keydown_for_play_ground)
    // delete chort cut listener
    short_cut_ins.disable_chort_cut()

    this.time_display_display = document.getElementById('time_display') as HTMLElement
    this.play_code_display_container = document.getElementById(
      'code_display_container'
    ) as HTMLElement
    if (!this.play_code_display_container || !this.time_display_display) {
      throw new Error('something is null')
    }
    this.time_display_display.textContent = '0.0s'

    if (this.timer_func) {
      clearInterval(this.timer_func)
    }
    if (this.timer_score_watcher_func) {
      clearInterval(this.timer_score_watcher_func)
    }
    if (this.check_afk_typing_timer_func) {
      clearInterval(this.check_afk_typing_timer_func)
    }

    if (!this.play_code_display_container || !this.time_display_display) {
      throw new Error('something is null')
    }
    this.splited_code_arr = []
    this.user_input = ''
    this.time_value = 0.0
    this.char_index = 0
    this.line_index = 0
    this.char_all_spans_as_array_elm = []
    this.essenced_spans_for_comparison = []
    this.char_spans = []
  }

  private check_afk_after_every_type(): void {
    this.check_afk_typing_timer_func = setTimeout(() => {
      this.is_playing = false
      this.delete()
      const code: string = this.raw_code
      this.init(code)
      short_cut_ins.init()
    }, config.type_afk_limit * 1000)
  }

  private break_afk_check(): void {
    clearTimeout(this.check_afk_typing_timer_func)
  }

  private start_timer(): void {
    this.timer_func = setInterval(() => {
      if (!this.time_display_display) {
        throw new Error('Time display element is not available')
      }
      ; (this.time_value += 0.1).toFixed(2)
      this.time_display_display.textContent = this.time_value.toFixed(2) + 's'
    }, 100)

    this.timer_score_watcher_func = setInterval(() => {
      if (typeof this.timer_score_watcher_func === 'number' && this.timer_score_watcher_func > 0) {
        this.cal_and_push_wpm()
        this.cal_and_push_acc()
      }
    }, 1000)
  }

  private stop_timer(): number {
    clearInterval(this.timer_func)
    clearInterval(this.timer_score_watcher_func)
    return this.time_value
  }

  private cal_and_push_wpm(): void {
    // wpm =(input /5) / time . input = numbre of corret char
    const correct_number: number = this.essenced_spans_for_comparison.filter((value: HTMLElement) =>
      value.className.split(' ').includes('correct')
    ).length

    const wpm: number = parseFloat((correct_number / 5 / (this.time_value / 60)).toFixed(2))
    this.wpm_every_second_arr.push(wpm)
  }

  private cal_and_push_acc(): void {
    const incorrect_number: number = this.essenced_spans_for_comparison.filter(
      (value: HTMLElement) => value.className.split(' ').includes('incorrect')
    ).length
    const acc: number = parseFloat(
      (
        ((this.essenced_spans_for_comparison.length - incorrect_number) /
          this.essenced_spans_for_comparison.length) *
        100
      ).toFixed(2)
    )
    this.acc_every_secend_arr.push(acc)
  }

  private is_include_incorrect_class_in_ess_spans(): boolean {
    try {
      for (const value of this.essenced_spans_for_comparison) {
        const array_from_values_class_name: Array<string> = value.className.split(' ')
        if (array_from_values_class_name.includes('incorrect')) {
          return true
        }
      }
      return false
    } catch (e) {
      console.error(e)
      return false
    }
  }

  private is_all_char_typed(): boolean {
    try {
      for (const value of this.essenced_spans_for_comparison) {
        const array_from_values_class_name: Array<string> = value.className.split(' ')
        if (array_from_values_class_name.includes('untyped')) {
          return false
        }
      }
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  //* manage cursor movement
  private move_cursor(): void {
    this.essenced_spans_for_comparison.forEach((value: HTMLElement, index: number): void => {
      value.classList.remove('current_type_char')
      if (index === this.char_index) {
        value.classList.add('current_type_char')
      }
    })
  }

  public async next_code(): Promise<void> {
    is_dislay_result_view.value = false
    code_data().code_point++

    const store_instance = code_data()

    const pointer: number = store_instance.code_point as number;

    const lang: string = store_instance.code_lang as keyof store_code_type;

    const code: string = store_instance.code_data_obj?.[lang as keyof store_code_type]?.[pointer]?.code as string;


    if (code === undefined) {
      // init now lang code store
      await code_data().one_lang_update_stored_code(lang, config.one_lang_update_mount)
      code_data().code_point = 0
    }

    setTimeout(async () => {
      //add 1  to code_point in below function

      code_load()
    }, 100)
  }

  //* ignore meta, ctl , alt key and handle enter and backspace key => use for palying.
  //if number of tpyed char equal to number of code all chars.
  private handle_keydown_for_play(e: KeyboardEvent): void {
    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') {
      return
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') return // prevent when page reload by keyboard shortcut.

    // Ignore keys in the ignoredKeys list
    if (this.ignoredKeys.includes(e.key)) return
    if (e.key === 'Backspace' && this.type_counter === 0) return // when barkspace typed and there are no input do nohing.
    if (e.key === 'Backspace' && this.char_index === 0) return

    this.type_counter++
    this.break_afk_check()
    this.check_afk_after_every_type()
    // // console.log(this.essenced_spans_for_comparison)

    // It works only first type.
    if (this.type_counter === 1) {
      this.is_playing = true
      this.start_timer()
    }

    if (e.key === 'Backspace') {
      this.user_input = this.user_input.slice(0, -1)
      this.comparison_input_and_add_class_to_span('delete')
      this.char_index--
      this.move_cursor() // cursor move 1
      return
    }

    if (e.key === 'Enter') {
      this.char_index++ // important. I weast 1hours bcs, I forgot this simple a line of code.
      this.comparison_input_and_add_class_to_span('\n')
      this.user_input += this.line_break
      this.move_cursor() // cursor move 2

      return
    }

    if (this.char_index === this.essenced_spans_for_comparison.length) return

    this.comparison_input_and_add_class_to_span(e.key as string)
    this.char_index++
    this.user_input += e.key
    //*  wpm,accを更新する処理を書く
    this.move_cursor() // cursor move 3

    // This if statement means end of game.
    if (
      this.is_all_char_typed() === true &&
      this.is_include_incorrect_class_in_ess_spans() === false
    ) {
      // calculating result values
      window.removeEventListener('keydown', this.handle_keydown_for_play)

      const time: number = this.stop_timer()
      const time_format_to_munutes: number = time / 60
      this.cal_and_push_wpm()
      this.cal_and_push_acc()
      const wpm: number = parseFloat(
        (this.essenced_spans_for_comparison.length / 5 / time_format_to_munutes).toFixed(2)
      )

      const acc: number = parseFloat(
        (((this.essenced_spans_for_comparison.length as number) / this.type_counter) * 100).toFixed(
          2
        )
      )

      const data: result_data_itf = {
        wpm: wpm,
        acc: acc,
        time: time,
        wpm_arr: this.wpm_every_second_arr
      }
      is_dislay_result_view.value = true
      result_data_ref_obj.value = data
      return
    }
    return
  }

  private format_to_ignore_space_after_line_break(char_span_arr: NodeListOf<HTMLSpanElement>): any {
    //* at first \u00A0 is space character.
    //* base of identify line break is before char is \n and after char is \u00A0 .
    //* store \u00A0 after \n until next char is not \u00A0.

    try {
      const char_span_arr_decoy = Array.from(char_span_arr)
      const removed_spans: HTMLSpanElement[] = []

      let space_index: number = 0
      let space_start_point: number = 0
      let space_end_point: number = 0
      for (let i = 0; i < char_span_arr.length; i++) {
        if (
          char_span_arr[i]?.textContent === '\u00A0' &&
          char_span_arr[i - 1]?.textContent === '\n'
        ) {
          space_start_point = i // set start point
          space_index = i
          for (; ;) {
            space_index++
            if (char_span_arr[space_index]?.textContent !== '\u00A0') {
              space_end_point = space_index // set end point
              break
            }
          }

          //* store spans include \u00A0.
          for (let j = space_start_point; j < space_end_point; j++) {
            removed_spans.push(char_span_arr_decoy[j] as HTMLElement)
          }
        }
      }
      // remove spans have space after line break by using rebovedSpans
      removed_spans.forEach((span) => {
        char_span_arr_decoy.splice(char_span_arr_decoy.indexOf(span), 1)
      })

      return char_span_arr_decoy // formatted char_span_arr and removed spans
    } catch (e) {
      return null
    }
  }

  //* fetch all span tags in code dispaly container as array. And remove space after line break.
  public fetch_char_spans_ignore_space_after_line_break_as_elm(): void {
    if (this.play_code_display_container === null) return

    const char_spans_value = (this.play_code_display_container as HTMLElement).querySelectorAll(
      '.each_char_elm'
    )

    char_spans_value.forEach((char_span: any): void => {
      this.char_all_spans_as_array_elm.push(char_span)
    })

    this.essenced_spans_for_comparison = this.format_to_ignore_space_after_line_break(
      this.char_all_spans_as_array_elm as any
    )
    this.char_all_spans_as_array_elm[0]?.classList.add('current_type_char')
  }

  private comparison_input_and_add_class_to_span(input_char: string): void {
    const target_span_elm = this.essenced_spans_for_comparison[this.char_index]
    const before_target_span_elm = this.essenced_spans_for_comparison[this.char_index - 1]

    if (input_char === '\n' && before_target_span_elm?.textContent === '\n') {
      before_target_span_elm?.classList.add('correct')
      before_target_span_elm?.classList.remove('untyped')
      return
    }
    if (input_char === '\n' && before_target_span_elm?.textContent !== '\n') {
      // // console.log(before_target_span_elm?.textContent, this.char_index, 'char index', 231)

      if (before_target_span_elm?.textContent === '\u00A0') {
        before_target_span_elm?.classList.add('incorrect_space')
        before_target_span_elm?.classList.remove('untyped')
      }
      before_target_span_elm?.classList.add('incorrect')
      before_target_span_elm?.classList.remove('untyped')
      return
    }

    if (input_char === 'delete' && this.char_index > 0) {
      before_target_span_elm?.classList.remove('correct')
      before_target_span_elm?.classList.remove('incorrect')
      before_target_span_elm?.classList.remove('incorrect_space')
      before_target_span_elm?.classList.add('untyped')
      return
    }

    // console.log(target_span_elm)
    const is_target_elm_text_space: boolean = target_span_elm?.textContent === '\u00A0'
    const is_input_space: boolean = input_char === ' '
    const input_ist_space_but_target_is_space: boolean =
      !is_input_space === is_target_elm_text_space
    const input_and_target_are_space: boolean =
      is_input_space === true && is_target_elm_text_space === true

    if (input_ist_space_but_target_is_space) {
      target_span_elm?.classList.add('incorrect_space')
      target_span_elm?.classList.remove('untyped')
      return
    }

    if (input_and_target_are_space) {
      target_span_elm?.classList.add('correct')
      target_span_elm?.classList.remove('untyped')
      return
    }

    if (target_span_elm?.textContent === input_char) {
      target_span_elm?.classList.remove('incorrect')
      target_span_elm?.classList.remove('untyped')
      target_span_elm?.classList.add('correct')
      return
    } else if (target_span_elm?.textContent !== input_char) {
      target_span_elm?.classList.add('incorrect')
      target_span_elm?.classList.remove('correct')
      return
    }
  }
}

const play_func_ins = new play_func()
export default play_func_ins
