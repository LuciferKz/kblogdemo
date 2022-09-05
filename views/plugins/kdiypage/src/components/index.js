const KitxBody = {
  includes: ["kitx-single-column", "kitx-double-column", "kitx-trible-column"],
};
const KitxColumn = {
  excludes: ["kitx-single-column", "kitx-double-column", "kitx-trible-column"],
};
const KitxSimpleNavbar = {
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

const KitxSingleColumn = {
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

const KitxImage = {
  attributes: {
    // src: "https://via.placeholder.com/350x250/78c5d6/fff",
  },
};

// 此处export的组件自定义配置中，
// 如果是修改已有组件的配置，key需要对应组件type，必须保持一致
// 自定义组件类型只支持对现有内置组件的组装
// 组件type参考内置组件表
export default {
  "kitx-body": KitxBody,
  "kitx-column": KitxColumn,
  "kitx-single-column": KitxSingleColumn,
  "kitx-double-column": KitxDoubleColumn,
  "kitx-trible-column": KitxTribleColumn,
  "kitx-simple-navbar": KitxSimpleNavbar,
  "kitx-simple-social": KitxSimpleSocial,
  "kitx-image": KitxImage,
};
