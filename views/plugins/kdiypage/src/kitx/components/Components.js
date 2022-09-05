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
    dynamic: {
      attrs: {
        class: "css-class",
      },
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
    dynamic: {
      attrs: {
        class: "css-class",
      },
    },
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
  attributes: {
    "css-class": "kitx-flex-12",
  },
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
    dynamic: {
      attrs: {
        class: "css-class",
      },
      style: {
        width: "width",
        backgroundColor: "background-color",
        border: "border",
        borderRadius: "border-radius",
        borderLeft: "border-left",
        borderTop: "border-top",
        borderRight: "border-right",
        borderBottom: "border-bottom",
        padding: "padding",
        paddingLeft: "padding-left",
        paddingTop: "padding-top",
        paddingRight: "padding-right",
        paddingBottom: "padding-bottom",
      },
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
                children: [
                  {
                    tag: "table",
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

const KitxText = {
  type: "kitx-text",
  children: "双击编辑文字...",
  kitxtree: {
    tag: "tr",
    ref: "container",
    style: {
      pointerEvents: "all",
      display: "table",
      width: "100%",
    },
    dynamic: {
      attrs: {
        class: "css-class",
      },
    },
    children: [
      {
        tag: "td",
        style: {
          fontSize: "0px",
          wordBreak: "break-word",
          pointerEvents: "none",
        },
        dynamic: {
          attrs: {
            align: "align",
          },
          style: {
            height: "height",
            padding: "padding",
            paddingBottom: "padding-bottom",
            paddingLeft: "padding-left",
            paddingRight: "padding-right",
            paddingTop: "padding-top",
            backgroundColor: "container-background-color",
          },
        },
        children: [
          {
            tag: "div",
            attrs: {},
            style: {
              wordBreak: "break-word",
              pointerEvents: "none",
            },
            dynamic: {
              style: {
                color: "color",
                fontSize: "font-size",
                fontStyle: "font-style",
                fontWeight: "font-weight",
                lineHeight: "line-height",
                letterSpacing: "letter-spacing",
                textDecoration: "text-decoration",
                textTransform: "text-transform",
                width: "width",
              },
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
    dynamic: {
      style: {
        backgroundColor: "container-background-color",
      },
      attrs: {
        class: "css-class",
      },
    },
    children: [
      {
        tag: "td",
        ref: "td",
        style: {
          fontSize: "0px",
          wordBreak: "break-word",
          pointerEvents: "none",
        },
        attrs: {
          valign: "middle",
        },
        dynamic: {
          style: {
            padding: "padding",
            paddingBottom: "padding-bottom",
            paddingLeft: "padding-left",
            paddingRight: "padding-right",
            paddingTop: "padding-top",
          },
          attrs: {
            align: "align",
          },
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
                        dynamic: {
                          style: {
                            backgroundColor: "background-color",
                            border: "border",
                            borderBottom: "border-bottom",
                            borderLeft: "border-left",
                            borderRadius: "border-radius",
                            borderRight: "border-right",
                            borderTop: "border-top",
                            color: "color",
                            fontFamily: "font-family",
                            fontSize: "font-size",
                            fontStyle: "font-style",
                            fontWeight: "font-weight",
                            height: "height",
                            letterSpacing: "letter-spacing",
                            lineHeight: "line-height",
                            textAlign: "text-align",
                            textDecoration: "text-decoration",
                            textTransform: "text-transform",
                            verticalAlign: "vertical-align",
                            width: "width",
                            padding: "inner-padding",
                          },
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
  attributes: {
    src: "https://via.placeholder.com/350x250/78c5d6/fff",
  },
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
    dynamic: {
      attrs: {
        class: "css-class",
      },
    },
    children: [
      {
        tag: "td",
        style: {
          fontSize: "0px",
          wordBreak: "break-word",
          pointerEvents: "none",
        },
        attrs: {
          valign: "middle",
        },
        dynamic: {
          style: {
            padding: "padding",
            paddingBottom: "padding-bottom",
            paddingLeft: "padding-left",
            paddingRight: "padding-right",
            paddingTop: "padding-top",
            backgroundColor: "container-background-color",
          },
          attrs: {
            align: "align",
          },
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
                        attrs: {
                          href: "javascript:void(0)",
                        },
                        dynamic: {
                          attrs: {
                            href: "href",
                            name: "name",
                            title: "title",
                          },
                        },
                        children: [
                          {
                            tag: "img",
                            style: {
                              display: "block",
                              outline: "none",
                              textDecoration: "none",
                              height: "auto",
                              width: "100%",
                              fontSize: "13px",
                              pointerEvents: "none",
                            },
                            dynamic: {
                              style: {
                                border: "border",
                                borderLeft: "border-left",
                                borderTop: "border-top",
                                borderRight: "border-right",
                                borderBottom: "border-bottom",
                              },
                              attrs: {
                                width: "width",
                                height: "auto",
                                src: "src",
                                srcset: "srcset",
                                alt: "alt",
                              },
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
    dynamic: {
      attrs: {
        class: "css-class",
      },
      style: {
        backgroundColor: "container-background-color",
      },
    },
    children: [
      {
        tag: "td",
        style: {
          fontSize: "0px",
          wordBreak: "break-word",
          pointerEvents: "none",
        },
        dynamic: {
          style: {
            padding: "padding",
            paddingBottom: "padding-bottom",
            paddingLeft: "padding-left",
            paddingRight: "padding-right",
            paddingTop: "padding-top",
          },
        },
        children: [
          {
            tag: "p",
            attrs: {},
            style: {
              // borderTop: "4px solid rgb(0, 0, 0)",
              fontSize: "1px",
              margin: "0px auto",
              width: "100%",
              pointerEvents: "none",
            },
            dynamic: {
              style: {
                width: "width",
                borderColor: "border-color",
                borderWidth: "border-width",
                borderTopStyle: "border-style",
              },
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
    dynamic: {
      attrs: {
        class: "css-class",
      },
    },
    children: [
      {
        tag: "td",
        style: {
          fontSize: "0px",
          wordBreak: "break-word",
          pointerEvents: "none",
        },
        dynamic: {
          style: {
            backgroundColor: '"container-background-color"',
          },
          attrs: {
            align: "align",
          },
        },
        children: [
          {
            tag: "div",
            dynamic: {
              style: {
                height: "height",
                padding: "padding",
                paddingBottom: "padding-bottom",
                paddingLeft: "padding-left",
                paddingRight: "padding-right",
                paddingTop: "padding-top",
              },
            },
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
    dynamic: {
      attrs: {
        class: "css-class",
      },
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
    dynamic: {
      style: {
        color: "color",
        fontFamily: "font-family",
        fontSize: "font-size",
        fontStyle: "font-style",
        fontWeight: "font-weight",
        lineHeight: "line-height",
        letterSpacing: "letter-spacing",
        textDecoration: "ctext-decorationolor",
        textTransform: "text-transform",
        width: "width",
        padding: "padding",
        paddingBottom: "padding-bottom",
        paddingLeft: "padding-left",
        paddingRight: "padding-right",
        paddingTop: "padding-top",
      },
      attrs: {
        class: "css-class",
        target: "target",
        rel: "rel",
        href: "href",
      },
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
    dynamic: {
      attrs: {
        class: "css-class",
      },
    },
    children: [
      {
        tag: "td",
        slot: "default",
        style: {
          fontSize: "0px",
          wordBreak: "break-word",
        },
        dynamic: {
          style: {
            padding: "padding",
            paddingBottom: "padding-bottom",
            paddingLeft: "padding-left",
            paddingRight: "padding-right",
            paddingTop: "padding-top",
            backgroundColor: "container-background-color",
          },
          attrs: {
            align: "align",
          },
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
    dynamic: {
      class: "css-class",
    },
    children: [
      {
        tag: "tr",
        children: [
          {
            tag: "td",
            ref: "inner",
            dynamic: {
              style: {
                padding: "padding",
                paddingBottom: "padding-bottom",
                paddingLeft: "padding-bottom",
                paddingRight: "padding-bottom",
                paddingTop: "padding-bottom",
              },
            },
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
                        dynamic: {
                          style: {
                            backgroundColor: "background-color",
                            borderRadius: "border-radius",
                          },
                        },
                        children: [
                          {
                            tag: "img",
                            ref: "icon",
                            dynamic: {
                              style: {
                                borderRadius: "border-radius",
                              },
                              attrs: {
                                width: "icon-size",
                                src: "src",
                              },
                            },
                          },
                        ],
                      },
                      {
                        tag: "td",
                        children: [
                          {
                            tag: "a",
                            ref: "link",
                            dynamic: {
                              style: {
                                color: "color",
                                fontFamily: "font-family",
                                fontSize: "font-size",
                                fontStyle: "font-style",
                                fontWeight: "font-weight",
                                lineHeight: "line-height",
                                letterSpacing: "letter-spacing",
                                textDecoration: "text-decoration",
                                textTransform: "text-transform",
                                width: "width",
                              },
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
  },
};

export default {
  "kitx-body": KitxBody,
  "kitx-section": KitxSection,
  "kitx-column": KitxColumn,
  "kitx-text": KitxText,
  "kitx-button": KitxButton,
  "kitx-divider": KitxDivider,
  "kitx-image": KitxImage,
  "kitx-spacer": KitxSpacer,
  "kitx-navbar": KitxNavbar,
  "kitx-navbar-link": KitxNavbarLink,
  "kitx-social": KitxSocial,
  "kitx-social-element": KitxSocialElement,
};
