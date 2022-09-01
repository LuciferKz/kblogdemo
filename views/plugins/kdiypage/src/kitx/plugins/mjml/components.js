/**
 *
 * type: "kitx-table",
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
 *   type: 'kitx-column',
 *   kitxtree: [{ type: 'div', children: [{ type: 'span', innerHTML: '123' }] }]
 * }
 *
 * inject: {} kitxtree内专用，提供内部子组件数据
 *
 * provide 接收父组件属性
 *
 * editable 编辑状态
 */

const Kitx = {
  type: "kitx-table",
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

const KitxBody = {
  type: "kitx-body",
  kitxtree: {
    tag: "section",
    ref: "container",
    style: {
      width: "100%",
      minHeight: "100%",
    },
    children: [
      {
        tag: "section",
        style: {
          margin: "0px auto",
          maxWidth: "600px",
          pointerEvents: "none",
        },
        slot: "default",
        // children: "$default",
      },
    ],
  },
};

const KitxSection = {
  type: "kitx-section",
  kitxtree: {
    tag: "section",
    ref: "container",
    style: {
      pointerEvents: "all",
      padding: "10px 0",
    },
    children: [
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
                slot: "default",
                // children: "$default",
              },
            ],
          },
        ],
      },
    ],
  },
};

const KitxColumn = {
  type: "kitx-column",
  kitxtree: {
    tag: "section",
    ref: "container",
    style: {
      pointerEvents: "all",
      verticalAlign: "top",
      fontSize: "0px",
      textAlign: "left",
      direction: "ltr",
      display: "inline-block",
      verticalAlign: "top",
      width: "100%",
    },
    attrs: {
      class: "kitx-flex-12",
    },
    children: [
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
            children: [
              {
                tag: "td",
                ref: "column",
                children: [
                  {
                    tag: "table",
                    ref: "inner",
                    attrs: {
                      width: "100%",
                      cellpadding: 0,
                      cellspacing: 0,
                      border: 0,
                    },
                    slot: "default",
                  },
                ],
              },
            ],
          },
        ],
        // children: "$default",
      },
    ],
  },
};

const KitxSingleColumn = {
  type: "single-column",
  kitstree: {
    type: "kitx-section",
    children: [
      {
        type: "kitx-column",
        children: [
          {
            type: "kitx-text",
            children: "Content 1",
          },
        ],
      },
    ],
  },
};

const KitxDoubleColumn = {
  type: "double-column",
  kitstree: {
    type: "kitx-section",
    children: [
      {
        type: "kitx-column",
        children: [
          {
            type: "kitx-text",
            children: "Content 1",
          },
        ],
      },
      {
        type: "kitx-column",
        children: [
          {
            type: "kitx-text",
            children: "Content 1",
          },
        ],
      },
    ],
  },
};

const KitxTribleColumn = {
  type: "trible-column",
  kitstree: {
    type: "kitx-section",
    children: [
      {
        type: "kitx-column",
        children: [
          {
            type: "kitx-text",
            children: "Content 1",
          },
        ],
      },
      {
        type: "kitx-column",
        children: [
          {
            type: "kitx-text",
            children: "Content 1",
          },
        ],
      },
      {
        type: "kitx-column",
        children: [
          {
            type: "kitx-text",
            children: "Content 1",
          },
        ],
      },
    ],
  },
};

const KitxText = {
  type: "kitx-text",
  kitxtree: {
    tag: "tr",
    ref: "container",
    style: {
      pointerEvents: "all",
      display: "table",
      width: "100%",
    },
    children: [
      {
        tag: "td",
        ref: "inner",
        style: {
          fontSize: "0px",
          wordBreak: "break-word",
          pointerEvents: "none",
        },
        children: [
          {
            tag: "div",
            ref: "text",
            attrs: {},
            style: {
              wordBreak: "break-word",
              pointerEvents: "none",
            },
            slot: "default",
          },
        ],
      },
    ],
  },
};

