import play_func_inc from '@/module/play_func'
import { code_data } from '@/store/store'
import { store_code_type } from '@/interface'
import short_cut_ins from './short_cut_manager'

export async function code_load(): Promise<void> {

  try {
    play_func_inc.delete()
    // If code is changed, rerender the play ui.

    const store_instance = code_data()

    const pointer: number = store_instance.code_point as number;

    const lang: string = store_instance.code_lang as keyof store_code_type;

    const code: string = store_instance.code_data_obj?.[lang as keyof store_code_type]?.[pointer]?.code as string;

    console.log('code_load.ts', code)

    console.log(code, 'code_load.ts')
    //* wait until finish rendering
    // I think this code supposed to be not wait time. 
    // It supposed to be chack the rendering is finished.
    // But I don't know how to do that.

    setTimeout(() => {
      short_cut_ins.init()
      play_func_inc.init(code)
    }, 200)

  } catch (error) {
    console.error('Error fetching code:', error);
  }
}
