import { type Ref } from 'vue'
class play_func {
                is_playing: Ref<Boolean>;
                user_input: Ref<string>;

                constructor(is_playing: Ref<Boolean>, user_input: Ref<string>) {
                                this.is_playing = is_playing;
                                this.user_input = user_input;
                }
}

export default play_func;