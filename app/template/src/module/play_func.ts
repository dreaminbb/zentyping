import { ref, type Ref } from 'vue'
class play_func {
                user_input: Ref<string>;
                is_playing: boolean;
                chart_all_spans_as_a_array: Ref<Array<any>>;
                char_index: Ref<number>;
                line_index: Ref<number>;
                char_spans: Ref<Array<any>>;
                target_code:string;

                constructor() {
                                this.user_input = ref('')
                                this.is_playing = false
                                this.chart_all_spans_as_a_array = ref([])
                                this.is_playing = false
                                this.user_input.value = ''
                                this.char_index = ref(0)
                                this.line_index = ref(0)
                                this.char_spans = ref([])
                                this.target_code = ''
                }

                init(terget_code:string) {
                                window.addEventListener('keydown', this.handle_keydown);
                                this.target_code = terget_code
                                this.user_input.value = ''
                                this.char_index.value = 0
                                this.line_index.value = 0
                                this.chart_all_spans_as_a_array.value = []
                                this.char_spans.value = []
                }

                handle_keydown(e: KeyboardEvent): void {
                                this.user_input.value += e.key
                }

                fetch_char_spans_ignore_space_after_line_break_as_elm(code_display_container:Ref<HTMLElement | null>): void {
                                if (code_display_container.value === null) return
                                const char_spans = (code_display_container.value as HTMLElement).querySelectorAll(
                                                '.each_char_elm'
                                )
                                char_spans.forEach((char_span: any) => {
                                                this.chart_all_spans_as_a_array.value.push(char_span)
                                })
                                console.log(char_spans)
                }





}

export default new play_func;