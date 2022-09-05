import Util from "@/util";
import Base from "./Base";
import { KitxTextAttributes } from "./attributes";
export default class extends Base {
  constructor(cfg) {
    const _cfg = Util.deepMix(
      {},
      {
        alias: "Text",
        editable: true,
        draggable: true,
      },
      cfg
    );
    super(_cfg);
  }
}
