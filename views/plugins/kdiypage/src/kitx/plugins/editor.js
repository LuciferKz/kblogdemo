import Util from "@/util";
import Kit from "../kit";
import $k from "@/util/dom";

export class KitEditor {
  constructor(cfg) {
    const _cfg = Util.mix(
      {
        kitx: null,
        store: {
          kiteditors: {},
        },
        events: {},
        container: null,
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

    this.$dragger = new KitEditorDragger();

    this.addBody();
    this.addEditTools();

    document.addEventListener("click", () => {
      const selected = this.get("selected");
      if (selected) selected.removeClass("kitx-selected");
    });

    Util.each(kits, (kit) => {
      const el = kit.get("el");
      if (el) {
        el.on("dragover", (e) => {
          e.stopPropagation();
        });
        el.on("dragleave", (e) => {
          e.stopPropagation();
        });
      }
    });

    // 添加kit后绑定
    kitx.on("afterAddItem", (kit) => {
      // console.log(kit);
      this.addItem(kit);
      if (kitx.get("status") === "editing" && kit.get("editable")) {
        // console.log(kit);
        // this.addItem(kit);
      }
    });

    kitx.on("afterAddKitstree", (kitstree) => {
      console.log(123);
      const tree = [...kitstree];
      while (tree.length > 0) {
        const kit = tree.splice(0, 1)[0];
        console.log(kit);
        this.addItem(kit);
        const children = kit.get("children");
        if (children) {
          tree.unshift(...children);
        }
      }
    });

    Util.each(kits, (kit) => {
      this.addItem(kit);
      if (kitx.get("status") === "editing" && kit.get("editable")) {
        // this.addItem(kit);
      }
    });
  }

  addItem(kit) {
    const store = this.get("store");
    const seqNum = kit.get("seqNum");
    const type = kit.get("type");
    const events = {};
    const editEvents = {
      ...this.getDefaultEvents(kit),
      ...this.getEvents(type),
    };
    Util.each(editEvents, (fn, evt) => {
      events[evt] = (e) => {
        fn.call(kit, e);
      };
    });

    store.kiteditors[seqNum] = { events };
    kit.on("load", () => {
      Util.each(events, (fn, evt) => {
        const el = kit.get("el");
        el.on(evt, fn);
      });
      this.addDragKit(kit);
    });
  }

  addDragItem(el) {
    const editTool = this.get("editTool");
    el = $k(el);
    el.attrs({ draggable: true });
    el.on("dragstart", this.$dragger.onItemDragStart());
    el.on("dragend", () => {
      editTool.guideLine.css({ opacity: 0 });
    });
    el.on("drag", this.$dragger.onItemDrag());
    el.on("drop", this.$dragger.onItemDrop());
  }

  addDragKit(kit) {
    const excludes = kit.get("excludes");
    const includes = kit.get("includes");
    const guideLine = this.get("editTool").guideLine;
    const kitx = this.get("kitx");
    const el = kit.get("el");
    el.attrs({ draggable: true });
    kit.update(
      Util.mix(
        {
          attrs: {
            draggable: true,
          },
        },
        kit.get("editing")
      )
    );

    el.on("dragenter", (e) => {
      e.stopPropagation();
      const dragItem = this.$dragger.dragitem;
      const type = dragItem.dataset.type;
      if (excludes.includes(type) || !includes.includes(type)) {
        return;
      }
    });

    el.on("dragover", (e) => {
      e.preventDefault();
      const dragItem = this.$dragger.dragitem;
      const type = dragItem.dataset.type;
      if (excludes.includes(type) || !includes.includes(type)) {
        return;
      } else {
        e.stopPropagation();
      }

      const clientY = e.clientY;
      const clientX = e.clientX;

      const children = kit.get("children");

      let currentKit = kit;

      Util.each(children, (child, index) => {
        const kbox = this.getKitBox(child);
        if (index === 0 && kbox.top < clientY) {
          currentKit = child;
        } else if (index === children.length - 1 && kbox.bottom > clientY) {
          currentKit = child;
        } else if (kbox.top < clientY && kbox.bottom > clientY) {
          currentKit = child;
        }
      });

      // console.log("currentKit", currentKit);
      const box = currentKit ? this.getKitBox(currentKit) : this.getKitBox(kit);

      const sortArr = [
        // {
        //   type: "left",
        //   value: clientX - box.l,
        // },
        {
          type: "top",
          value: clientY - box.t,
        },
        // {
        //   type: "right",
        //   value: box.r - clientX,
        // },
        {
          type: "bottom",
          value: box.b - clientY,
        },
      ].sort((a, b) => {
        return a.value - b.value;
      });

      const min = sortArr[0];

      guideLine.css({
        opacity: 1,
        width:
          min.type === "left" || min.type === "right"
            ? "3px"
            : box.width + "px",
        height:
          min.type === "top" || min.type === "bottom"
            ? "3px"
            : box.height + "px",
        left:
          min.type === "left" || min.type === "right"
            ? min.type === "left"
              ? box.left + "px"
              : box.right + "px"
            : box.left + "px",
        top:
          min.type === "top" || min.type === "bottom"
            ? min.type === "top"
              ? box.top + "px"
              : box.bottom + "px"
            : box.top + "px",
      });
    });

    el.on("drag", this.$dragger.onKitDragStart());
    el.on("drop", (e) => {
      const dragItem = this.$dragger.dragitem;
      const type = dragItem.dataset.type;
      const kitx = this.get("kitx");
      if (excludes.includes(type) || !includes.includes(type)) {
        return;
      } else {
        e.stopPropagation();
      }
      const children = kit.get("children");
      kitx.addItem({
        type,
        parent: kit.get("seqNum"),
      });
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
    if (selected) selected.removeClass("kitx-selected");
    this.set("selected", target);
    target.addClass("kitx-selected");
  }

  getDefaultCfg() {
    return {};
  }

  getDefaultEvents(kit) {
    const kitxeditor = this;
    const editTool = this.get("editTool");
    const kitx = this.get("kitx");
    const container = kitx.get("container");
    const containerBox = container.getBoundingClientRect();
    const min = containerBox.top;
    const max = containerBox.bottom;

    return {
      mouseover(e) {
        e.stopPropagation();
        this.addClass("kitx-hovered");
        const box = kitxeditor.getKitBox(this);
        editTool.badge.show();
        editTool.badge.html(this.get("alias"));
        let badgeY = box.top - 20;

        if (badgeY < min) {
          badgeY = box.bottom;
        }

        if (badgeY >= max) {
          badgeY = box.top;
        }

        editTool.badge.css({
          left: box.left + "px",
          top: badgeY + "px",
        });
        // console.log("over", kit.get("type"));
      },
      mouseout(e) {
        e.stopPropagation();
        editTool.badge.hide();
        this.removeClass("kitx-hovered");
        // console.log("out", kit.get("type"));
      },
      click(e) {
        e.preventDefault();
        e.stopPropagation();
        kitxeditor.changeSelected(this);
      },
      blur(e) {
        kitxeditor.changeSelected(this);
      },
    };
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
    kitx.addItem({
      type: "kit-body",
    });
  }

  // 编辑框，相关内容，及工具
  addEditTools() {
    const editTool = new EditTool($k(document.body));
    this.set("editTool", editTool);
    return editTool;
  }

  getKitBox(kit) {
    const kitx = this.get("kitx");
    const el = kit.get("el");
    const { top, left, bottom, right, width, height } =
      el.getBoundingClientRect();
    const box = {
      top,
      left,
      bottom,
      right,
      width,
      height,
      l: left,
      t: top,
      r: right,
      b: bottom,
    };
    // const container = kitx.get("container");
    // const containerBox = container.getBoundingClientRect();
    // box.top = box.top - containerBox.top;
    // box.bottom = box.bottom - containerBox.top;
    // box.left = box.left - containerBox.left;
    // box.right = box.right - containerBox.left;

    return box;
  }
}

export class KitEditorDragger {
  constructor() {
    this.dragitem = null;
    this.dragkit = null;
  }

  onItemDragStart() {
    const dragger = this;
    return function (e) {
      dragger.dragitem = e.target;
    };
  }
  onItemDragEnd() {
    const dragger = this;
    return function (e) {
      dragger.dragitem = e.target;
    };
  }

  onItemDrag(e) {}

  onItemDrop(e) {
    // console.log(e);
  }

  onKitDragOver(kit, fn) {
    return function (e) {};
  }

  onKitDragStart() {
    const dragger = this;
    return function (e) {
      dragger.dragkit = e.target;
    };
  }

  onKitDrop(kit) {
    const dragger = this;
    return function (e) {};
  }
}

const DragItemEvents = {};

export class EditTool {
  constructor(container) {
    this.container = container;
    this.init();
  }

  init() {
    // this.addBox();
    this.addLabel();
    this.addGuideLine();
  }

  // addBox() {
  //   const box = $k(document.createElement("div"));
  //   box.addClass("kitx-edit-box");
  //   box.css({
  //     display: "none",
  //     position: "absolute",
  //     outline: "1px solid #3b97e3",
  //     outlineOffset: "-1px",
  //     zIndex: 0,
  //   });
  //   this.box = box;
  //   this.container.append(box);
  // }

  addLabel() {
    const badge = $k(document.createElement("span"));
    badge.css({
      position: "absolute",
      top: "0",
      left: "0",
      zIndex: 999,
      lineHeight: "22px",
      backgroundColor: "#3b97e3",
      color: "#FFF",
      padding: "0 8px",
      fontSize: "12px",
    });
    this.badge = badge;
    this.container.append(badge);
  }

  addGuideLine() {
    const guideLine = $k(document.createElement("div"));
    guideLine.className = "kitx-guide-line";
    guideLine.css({
      position: "absolute",
      top: "50%",
      left: "0",
      width: "100px",
      borderRadius: "2px",
      height: "3px",
      backgroundColor: "#7ac16d",
      transition: "top .1s linear,left .1s linear",
      opacity: "0",
    });
    this.guideLine = guideLine;
    this.container.append(guideLine);
  }
}
