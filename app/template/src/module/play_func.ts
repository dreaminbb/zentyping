import { faTemperatureFull } from "@fortawesome/free-solid-svg-icons";
import { convertToObject, idText } from "typescript";

class play_func {

                user_keydown: string;
                line_break: string;
                user_input: string;
                is_playing: boolean;
                char_all_spans_as_a_array_elm: Array<any>
                char_index: number
                line_index: number
                char_spans: Array<any>
                target_code: string;
                splited_code_arr: Array<string>

                constructor() {
                                this.user_keydown = ''
                                this.user_input = ''
                                this.line_break = '\n'
                                this.char_all_spans_as_a_array_elm = []
                                this.is_playing = false
                                this.char_index = 0
                                this.line_index = 0
                                this.char_spans = []
                                this.target_code = ''
                                this.splited_code_arr = []
                }

                init(terget_code_arg: string) {
                                this.target_code = terget_code_arg
                                this.splited_code_arr = terget_code_arg.split('')
                                this.user_input = ''
                                this.char_index = 0
                                this.line_index = 0
                                this.char_all_spans_as_a_array_elm = []
                                this.char_spans = []
                                window.addEventListener('keydown', this.handle_keydown.bind(this));
                                window.addEventListener('keydown', this.handle_keydown_for_play.bind(this));
                }

                //* work every time when user press key => use for watch shortcut key
                handle_keydown(e: KeyboardEvent): void {
                                this.user_keydown += e.key
                }

                //* ignore meta, ctl , alt key and handle enter and backspace key => use for palying
                handle_keydown_for_play(e: KeyboardEvent): void {

                                if (e.key === 'Backspace') {
                                                this.user_input = this.user_input.slice(0, -1)
                                                this.comparison_input_and_add_class_to_span('delete')
                                                this.char_index--
                                                return
                                }

                                if (e.key === 'Enter') {
                                                this.user_input += '\n'
                                                this.comparison_input_and_add_class_to_span(this.line_break as string)
                                                return
                                }

                                if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return
                                this.comparison_input_and_add_class_to_span(e.key as string)
                                this.user_input += e.key
                                this.char_index++
                                console.log(this.user_input)
                }

                //* fetch all span tags in code dispaly container as array 
                fetch_char_spans_ignore_space_after_line_break_as_elm(code_display_container: HTMLElement): void {
                                if (code_display_container === null) return
                                const char_spans = (code_display_container as HTMLElement).querySelectorAll(
                                                '.each_char_elm'
                                )

                                char_spans.forEach((char_span: any): void => {
                                                this.char_all_spans_as_a_array_elm.push(char_span)
                                })
                                console.log(char_spans)
                }

                comparison_input_and_add_class_to_span(input_char: string): void {
                                console.log(this.char_all_spans_as_a_array_elm[this.char_index])
                                const target_span_elm = this.char_all_spans_as_a_array_elm[this.char_index]
                                const before_target_span_elm = this.char_all_spans_as_a_array_elm[this.char_index - 1]
                                if (target_span_elm === undefined) return

                                if (input_char === 'delete' && this.char_index > 0) {
                                                before_target_span_elm.classList.remove('correct')
                                                before_target_span_elm.classList.remove('incorrect')
                                                before_target_span_elm.classList.add('untyped')
                                                return
                                }

                                if (target_span_elm.textContent === input_char) {
                                                target_span_elm.classList.add('correct')
                                } else {
                                                target_span_elm.classList.add('incorrect')
                                }
                }

                // todo 入力を監視してspanタグの色を変える。
}

export default new play_func;
