import { play_func } from '@/module/play_func'
import { code_data } from '@/store/store'

let play_func_ins = new play_func()
export function code_load(first_mount: boolean): void {

                // If player change the code and start it before class 
                // play_func's essensed span dosen change so this cause a bug.
                // What's the bug?
                // The bug is essenced span dosen't change from before span.
                // If before of code had 10 char and change the code it still 10 char.
                // So I add this code to fix this bug.
                // If code is changed, rerender the play ui.
                play_func_ins.delete()
                const code: string = code_data().code_data_obj[
                                code_data().code_lang as 'python' | 'rust' | 'typescript'
                ]?.[code_data().code_point]?.code || '404'
                
                console.log(code_data().code_point)
                console.error(code)
                setTimeout(() => {

                                if (!first_mount) {
                                                play_func_ins = new play_func()
                                }
                                play_func_ins.init(code)
                                play_func_ins.fetch_char_spans_ignore_space_after_line_break_as_elm()
                }, 500);
}