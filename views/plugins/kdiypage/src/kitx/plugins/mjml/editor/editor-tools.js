import $k from "@/util/dom";
import Util from "@/util";

export class EditorTools {
  constructor(cfg) {
    const _cfg = Util.mix(
      {
        editor: null,
        container: null,
        tools: [
          { type: "parent", label: "上级", icon: "fa-arrow-up" },
          { type: "delete", label: "删除", icon: "fa-trash-o" },
        ],
      },
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
    this.addBox();
    this.addLabel();
    this.addGuideLine();
    this.addToolbar();

    const editor = this.get("editor");

    const kitx = editor.get("kitx");
    const container = kitx.get("container");
    const containerBox = container.getBoundingClientRect();
    const min = containerBox.top;
    const max = containerBox.bottom;

    editor.on("afterChangeSelected", (kit) => {
      if (kit) {
        const box = kit.getBox();
        this.toolbar.show();
        const tbox = this.toolbar.getBoundingClientRect();
        let toolbarY = box.top - 20;
        if (toolbarY < min) {
          toolbarY = box.bottom;
        } else if (toolbarY >= max) {
          toolbarY = box.top;
        }
        this.toolbar.css({
          left: box.right - tbox.width,
          top: toolbarY,
        });
      } else {
        this.toolbar.hide();
      }
    });

    editor.on("afterChangeHovered", (kit) => {
      if (kit) {
        const box = kit.getBox();
        this.badge.show();
        const bbox = this.badge.getBoundingClientRect();
        this.badge.html(kit.get("alias"));
        let badgeY = box.top - bbox.height;

        if (badgeY <= min) {
          badgeY = min;
        } else if (badgeY >= max) {
          badgeY = box.top;
        }

        this.badge.css({
          left: box.left,
          top: badgeY,
        });
      } else {
        this.badge.hide();
      }
    });

    editor.on("afterItemDragEnd", () => {
      this.guideLine.css({ opacity: 0 });
    });
    editor.on("afterKitDragEnd", () => {
      this.guideLine.css({ opacity: 0 });
    });
    editor.on("afterKitDragOver", (styls) => {
      this.guideLine.css(styls);
    });
  }

  handleEvent(tool) {
    if (tool.type === "delete") {
      this.selected.remove();
    }
  }

  addBox() {
    const container = this.get("container");
    const box = $k(document.createElement("section"));
    box.addClass("kitx-editor-tools");
    this.box = box;
    $k(document.body).append(box);
  }

  addLabel() {
    const badge = $k(document.createElement("span"));
    badge.addClass("kitx-item-badge");
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
    this.box.append(badge);
  }

  addGuideLine() {
    const guideLine = $k(document.createElement("div"));
    guideLine.addClass("kitx-guide-line");
    guideLine.css({
      position: "absolute",
      top: "50%",
      left: "0",
      width: "100px",
      borderRadius: "2px",
      height: "3px",
      backgroundColor: "#7ac16d",
      // outline: "1px solid #7ac16d",
      marginLeft: "-1px",
      transition: "top .2s linear,left .1s linear",
      opacity: "0",
      pointerEvents: "none",
    });
    this.guideLine = guideLine;
    this.box.append(guideLine);
  }

  addToolbar() {
    const toolbar = $k(document.createElement("div"));
    toolbar.addClass("kitx-toolbar");
    const tools = this.get("tools");
    toolbar.css({
      position: "absolute",
      top: "0",
      left: "0",
      zIndex: 999,
      lineHeight: "22px",
      backgroundColor: "#3b97e3",
      color: "#FFF",
      padding: "0 4px",
      fontSize: "12px",
    });
    toolbar.hide();
    this.toolbar = toolbar;
    this.box.append(toolbar);

    Util.each(tools, (tool) => {
      const _tool = $k(document.createElement("span"));
      _tool.addClass(`kitx-tool-${tool.type}`);
      _tool.addClass("fa");
      _tool.addClass(tool.icon);
      _tool.css({
        margin: "0 2px",
        cursor: "pointer",
      });
      _tool.html(tool.label);
      toolbar.append(_tool);
    });
  }
}
