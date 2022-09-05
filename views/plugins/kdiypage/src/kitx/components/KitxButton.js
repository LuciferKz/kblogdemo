import Util from "@/util";
import Base from "./Base";
export default class extends Base {
  constructor(cfg) {
    const _cfg = Util.deepMix(
      {},
      {
        alias: "Button",
        draggable: true,
        editable: true,
      },
      cfg
    );
    super(_cfg);
  }
}
