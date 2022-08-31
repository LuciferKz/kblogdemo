import Util from "@/util";
import Base from "./Base";
export default class extends Base {
  constructor(cfg) {
    const _cfg = Util.deepMix(
      {},
      {
        alias: "Body",
        includes: [
          "single-column",
          "double-column",
          "trible-column",
          "kitx-section",
        ],
      },
      cfg
    );
    super(_cfg);
  }
}
