// todo => 1.改行後のスペースを無視してspanタグを取得する。 
// ! 関数format....が動いてない
class play_func {

                user_keydown: string;
                line_break: string;
                user_input: string;
                is_playing: boolean;
                char_all_spans_as_array_elm: Array<any>
                char_index: number
                line_index: number
                char_spans: Array<any>
                target_code: string;
                splited_code_arr: Array<string>

                constructor() {
                                this.user_keydown = ''
                                this.user_input = ''
                                this.line_break = '\n'
                                this.char_all_spans_as_array_elm = []
                                this.is_playing = false
                                this.char_index = 0
                                this.line_index = 0
                                this.char_spans = []
                                this.target_code = ''
                                this.splited_code_arr = []
                }

                public init(terget_code_arg: string) {
                                this.target_code = terget_code_arg
                                this.splited_code_arr = terget_code_arg.split('')
                                this.user_input = ''
                                this.char_index = 0
                                this.line_index = 0
                                this.char_all_spans_as_array_elm = []
                                this.char_spans = []
                                window.addEventListener('keydown', this.handle_keydown.bind(this));
                                window.addEventListener('keydown', this.handle_keydown_for_play.bind(this));
                                console.log(this.target_code.split(''))
                }

                //* work every time when user press key => use for watch shortcut key
                private handle_keydown(e: KeyboardEvent): void {
                                this.user_keydown += e.key
                }

                //* ignore meta, ctl , alt key and handle enter and backspace key => use for palying
                handle_keydown_for_play(e: KeyboardEvent): void {

                                if (e.key === 'Backspace') {
                                                this.user_input = this.user_input.slice(0, -1)
                                                console.log(this.user_input , 'user input')
                                                this.comparison_input_and_add_class_to_span('delete')
                                                this.char_index--
                                                console.log(this.user_input.split(''))
                                                return
                                }
                                
                                if (e.key === 'Enter') {
                                                this.char_index++ // important
                                                this.comparison_input_and_add_class_to_span(this.line_break as string)
                                                this.user_input += this.line_break
                                                console.log(this.user_input.split(''))
                                                return
                                }
                                
                                if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return
                                this.comparison_input_and_add_class_to_span(e.key as string)
                                this.user_input += e.key
                                this.char_index++
                                console.log(this.user_input.split(''))
                                console.log(this.user_input)
                }

                private format_to_ignore_space_after_line_break(char_span_arr: any): any {
                                //* at first \u00A0 is space charactor
                                //* base of indentify line break is befor char is \n and after char is \u00A0 
                                //* delete \u00A0 after \n until next char is not \u00A0


                                try {

                                                let space_index: number = 0
                                                let space_start_point: number = 0
                                                let space_end_point: number = 0
                                                for (let i = 0; i < char_span_arr.length; i++) {
                                                                if (char_span_arr[i].textContent === '\u00A0' && char_span_arr[i - 1].textContent === '\n') {
                                                                                console.log('is it workng ?')
                                                                                space_start_point = i // set start point
                                                                                space_index = i
                                                                                for (; ;) {
                                                                                                space_index++
                                                                                                if (char_span_arr[space_index].textContent !== '\u00A0') {
                                                                                                                console.log('point of space end', space_index)
                                                                                                                space_end_point = space_index
                                                                                                                break
                                                                                                }
                                                                                }
                                                                                //* delete spans include \u00A0
                                                                                console.log('start point', space_start_point)
                                                                                console.log('end point', space_end_point)
                                                                                for (let j = space_start_point; j < space_end_point; j++) {
                                                                                                console.log('deleting span')
                                                                                                char_span_arr[j].remove()
                                                                                }
                                                                }
                                                }
                                                return char_span_arr // formated char_span_arr
                                } catch (e) {
                                                console.log(e)
                                                return char_span_arr
                                }
                }


                //* fetch all span tags in code dispaly container as array 
                public fetch_char_spans_ignore_space_after_line_break_as_elm(code_display_container: HTMLElement): void {
                                if (code_display_container === null) return
                                const char_spans_value = (code_display_container as HTMLElement).querySelectorAll(
                                                '.each_char_elm'
                                )
                                char_spans_value.forEach((char_span: any): void => {
                                                //* ここに改行後のスペースを無視する処理を追加する
                                                this.char_all_spans_as_array_elm.push(char_span)
                                })
                                // this.char_spans = this.format_to_ignore_space_after_line_break(this.char_all_spans_as_array_elm as any)
                                // console.log(this.char_spans, 'I hope this is formated and work well')
                }

                private comparison_input_and_add_class_to_span(input_char: string): void {
                                console.log(this.char_all_spans_as_array_elm[this.char_index])

                                const target_span_elm = this.char_all_spans_as_array_elm[this.char_index]
                                const before_target_span_elm = this.char_all_spans_as_array_elm[this.char_index - 1]
                                if (target_span_elm === undefined) return
                                console.log(input_char, 'input char')

                                if (input_char === this.line_break ) {
                                                console.log('line break!!!!!!!!' , target_span_elm)
                                                before_target_span_elm.classList.add('correct');
                                                return
                                }

                                if (input_char === 'delete' && this.char_index > 0) {
                                                before_target_span_elm.classList.remove('correct')
                                                before_target_span_elm.classList.remove('incorrect')
                                                before_target_span_elm.classList.add('untyped')
                                                return
                                }

                                if (target_span_elm.textContent === input_char) {
                                                target_span_elm.classList.remove('incorrect')
                                                target_span_elm.classList.add('correct')
                                                console.log('coreect', target_span_elm.textContent, 'target', input_char, 'input')
                                } else {
                                                console.log('incoreect', target_span_elm.textContent, 'target', input_char, 'input')
                                                target_span_elm.classList.remove('correct')
                                                target_span_elm.classList.add('incorrect')
                                }
                }

}

export default new play_func;