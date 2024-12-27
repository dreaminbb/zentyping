class play_func {
    user_keydown: string;
    line_break: string;
    user_input: string;
    is_playing: boolean;
    type_counter: number;
    time_value: number;
    char_all_spans_as_array_elm: Array<any>
    essenced_spans_for_comparison: Array<HTMLSpanElement>
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
        this.time_value = 0.0
        this.char_index = 0
        this.type_counter = 0
        this.line_index = 0
        this.essenced_spans_for_comparison = []
        this.char_spans = []
        this.target_code = ''
        this.splited_code_arr = []
    }

    private init(terget_code_arg: string, code_display_container: HTMLElement) {
        this.target_code = terget_code_arg
        this.splited_code_arr = terget_code_arg.split('')
        this.user_input = ''
        this.time_value = 0.0
        this.char_index = 0
        this.line_index = 0
        this.char_all_spans_as_array_elm = []
        this.char_spans = []
        this.fetch_char_spans_ignore_space_after_line_break_as_elm(code_display_container)
        window.addEventListener('keydown', this.handle_keydown.bind(this));
        window.addEventListener('keydown', this.handle_keydown_for_play.bind(this));
        console.log(this.target_code.split(''))
    }

    private start_timer(): void {
        setInterval(() => {
            (this.time_value += 0.1).toFixed(2)
            console.log(this.time_value, 'time')
        }, 100)
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

    //* ignore meta, ctl , alt key and handle enter and backspace key => use for palying.
    private handle_keydown_for_play(e: KeyboardEvent): void {

        if (e.key === 'Meta' || e.key === 'Control' || e.key === 'Alt') return

        this.type_counter++

        // It works only first type.
        if (this.type_counter === 1) {
            this.is_playing = true
            this.start_timer()
        }

        if (e.key === 'Backspace') {
            this.user_input = this.user_input.slice(0, -1)
            console.log(this.user_input, 'user input')
            this.comparison_input_and_add_class_to_span('delete')
            this.char_index--
            console.log(this.user_input.split(''))
            return
        }

        if (e.key === 'Enter') {
            this.char_index++ // important. I weast 1hours bcs, I forgot this simple a line of code.
            this.comparison_input_and_add_class_to_span(this.line_break as string)
            this.user_input += this.line_break
            console.log(this.user_input.split(''))
            return
        }

        if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return
        this.comparison_input_and_add_class_to_span(e.key as string)
        this.user_input += e.key
        this.char_index++
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
                    console.log('is it working?');
                    space_start_point = i; // set start point
                    space_index = i;
                    for (; ;) {
                        space_index++;
                        if (char_span_arr[space_index].textContent !== '\u00A0') {
                            console.log('point of space end', space_index);
                            space_end_point = space_index; // set end point
                            break;
                        }
                    }
                    //* store spans include \u00A0.
                    console.log('start point', space_start_point);
                    console.log('end point', space_end_point);
                    for (let j = space_start_point; j < space_end_point; j++) {
                        console.log('storing span');
                        removed_spans.push(char_span_arr_decoy[j]);
                    }
                }
            }
            // remove spans have space after line break by using rebovedSpans
            removed_spans.forEach((span) => {
                char_span_arr_decoy.splice(char_span_arr_decoy.indexOf(span), 1);
            });
            console.log('Removed spans:', removed_spans);
            console.log('char_span_arr_decoy:', char_span_arr_decoy);

            return char_span_arr_decoy   // formatted char_span_arr and removed spans
        } catch (e) {
            console.log(e);
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

        if (target_span_elm === undefined) return
        console.log(input_char, 'input char')

        if (input_char === this.line_break) {
            console.log('line break!!!!!!!!', target_span_elm)
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
