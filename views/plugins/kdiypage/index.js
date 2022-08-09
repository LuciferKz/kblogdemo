class EasyDiyPage {
  constructor(cfg) {
    const data = [
      {
        id: 1,
        type: "singleColumn",
        attrs: {
          a: "1",
          b: "2",
        },
        data: {
          a: "1",
          b: "2",
        },
        children: [
          {
            id: 11,
            type: "tr",
          },
          {
            id: 12,
            type: "tr",
          },
        ],
      },
    ];
    const _cfg = { data, container: document.body };

    _cfg.container = cfg.container;

    this.set = function (key, val) {
      _cfg[key] = val;
    };
    this.get = function (key) {
      return _cfg[key];
    };

    this.init();
  }

  init() {
    const data = this.get("data");
    this.$renderer = new KitRenderer();
    this.$factory = new KitFactory();
    const kits = this.toKits(data);
    const html = this.toHtml(data);
    const _data = this.toJson(kits);
    console.log(kits);
    console.log(html);
    console.log(_data);
  }

  toJson(kits) {
    return kits.map((kit) => {
      return kit.getData();
    });
  }

  toKits(kits) {
    return kits.map((d) => {
      if (d.children) d.children = this.toKits(d.children);
      return this.$factory.create(d);
    });
  }

  toHtml(data) {
    return JsonToHtml(data);
  }
}

class KitRenderer {
  constructor(cfg) {}

  toHtml(data) {
    return JsonToHtml(data);
  }
}

class KitDragger {
  constructor() {}
}

class KitEditBox {
  constructor(cfg) {}

  wrap() {}
}

class Kit {
  constructor(cfg) {
    const _cfg = Object.assign(
      {
        id: null, // 唯一标识
        name: null, // Kit Name
        type: "", // 类型
        children: [], // 子Kit
      },
      cfg
    );
    this.set = function (key, val) {
      _cfg[key] = val;
    };
    this.get = function (key) {
      return _cfg[key];
    };
    this.cfg = _cfg;
    this.init();
  }

  init() {}

  addChild(child) {
    const children = this.get("children");
    children.push(child);
  }

  getData() {
    const cfg = this.cfg;
    cfg.children = cfg.children.map((child) => child.getData());
    return this.cfg;
  }

  toHtml() {
    return JsonToHtml([this.cfg]);
  }
}

class KitTable extends Kit {
  constructor(cfg = {}) {
    const _cfg = Object.assign(
      {
        type: "table",
        children: [], // 只支持 KitTr和KitTd
      },
      cfg
    );

    super(_cfg);
  }
}

class KitTr extends Kit {
  constructor(cfg) {
    const _cfg = Object.assign({}, cfg);
    super(_cfg);
  }
}

class KitTd extends Kit {
  constructor(cfg) {
    const _cfg = Object.assign({}, cfg);
    super(_cfg);
  }
}

class KitSingleColumn extends KitTable {
  constructor(cfg = {}) {
    const _cfg = Object.assign({ col: 1, type: "singleColumn" }, cfg);
    super(_cfg);
    this.init();
  }

  init() {
    const col = this.get("col");
    for (let i = 0; i < col; i++) {
      this.addChild(new KitTr());
    }
  }
}
class KitDoubleColumn extends KitTable {
  constructor() {
    super({ col: 2 });
  }
}

const tags = {};

const KitComponents = {
  singleColumn: KitSingleColumn,
  doubleColumn: KitDoubleColumn,
  tr: KitTr,
  td: KitTd,
};

const KitTags = {
  table: ["singleColumn", "doubleColumn"],
  tr: ["tr"],
  td: ["td"],
};

class KitFactory {
  constructor() {}

  create(d) {
    if (!d.type) throw Error("type is requried");
    return new KitComponents[d.type](d);
  }

  register(key, cons) {
    KitComponents[key] = cons;
  }
}

function JsonToHtml(data) {
  const processAttr = function (attrs) {
    if (!attrs) return "";
    const keys = Object.keys(attrs);
    return keys
      .map((k) => {
        return ` ${k}="${attrs[k]}"`;
      })
      .join("");
  };

  const processData = function (data) {
    if (!data) return "";
    const keys = Object.keys(data);
    return keys
      .map((k) => {
        return ` data-${k}="${data[k]}"`;
      })
      .join("");
  };

  const processChildren = function (kit) {
    if (kit.html) {
      return kit.html;
    } else if (kit.children) {
      return JsonToHtml(kit.children);
    } else {
      return "";
    }
  };

  const tags = /(div|span|)/;

  return data
    .map((d) => {
      return `<${d.tag} id="${d.id}"${processData(d.data)}${processAttr(
        d.attrs
      )}>${processChildren(d)}</${d.tag}>`;
    })
    .join("");
}

/**
 * kit
 * id
 * name
 * type
 * children: [kit]
 * props
 */

/** form
 *
 * id
 * name
 * type
 * props: {
 *   required
 *   visible
 *   editable
 *   value
 * }
 *
 */

/**
 * {
 *   id: 'form_1',
 *   type: 'form',
 *   components: []
 * }
 * {
 *   id: 'input_1',
 *   type: 'input'
 * }, {
 *   id: 'select_1',
 *   visible: 'input_1 === 1',
 * }
 *
 *
 *
 * visible: ''
 *
 * visible: false
 *
 */
