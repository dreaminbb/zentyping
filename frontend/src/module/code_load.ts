import play_func_inc from '@/module/play_func'
import { code_data } from '@/store/store'
import { available_code_list } from '@/interface'

export async function code_load(): Promise<void> {

  // If player change the code and start it before class 
  // play_func's essensed span dosen change so this cause a bug.
  // What's the bug?
  // The bug is essenced span dosen't change from before span.
  // If before of code had 10 char and change the code it still 10 char.
  // So I add this code to fix this bug.
  //

  code_data().code_point++
  play_func_inc.delete()
  // If code is changed, rerender the play ui.

  const store_instance = code_data()
  const pointer: number = store_instance.code_point as number;

  const lang: keyof typeof available_code_list = store_instance.code_lang as keyof typeof available_code_list;
  const code: string = (store_instance[lang] as 'python' | 'rust' | 'typescript')?.[pointer]?.code || '404'

  if (!code) {
    await code_data().one_lang_update_stored_code(code_data().code_lang, code_data().code_point)
  }

  console.log(code, 'code_load.ts')
  //* wait until finish rendering
  // I think this code supposed to be not wait time. 
  // It supposed to be chack the rendering is finished.
  // But I don't know how to do that.

  setTimeout(() => {
    play_func_inc.init(code)
  }, 200)
}
