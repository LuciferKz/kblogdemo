import Util from "@/util";
import Base from "./Base";
export default class extends Base {
  constructor(cfg) {
    const _cfg = Util.deepMix(
      {},
      {
        alias: "Body",
        includes: [],
        editable: false,
      },
      cfg
    );
    _cfg.includes = _cfg.includes.concat(["kitx-section"]);
    super(_cfg);
  }
}
