/**
 *
 * type: "kit-table",
 * alias: "Table",
 * tag: "table", 标签类型, String | Object 默认 Div
 * attrs: {
 *   width: "100%",
 * }, // Html标签属性
 * props: {}, Js属性
 * data: {}, 存储在标签上的值
 * includes: ["tr"], 可以插入的组件类型
 * excludes: [], 不可以插入的组件类型
 *
 *
 * kitxtree: [],
 * 组件的基本构成
 * [{ type: 'div', children: [{ type: 'span', innerHTML: '123' }] }]
 * == <div><span>123</span></div>
 * 内部结构组件的属性不可通过，只接受初试配置
 * 内部组件的内容可以通过slot字段传入修改
 *
 * {
 *   type: 'kit-column',
 *   kitxtree: [{ type: 'div', children: [{ type: 'span', innerHTML: '123' }] }]
 * }
 *
 * inject: {} kitxtree内专用，提供内部子组件数据
 *
 * provide 接收父组件属性
 *
 * editable 编辑状态
 */

const Kit = {
  type: "kit-table",
  alias: "Table",
  tag: "table", // 标签类型, String | Object 默认 Div
  attrs: {
    width: "100%",
  }, // Html标签属性
  props: {}, // Js属性
  data: {}, // 存储在标签上的值
  includes: ["tr"], // 可以插入的组件类型
  excludes: [], //不可以插入的组件类型
  template: ``,
  kitxtree: [], // 组件的基本构成 [{ type: 'div', children: [{ type: 'span', innerHTML: '123' }] }]
};

const KitBody = {
  type: "kit-body",
  tag: "section",
  alias: "Body",
  style: {
    width: "100%",
    minHeight: "100%",
  },
  includes: ["single-column", "double-column", "trible-column"],
  kitxtree: [
    {
      tag: "section",
      style: {
        margin: "0px auto",
        maxWidth: "600px",
        pointerEvents: "none",
      },
      children: "$default",
    },
  ],
};

const KitSection = {
  type: "kit-section",
  alias: "Section",
  tag: "section",
  includes: [],
  editable: true,
  attrs: {
    class: "kitx-section",
  },
  style: {
    pointerEvents: "all",
    padding: "10px 0",
  },
  editing: {
    style: {
      outline: "1px dashed rgba(170,170,170,0.7)",
      outlineOffset: "-2px",
    },
  },
  kitxtree: [
    {
      tag: "table",
      attrs: {
        cellpadding: 0,
        cellspacing: 0,
        border: 0,
        width: "100%",
      },
      children: [
        {
          tag: "tr",
          children: [
            {
              tag: "td",
              attrs: {
                class: "kitx-flex",
              },
              children: "$default",
            },
          ],
        },
      ],
    },
  ],
};

const KitColumn = {
  type: "kit-column",
  alias: "Column",
  tag: "section",
  includes: "*",
  editable: true,
  style: {
    pointerEvents: "all",
    padding: "10px 0",
    verticalAlign: "top",
    fontSize: "0px",
    textAlign: "left",
    direction: "ltr",
    display: "inline-block",
    verticalAlign: "top",
    width: "100%",
  },
  editing: {
    style: {
      outline: "1px dashed rgba(170,170,170,0.7)",
      outlineOffset: "-2px",
    },
  },
  attrs: {
    class: "kitx-flex-12",
  },
  kitxtree: [
    {
      tag: "table",
      attrs: {
        width: "100%",
        cellpadding: 0,
        cellspacing: 0,
        border: 0,
      },
      style: {
        verticalAlign: "top",
        pointerEvents: "none",
      },
      children: [
        {
          tag: "tr",
          style: {
            pointerEvents: "all",
            display: "table",
            width: "100%",
          },
          children: [
            {
              tag: "td",
              style: {
                fontSize: "0px",
                wordBreak: "break-word",
                pointerEvents: "none",
              },
              excludes: ["single-column", "double-column", "trible-column"],
              children: "$default",
            },
          ],
        },
      ],
    },
  ],
};

const KitRicheditor = {
  type: "kit-richeditor",
  alias: "Text",
  tag: "div",
  editable: true,
  style: {
    padding: "10px 25px",
    fontSize: "14px",
    pointerEvents: "all",
  },
  events: {},
};

const KitSingleColumn = {
  type: "single-column",
  data: [
    {
      type: "kit-section",
      children: [
        {
          type: "kit-column",
          children: [
            {
              type: "kit-richeditor",
              content: "Content 1",
            },
          ],
        },
      ],
    },
  ],
};

const KitDoubleColumn = {
  type: "double-column",
  alias: "Section",
  tag: "section",
  includes: [],
  editable: true,
  attrs: {
    class: "kitx-section",
  },
  style: {
    padding: "10px 0",
  },
  editing: {
    style: {
      outline: "1px dashed rgba(170,170,170,0.7)",
      outlineOffset: "-2px",
    },
  },
  kitxtree: [
    {
      tag: "table",
      attrs: {
        cellpadding: 0,
        cellspacing: 0,
        border: 0,
        width: "100%",
      },
      children: [
        {
          tag: "tr",
          children: [
            {
              tag: "td",
              attrs: {
                class: "kitx-flex",
              },
              children: [
                {
                  type: "kit-column",
                  attrs: {
                    class: "kitx-flex-12",
                  },
                  excludes: ["single-column", "double-column", "trible-column"],
                  children: "$default",
                  repeat: 2,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const KitTribleColumn = {
  type: "trible-column",
  alias: "Section",
  tag: "section",
  includes: [],
  editable: true,
  attrs: {
    class: "kitx-section",
  },
  style: {
    padding: "10px 0",
  },
  editing: {
    style: {
      outline: "1px dashed rgba(170,170,170,0.7)",
      outlineOffset: "-2px",
    },
  },
  kitxtree: [
    {
      tag: "table",
      attrs: {
        cellpadding: 0,
        cellspacing: 0,
        border: 0,
        width: "100%",
      },
      children: [
        {
          tag: "tr",
          children: [
            {
              tag: "td",
              attrs: {
                class: "kitx-flex",
              },
              children: "$default",
            },
          ],
        },
      ],
    },
  ],
};

export const EmailComponents = {
  KitBody,
  KitSection,
  KitColumn,
  KitSingleColumn,
  KitDoubleColumn,
  KitTribleColumn,
  KitRicheditor,
};
