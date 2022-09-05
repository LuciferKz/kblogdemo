import Util from "@/util";
import Base from "./Base";
import { KitxSpacerAttributes } from "./attributes";
export default class extends Base {
  constructor(cfg) {
    const _cfg = Util.deepMix(
      {},
      {
        alias: "Spacer",
        editable: true,
        draggable: true,
      },
      cfg
    );
    super(_cfg);
  }
}
