import { code_data } from "@/store/store";
import play_func_ins from "./play_func";

class short_cut {

  public short_cut_handler: (e: KeyboardEvent) => void;

  constructor() {
    this.short_cut_handler = this.handle_keydown_for_short_cut.bind(this);
  }

  public init(): void {
    this.disable_chort_cut()
    this.able_short_cut()
  }

  public able_short_cut(): void {
    document.addEventListener('keydown', this.handle_keydown_for_short_cut);
  }

  public disable_chort_cut(): void {
    document.removeEventListener('keydown', this.handle_keydown_for_short_cut);
  }

  public handle_keydown_for_short_cut(e: KeyboardEvent): void {
    console.log(e.key)
    if (e.key === 'Tab') {

      e.preventDefault();
      console.log(code_data().code_point)

      try {
        play_func_ins.next_code();
      } catch (e) {
        console.error(e);
      }
    }
  }
}

const short_cut_ins = new short_cut();
export default short_cut_ins;
