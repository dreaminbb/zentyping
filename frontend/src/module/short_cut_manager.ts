import play_func_ins from "./play_func";

class short_cut {

  public short_cut_handler: (e: KeyboardEvent) => void;

  constructor() {
    this.short_cut_handler = this.handle_keydown_for_short_cut.bind(this);
  }

  public able_short_cut(): void {
    document.addEventListener('keydown', this.handle_keydown_for_short_cut);
  }

  public disable_chort_cut(): void {
    document.removeEventListener('keydown', this.handle_keydown_for_short_cut);
  }

  public handle_keydown_for_short_cut(e: KeyboardEvent): void {
    if (e.key === 'Tab') {
      play_func_ins.next_code();
    }

  }

}

const short_cut_ins = new short_cut();
export default short_cut_ins;
