import Util from "@/util";
import { EventEmitter } from "../event-emitter";
import { EditorTools } from "./editor-tools";
import createEditor from "./components";
import $k from "@/util/dom";

export class KitEditor extends EventEmitter {
  constructor(cfg) {
    super();
    const _cfg = Util.mix(
      {
        kitx: null,
        store: {
          kiteditors: {},
        },
        events: {},
        dragInfo: {},
      },
      this.getDefaultCfg(),
      cfg
    );

    this.set = function (key, val) {
      _cfg[key] = val;
    };
    this.get = function (key) {
      return _cfg[key];
    };
    this.init();
  }

  init() {
    const kitx = this.get("kitx");
    const kits = kitx.get("kits");
    // 处理虚拟容器
    const container = kitx.get("container");
    container.css("position", "relative");

    kitx.on("afterAddItem", (kit) => {
      this.addItem(kit);
      if (kitx.get("status") === "editing" && kit.get("editable")) {
      }
    });

    document.addEventListener("click", () => {
      this.changeSelected(null);
    });

    this.addBody();
    this.$tools = new EditorTools({
      editor: this,
      container,
    });
  }

  addItem(kit) {
    const kitEditor = createEditor(kit.get("type"), { kit, editor: this });
    kitEditor.on("container:mouseover", () => {
      this.emit("afterChangeHovered", kitEditor);
    });

    kitEditor.on("container:mouseout", () => {
      this.emit("afterChangeHovered", null);
    });

    kitEditor.on("container:click", () => {
      this.changeSelected(kitEditor);
    });

    this.initDragEvents(kitEditor);
  }

  initDragItem(el) {
    el = $k(el);
    el.attrs({ draggable: true });
    const dragInfo = this.get("dragInfo");
    el.on("dragstart", (e) => {
      dragInfo.type = e.target.dataset.type;
    });
    el.on("dragend", () => {
      this.emit("afterItemDragEnd");
    });
  }

  initDragEvents(kitEditor) {
    const excludes = kitEditor.get("excludes");
    const includes = kitEditor.get("includes");
    const dragInfo = this.get("dragInfo");
    const container = kitEditor.getContainer();

    // 落在哪个kit上，主要是根据此kit判断插入的上下位置
    let prevKit = null;
    let nextKit = null;

    kitEditor.on("container:dragover", (e) => {
      let type = dragInfo.type;

      if (excludes.includes(type) || !includes.includes(type)) {
        dragInfo.enter = kitEditor.get("kit");
        return;
      } else {
        container.addClass("kitx-drag-over");
        e.stopPropagation();
      }

      const clientY = e.clientY;
      const clientX = e.clientX;
      prevKit = null;
      nextKit = null;
      const children = kitEditor.getChildren();
      const direction = kitEditor.get("direction");
      if (dragInfo.enter) {
        const currentKit = dragInfo.enter;
        const box = currentKit.getBox();
        const dirs =
          direction === "row"
            ? [
                { type: "left", value: clientX - box.left },
                { type: "right", value: box.right - clientX },
              ]
            : [
                { type: "top", value: clientY - box.top },
                { type: "bottom", value: box.bottom - clientY },
              ];
        const sortArr = dirs.sort((a, b) => {
          return a.value - b.value;
        });
        const min = sortArr[0];
        if (min.type === "top" || min.type === "left") {
          prevKit = currentKit.prevSibling();
          nextKit = currentKit;
        } else {
          prevKit = currentKit;
          nextKit = currentKit.nextSibling();
        }
      } else {
        if (children) {
          Util.each(children, (child, index) => {
            const kbox = child.getBox();
            const t = kbox.top + kbox.height / 2;
            if (clientY < t) {
              nextKit = child;
              return false;
            }
            prevKit = child;
          });
        } else {
          nextKit = null;
          prevKit = null;
        }
      }

      const gbox = {
        opacity: 1,
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      };

      if (nextKit || prevKit) {
        if (nextKit) {
          const { top, left, width, height } = nextKit.getBox();
          Util.mix(gbox, { top, left, width, height });
        } else {
          const { top, left, bottom, right, width, height } = prevKit.getBox();
          direction === "row"
            ? Util.mix(gbox, { top, left: right, width, height })
            : Util.mix(gbox, { top: bottom, left, width, height });
        }

        gbox.width = direction === "row" ? "3px" : gbox.width;
        gbox.height = direction === "row" ? gbox.height : "3px";
      } else {
        const { top, left, width, height } = kitEditor.getBox();
        Util.mix(gbox, { top: top + height / 2, left, width, height: "3px" });
      }
      this.emit("afterKitDragOver", { opacity: 1, ...gbox });
    });

    kitEditor.on("container:dragstart", (e) => {
      const kit = kitEditor.get("kit");
      const type = kit.get("type");
      dragInfo.kit = kitEditor.get("kit");
      dragInfo.type = type;
      this.emit("after");
    });

    kitEditor.on("container:dragleave", (e) => {
      dragInfo.enter = null;
      container.removeClass("kitx-drag-over");
    });

    kitEditor.on("container:dragend", (e) => {
      dragInfo.kit = null;
      this.emit("afterKitDragEnd");
    });

    kitEditor.on("container:drop", (e) => {
      if (!container.hasClass("kitx-drag-over")) {
        return;
      }

      e.stopPropagation();
      container.removeClass("kitx-drag-over");
      const kitx = this.get("kitx");
      const kit = kitEditor.get("kit");
      const type = dragInfo.type;
      const index = nextKit ? nextKit.getIndex() : null;
      if (dragInfo.kit) {
        kitx.moveItemTo(dragInfo.kit, kit.get("seqNum"), index);
      } else {
        kitx.add({ type, pid: kit.get("seqNum") }, index);
      }
      dragInfo.kit = null;
    });
  }

  removeItem(kit) {
    const store = this.get("store");
    const seqNum = kit.get("seqNum");
    const kiteditor = store.kiteditors[seqNum];
    delete store.kiteditors[seqNum];

    Util.each(kiteditor.events, (fn, evt) => {
      const el = kit.get("el");
      el.removeEventListener(evt, fn);
      kit.update({
        style: {
          outline: "none",
          margin: "0",
        },
      });
    });
  }

  changeSelected(target) {
    const selected = this.get("selected");
    if (selected) selected.getContainer().removeClass("kitx-selected");
    if (target) {
      this.set("selected", target);
      target.getContainer().addClass("kitx-selected");
    }
    this.emit("afterChangeSelected", target);
  }

  getDefaultCfg() {
    return {};
  }

  getEvents(type) {
    const events = this.get("events");
    return events[type];
  }

  addEvents(type, evts) {
    const events = this.get("events");
    events[type] = evts;
  }

  addBody() {
    const kitx = this.get("kitx");
    kitx.load({
      type: "kitx-body",
      children: [],
    });
  }
}
