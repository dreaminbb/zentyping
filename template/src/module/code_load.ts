import play_func_inc from '@/module/play_func'
import { code_data } from '@/store/store'

export function code_load(first_mount: boolean): void {

  // If player change the code and start it before class 
  // play_func's essensed span dosen change so this cause a bug.
  // What's the bug?
  // The bug is essenced span dosen't change from before span.
  // If before of code had 10 char and change the code it still 10 char.
  // So I add this code to fix this bug.
  play_func_inc.delete()
  // If code is changed, rerender the play ui.
  const code: string = code_data().code_data_obj[
    code_data().code_lang as 'python' | 'rust' | 'typescript'
  ]?.[code_data().code_point]?.code || '404'
  //* wait until finish rendering
  // I think this code supposed to be not wait time. 
  // It supposed to be chack the rendering is finished.
  // But I don't know how to do that.

  setTimeout(() => {
    play_func_inc.init(code)
  },200)
}
