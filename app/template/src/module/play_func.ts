//  結果画面でグラフとして表示
import { ref, type Ref } from "vue";
//* acc_arr dosend used now. 
export interface result_data_itf {
    wpm: number;
    acc: number;
    time: number;
    wpm_arr: Array<number>
}

export const result_data_ref_obj: Ref<result_data_itf> = ref<result_data_itf>({ wpm: 0, acc: 0, time: 0, wpm_arr: [] })
export const is_dislay_result_view: Ref<boolean> = ref<boolean>(false)

export class play_func {
    private user_keydown: string;
    private line_break: string;
    private user_input: string;
    public is_playing: boolean;
    private type_counter: number;
    private time_value: number;
    private char_all_spans_as_array_elm: Array<any>
    private essenced_spans_for_comparison: Array<HTMLSpanElement>
    public result_data: result_data_itf;
    private char_index: number
    private timer_score_watcher_func: number
    public line_index: number
    public timer_func: | number;
    public char_spans: Array<any>
    public splited_code_arr: Array<string>
    private time_display_display: HTMLElement
    public wpm_every_second_arr: Array<number>
    public acc_every_secend_arr: Array<number>
    public char_length_display_elm: HTMLElement
    public ref_play_code_display_container: HTMLElement

    constructor(time_display_display_as_arg: HTMLElement, char_length_display_elm_as_arg: HTMLElement, ref_play_code_display_container: HTMLElement) {
        this.user_keydown = ''
        this.user_input = ''
        this.line_break = '\n'
        this.char_all_spans_as_array_elm = []
        this.is_playing = false
        this.time_value = 0.0
        this.char_index = 0
        this.type_counter = 0
        this.line_index = 0
        this.timer_func = 0
        this.timer_score_watcher_func = 0
        this.result_data = { 'wpm': 0, 'acc': 0, 'time': 0, wpm_arr: [] }
        this.essenced_spans_for_comparison = []
        this.char_spans = []
        this.ref_play_code_display_container = ref_play_code_display_container
        this.wpm_every_second_arr = []
        this.acc_every_secend_arr = []
        this.time_display_display = time_display_display_as_arg
        this.char_length_display_elm = char_length_display_elm_as_arg
        this.splited_code_arr = []
    }

    private init(terget_code_arg: string, code_display_container: HTMLElement): void {
        this.splited_code_arr = terget_code_arg.split('')
        this.user_input = ''
        this.time_value = 0.0
        this.char_index = 0
        this.line_index = 0
        this.time_display_display.textContent = '0.0s'
        this.char_all_spans_as_array_elm = []
        this.essenced_spans_for_comparison = []
        this.char_spans = []
        this.fetch_char_spans_ignore_space_after_line_break_as_elm(code_display_container)
        window.addEventListener('keydown', this.handle_keydown.bind(this));
        window.addEventListener('keydown', this.handle_keydown_for_play.bind(this));
        this.char_all_spans_as_array_elm[0].classList.add('current_type_char')
    }

