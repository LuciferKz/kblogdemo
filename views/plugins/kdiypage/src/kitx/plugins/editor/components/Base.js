import Util from "@/util";
import { EventEmitter } from "../../event-emitter";
export default class b extends EventEmitter {
  constructor(cfg = {}) {
    super();
    const _cfg = Util.mix(
      {
        excludes: [],
        includes: [],
      },
      cfg
    );
    this.set = function (key, val) {
      _cfg[key] = val;
    };
    this.get = function (key) {
      return _cfg[key];
    };
    this._init();
  }

  _init() {
    this._render();
  }

  _render() {
    const kit = this.get("kit");
    const refs = kit.get("refs");
    const container = refs.container;
    // console.log("mouseover", kit.get("seqNum"));
    if (container) {
      // container.css({
      //   outline: "1px dashed rgba(170,170,170,0.7)",
      //   outlineOffset: "-2px",
      // });

      container.on("mouseover", (e) => {
        e.stopPropagation();
        container.addClass("kitx-hovered");
        this.emit("container:mouseover");
      });

      container.on("mouseout", (e) => {
        e.stopPropagation();
        container.removeClass("kitx-hovered");
        this.emit("container:mouseout");
      });

      container.on("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.emit("container:click");
      });

      if (this.get("draggable")) {
        container.attrs("draggable", "true");
      }

      container.on("dragstart", (e) => {
        e.stopPropagation();
        this.emit("container:dragstart", e);
      });

      container.on("dragend", (e) => {
        e.stopPropagation();
        this.emit("container:dragend", e);
      });
      container.on("dragover", (e) => {
        // e.stopPropagation();
        e.preventDefault();
        this.emit("container:dragover", e);
      });
      container.on("dragleave", (e) => {
        // e.stopPropagation();
        this.emit("container:dragleave", e);
      });
      container.on("drop", (e) => {
        this.emit("container:drop", e);
      });
    }
  }

  getContainer() {
    const kit = this.get("kit");
    const refs = kit.get("refs");
    const container = refs.container;
    return container;
  }

  getChildren() {
    const kit = this.get("kit");
    const children = kit.get("children");
    return children;
  }

  getBox() {
    const kit = this.get("kit");
    const refs = kit.get("refs");
    const container = refs.container;
    if (container) {
      return container.getBoundingClientRect();
    } else {
      return { top: 0, left: 0, width: 0, height: 0 };
    }
  }
}