const KitxButton = {
  type: "kitx-button",
  kitxtree: {
    tag: "tr",
    ref: "container",
    style: {
      pointerEvents: "all",
      display: "table",
      width: "100%",
    },
    attrs: {
      align: "center",
    },
    children: [
      {
        tag: "td",
        ref: "td",
        style: {
          padding: "10px 25px",
          fontSize: "0px",
          wordBreak: "break-word",
          pointerEvents: "none",
        },
        attrs: {
          valign: "middle",
        },
        children: [
          {
            tag: "table",
            attrs: {
              border: 0,
              cellpadding: 0,
              cellspacing: 0,
            },
            style: {
              lineHeight: "100%",
              borderCollapse: "separate",
              pointerEvents: "none",
            },
            children: [
              {
                tag: "tr",
                style: {
                  pointerEvents: "none",
                },
                children: [
                  {
                    tag: "td",
                    style: {
                      pointerEvents: "none",
                    },
                    children: [
                      {
                        tag: "a",
                        ref: "button",
                        style: {
                          display: "inline-block",
                          pointerEvents: "none",
                        },
                        attrs: {
                          target: "_blank",
                          href: "https://",
                        },
                        children: "Button",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

const KitxImage = {
  type: "kitx-image",
  kitxtree: {
    tag: "tr",
    ref: "container",
    style: {
      pointerEvents: "all",
      display: "table",
      width: "100%",
    },
    attrs: {
      align: "center",
    },
    children: [
      {
        tag: "td",
        ref: "inner",
        style: {
          fontSize: "0px",
          wordBreak: "break-word",
          pointerEvents: "none",
        },
        attrs: {
          valign: "middle",
        },
        children: [
          {
            tag: "table",
            attrs: {
              cellpadding: 0,
              cellspacing: 0,
              border: 0,
            },
            style: {
              pointerEvents: "none",
            },
            children: [
              {
                tag: "tr",
                style: {
                  pointerEvents: "none",
                },
                children: [
                  {
                    tag: "td",
                    style: {
                      pointerEvents: "none",
                    },
                    children: [
                      {
                        tag: "a",
                        ref: "link",
                        attrs: {
                          href: "javascript:void(0)",
                        },
                        children: [
                          {
                            tag: "img",
                            ref: "image",
                            style: {
                              border: "0px",
                              display: "block",
                              outline: "none",
                              textDecoration: "none",
                              height: "auto",
                              width: "100%",
                              fontSize: "13px",
                              pointerEvents: "none",
                            },
                            attrs: {
                              height: "auto",
                              width: "Infinity",
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    //   },
    // ],
  },
};

const KitxDivider = {
  type: "kitx-divider",
  kitxtree: {
    tag: "tr",
    ref: "container",
    style: {
      pointerEvents: "all",
      display: "table",
      width: "100%",
    },
    children: [
      {
        tag: "td",
        ref: "td",
        style: {
          // padding: "10px 25px",
          fontSize: "0px",
          wordBreak: "break-word",
          pointerEvents: "none",
        },
        children: [
          {
            tag: "p",
            ref: "divider",
            attrs: {},
            style: {
              // borderTop: "4px solid rgb(0, 0, 0)",
              fontSize: "1px",
              margin: "0px auto",
              width: "100%",
              pointerEvents: "none",
            },
          },
        ],
      },
    ],
  },
};

const KitxSpacer = {
  type: "kitx-spacer",
  kitxtree: {
    tag: "tr",
    ref: "container",
    style: {
      pointerEvents: "all",
      display: "table",
      width: "100%",
      userSelect: "none",
    },
    attrs: {
      height: "20px",
    },
    children: [
      {
        tag: "td",
        ref: "inner",
        style: {
          fontSize: "0px",
          wordBreak: "break-word",
          pointerEvents: "none",
        },
        children: [
          {
            tag: "div",
            ref: "spacer",
            children: "&hairsp;",
          },
        ],
      },
    ],
  },
};

const KitxNavbar = {
  type: "kitx-navbar",
  kitxtree: {
    tag: "tr",
    ref: "container",
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
        children: [
          {
            tag: "div",
            attrs: {},
            style: {
              textAlign: "center",
              pointerEvents: "none",
              display: "flex",
              justifyContent: "center",
            },
            slot: "default",
            // children: "$default",
          },
        ],
      },
    ],
  },
};

const KitxNavbarLink = {
  type: "kitx-navbar-link",
  children: "Link 1",
  kitxtree: {
    tag: "a",
    ref: "container",
    slot: "default",
    style: {
      pointerEvents: "all",
    },
  },
};

const KitxSocial = {
  type: "kitx-social",
  kitxtree: {
    tag: "tr",
    ref: "container",
    style: {
      pointerEvents: "all",
    },
    children: [
      {
        tag: "td",
        ref: "inner",
        slot: "default",
        style: {
          fontSize: "0px",
          wordBreak: "break-word",
        },
      },
    ],
  },
};

// https://www.mailjet.com/images/theme/v1/icons/ico-social/twitter.png
const KitxSocialElement = {
  type: "kitx-social-element",
  attributes: {
    name: "facebook",
  },
  kitxtree: {
    tag: "table",
    ref: "container",
    style: {
      display: "inline-table",
      pointerEvents: "all",
    },
    attrs: {
      cellpadding: 0,
      cellspacing: 0,
      border: 0,
    },
    children: [
      {
        tag: "tr",
        children: [
          {
            tag: "td",
            ref: "inner",
            children: [
              {
                tag: "table",
                attrs: {
                  cellpadding: 0,
                  cellspacing: 0,
                  border: 0,
                },
                children: [
                  {
                    tag: "tr",
                    children: [
                      {
                        tag: "td",
                        ref: "innerIcon",
                        children: [
                          {
                            tag: "img",
                            ref: "icon",
                          },
                        ],
                      },
                      {
                        tag: "td",
                        ref: "innerLink",
                        children: [
                          {
                            tag: "a",
                            ref: "link",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

const KitxSimpleNavbar = {
  type: "kitx-simple-navbar",
  kitstree: {
    type: "kitx-navbar",
    children: [
      {
        type: "kitx-navbar-link",
        children: "Link 1",
      },
      {
        type: "kitx-navbar-link",
        children: "Link 2",
      },
      {
        type: "kitx-navbar-link",
        children: "Link 3",
      },
      {
        type: "kitx-navbar-link",
        children: "Link 4",
      },
    ],
  },
};

const KitxSimpleSocial = {
  type: "kitx-simple-social",
  kitstree: {
    type: "kitx-social",
    children: [
      {
        type: "kitx-social-element",
        attributes: {
          name: "facebook",
        },
      },
      {
        type: "kitx-social-element",
        attributes: {
          name: "google",
        },
      },
      {
        type: "kitx-social-element",
        attributes: {
          name: "twitter",
        },
      },
    ],
  },
};

export const EmailComponents = {
  KitxBody,
  KitxSection,
  KitxColumn,
  KitxText,
  KitxButton,
  KitxImage,
  KitxDivider,
  KitxSpacer,
  KitxNavbar,
  KitxNavbarLink,
  KitxSocial,
  KitxSocialElement,

  KitxSingleColumn,
  KitxDoubleColumn,
  KitxTribleColumn,
  KitxSimpleNavbar,
  KitxSimpleSocial,
};