    private start_timer(): void {
        this.timer_func = setInterval(() => {
            (this.time_value += 0.1).toFixed(2)
            this.time_display_display.textContent = this.time_value.toFixed(2) + 's'
        }, 100)

        this.timer_score_watcher_func = setInterval(() => {
            if(this.timer_score_watcher_func > 0){
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


    //* When first charater typed run this. So there is this func in handle_keydown_for_play() 
    public init_set_start(code: string, code_display_container: HTMLElement): void {
        this.init(code, code_display_container)
        return
    }

    //* work every time when user press key => use for watch shortcut key.
    private handle_keydown(e: KeyboardEvent): void {
        this.user_keydown += e.key
        return
    }

    private cal_and_push_wpm(): void {
        // wpm =(input /5) / time . input = numbre of corret char
        const correct_number: number = this.essenced_spans_for_comparison.filter((value: HTMLElement) => (value.className.split(' ')).includes('correct')).length
        const wpm: number = parseFloat(((correct_number / 5) / (this.time_value / 60)).toFixed(2))
        this.wpm_every_second_arr.push(wpm)
    }

    private cal_and_push_acc(): void {
        const incorrect_number: number = this.essenced_spans_for_comparison.filter((value: HTMLElement) => (value.className.split(' ')).includes('incorrect')).length
        const acc: number = parseFloat((((this.essenced_spans_for_comparison.length - incorrect_number) / this.essenced_spans_for_comparison.length) * 100).toFixed(2))
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
            console.error(e);
            return false
        }
    }

    private is_all_char_typed(): boolean {
        try {
            for (const value of this.essenced_spans_for_comparison) {
                const array_from_values_class_name: Array<string> = value.className.split(' ')
                if (array_from_values_class_name.includes('untyped')) {
                    console.log(array_from_values_class_name, value.textContent, ' this is the utyped')
                    return false
                }
            }
            return true
        } catch (e) {
            console.error(e);
            return false
        }
    }

    //* manage cursor movement
    private move_cursor(): void {
        this.essenced_spans_for_comparison.forEach((value, index) => {
            value.classList.remove('current_type_char')
            if (index === this.char_index) {
                value.classList.add('current_type_char')
            }
        })
    }

    //* ignore meta, ctl , alt key and handle enter and backspace key => use for palying.
    private handle_keydown_for_play(e: KeyboardEvent): void {

        if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') return // prevent when page reload by keyboard shortcut.
        const ignoredKeys = [
            'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
            'PageUp', 'PageDown', 'End', 'Home', 'Insert', 'Delete', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
        ];

        // Ignore keys in the ignoredKeys list
        if (ignoredKeys.includes(e.key)) return;
        if (e.key === 'Backspace' && this.type_counter === 0) return // when barkspace typed and there are no input do nohing.
        if (e.key === 'Backspace' && this.char_index === 0) return

        this.type_counter++


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



        this.comparison_input_and_add_class_to_span(e.key as string)
        this.char_index++
        this.user_input += e.key
        //*  wpm,accを更新する処理を書く
        this.move_cursor()// cursor move 3

        // This if statement means end of game.
        if (this.is_all_char_typed() === true && this.is_include_incorrect_class_in_ess_spans() === false) {

            // calculating result values
            window.removeEventListener('keydown', this.handle_keydown_for_play.bind(this));
            const time: number = this.stop_timer()
            const time_format_to_munutes: number = (time / 60)
            this.cal_and_push_wpm()
            this.cal_and_push_acc()
            const wpm: number = parseFloat(((this.essenced_spans_for_comparison.length / 5) / time_format_to_munutes).toFixed(2))
            const acc: number = parseFloat(((this.essenced_spans_for_comparison.length as number / this.type_counter) * 100).toFixed(2))
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
            const char_span_arr_decoy = Array.from(char_span_arr);
            const removed_spans: HTMLSpanElement[] = [];

            let space_index: number = 0;
            let space_start_point: number = 0;
            let space_end_point: number = 0;
            for (let i = 0; i < char_span_arr.length; i++) {
                if (char_span_arr[i].textContent === '\u00A0' && char_span_arr[i - 1].textContent === '\n') {

                    space_start_point = i; // set start point
                    space_index = i;
                    for (; ;) {

                        space_index++;
                        if (char_span_arr[space_index].textContent !== '\u00A0') {
                            space_end_point = space_index; // set end point
                            break;
                        }
                    }

                    //* store spans include \u00A0.
                    for (let j = space_start_point; j < space_end_point; j++) {
                        removed_spans.push(char_span_arr_decoy[j]);
                    }
                }
            }

            // remove spans have space after line break by using rebovedSpans
            removed_spans.forEach((span) => {
                char_span_arr_decoy.splice(char_span_arr_decoy.indexOf(span), 1);
            });

            return char_span_arr_decoy   // formatted char_span_arr and removed spans
        } catch (e) {
            return null;
        }
    }


    //* fetch all span tags in code dispaly container as array .
    public fetch_char_spans_ignore_space_after_line_break_as_elm(code_display_container: HTMLElement): void {
        if (code_display_container === null) return
        const char_spans_value = (code_display_container as HTMLElement).querySelectorAll(
            '.each_char_elm'
        )
        char_spans_value.forEach((char_span: any): void => {
            this.char_all_spans_as_array_elm.push(char_span)
        })
        this.essenced_spans_for_comparison = this.format_to_ignore_space_after_line_break(this.char_all_spans_as_array_elm as any)
    }

    private comparison_input_and_add_class_to_span(input_char: string): void {

        const target_span_elm = this.essenced_spans_for_comparison[this.char_index]
        const before_target_span_elm = this.essenced_spans_for_comparison[this.char_index - 1]

        if (input_char === '\n' && before_target_span_elm.textContent === '\n') {
            before_target_span_elm.classList.add('correct');
            before_target_span_elm.classList.remove('untyped')
            return
        }
        if (input_char === '\n' && before_target_span_elm.textContent !== '\n') {
            console.log(before_target_span_elm.textContent, this.char_index, 'char index', 231)

            if (before_target_span_elm.textContent === '\u00A0') {
                before_target_span_elm.classList.add('incorrect_space')
                before_target_span_elm.classList.remove('untyped')
            }
            before_target_span_elm.classList.add('incorrect')
            before_target_span_elm.classList.remove('untyped')
            return
        }

        if (input_char === 'delete' && this.char_index > 0) {
            before_target_span_elm.classList.remove('correct')
            before_target_span_elm.classList.remove('incorrect')
            before_target_span_elm.classList.remove('incorrect_space')
            before_target_span_elm.classList.add('untyped')
            return
        }

        const is_target_elm_text_space: boolean = target_span_elm.textContent === '\u00A0'
        const is_input_space: boolean = input_char === ' '
        const input_ist_space_but_target_is_space: boolean = !is_input_space === is_target_elm_text_space
        const input_and_target_are_space: boolean = ((is_input_space === true) && (is_target_elm_text_space === true))

        if (input_ist_space_but_target_is_space) {
            target_span_elm.classList.add('incorrect_space');
            target_span_elm.classList.remove('untyped')
            return
        }

        if (input_and_target_are_space) {
            target_span_elm.classList.add('correct')
            target_span_elm.classList.remove('untyped')
            return
        }

        if (target_span_elm.textContent === input_char) {
            target_span_elm.classList.remove('incorrect');
            target_span_elm.classList.remove('untyped')
            target_span_elm.classList.add('correct');
            return
        } else if (target_span_elm.textContent !== input_char) {
            target_span_elm.classList.add('incorrect');
            target_span_elm.classList.remove('correct');
            return
        }
    }
}