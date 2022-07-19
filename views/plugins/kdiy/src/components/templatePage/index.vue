<template>
  <div
    class="main"
    :style="{ height: container ? container.height : '100%' }"
  >
    <div class="decorate-content">
      <!-- 装饰部件列表栏 -->
      <decorate-content-left
        v-if="enableSetting.decorateContentLeft"
        ref="decorateContentLeft"
      ></decorate-content-left>
      <!-- ************* -->
      <div
        class="decorate-content-center"
        @click="handleCancelSelect"
      >
        <div class="diy-container">
          <div class="diy-phone">
            <div
              class="phone-body"
              :style="diyPageStyle"
              v-if="!loading"
            >
              <draggable
                v-model="widgets"
                v-bind="dragOptions"
              >
                <!-- element="div" -->
                <transition-group type="transition">
                  <!-- tag="div" -->
                  <div
                    class="bodyitem"
                    :class="{'drag-active': item.selected }"
                    v-for="(item, index) in widgets"
                    :key="'bodyItem' + index"
                    @click.stop="handleSelectItem(item, index)"
                  >
                    <div
                      v-if="!enableSetting.disableDelete"
                      class="body-delete"
                      :class="{ 'body-delete-show': item.selected }"
                      @click.stop="handleDeleteItem(item)"
                    >
                      <div class="icon-deletespe">×</div>
                    </div>
                    <div
                      v-show="item.showConfirm"
                      class="confirm-delete-box"
                    >
                      <div class="confirmword">确定删除吗</div>
                      <div class="btn-group">
                        <el-button
                          type="primary"
                          ghost
                          size="mini"
                          @click.stop="handleConfirmDelete(index)"
                        >确定</el-button>
                        <el-button
                          type="default"
                          ghost
                          size="mini"
                          @click.stop="handleCancelDelete()"
                        >取消</el-button>
                      </div>
                    </div>
                    <!-- diy-item 定制组件 -->
                    <diy-item
                      :type="item.components"
                      :options="item.model"
                    ></diy-item>
                  </div>
                </transition-group>
              </draggable>
            </div>
          </div>
        </div>
        <div
          class="save-action"
          v-if="!enableSetting.disableButtons"
        >
          <el-button
            class="btn comfrimBtn"
            type="primary"
            @click.stop="handleSaveTemplate"
          >保存</el-button>
          <el-button
            class="btn"
            @click="handleCancel"
          >取消</el-button>
        </div>
      </div>
      <el-container
        class="decorate-content-right"
        v-loading="loading"
      >
        <!-- diy-item-config 定制组件配置 -->
        <diy-item-config
          v-if="!loading && currentItem"
          :type="currentItem.components"
          :default="enableSetting.disableDefaultConfig ? null : defaultConfig"
          :editable="editable"
          :model="currentItem.model"
        ></diy-item-config>
      </el-container>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";

import DiyItem from "./components";
import DiyItemConfig from "./componentConfig";

// import Common from "@/api/request/common";

import DecorateContentLeft from "./frame/decorateContentLeft";

export default {
  components: { draggable, DecorateContentLeft, DiyItem, DiyItemConfig },
  props: {
    value: Object,
    enableSetting: {
      type: Object,
      default: () => ({
        decorateContentLeft: 1,
        decorateContentCenter: 1,
        decorateContentRight: 1,
        disableSelectEvent: 0,
        disableDefaultConfig: 0,
        disableButtons: 0,
        disableDelete: 0,
        disableDrag: 0,
      }),
    },
    container: Object,
    defaultConfig: {
      type: String,
      default: "default",
    },
  },
  data() {
    const basic = {
      config: {},
      model: {
        mbtype: "1",
        pageName: "",
        pageTitle: "",
        backColor: "#fff",
        backImg: "",
        tabBackColor: "#000",
        tabColor: "white",
      },
    };
    return {
      editable: true,
      collists: [], // 可用部件列表
      widgets: [], // 所有部件
      basic, // 基础表单
      currentItem: null,
      loading: false,
    };
  },

  provide() {
    return {
      diypage: this,
    };
  },

  created() {
    this.currentItem = this.basic;
    // console.log('created', this.currentItem, this.currentItem.model);
  },

  mounted() {
    this.handleInit();
  },

  activated() {
    this.handleInit();
  },

  methods: {
    // 添加/删除
    handleAddItem(item) {
      this.widgets.push(item);
    },
    handleDeleteItem(item) {
      this.$set(item, "showConfirm", true);
    },

    // 选中部件
    handleSelectItem(item) {
      if (this.enableSetting.disableSelectEvent) return false;
      this.loading = true;
      // console.log('select');
      this.handleCancelDelete();
      this.currentItem.selected = false;
      item.selected = true;
      this.currentItem = item;
      this.$nextTick(() => {
        this.loading = false;
      });
    },
    // 取消选中
    handleCancelSelect() {
      if (this.enableSetting.disableSelectEvent) return false;
      // console.log('cancel select');
      this.handleCancelDelete();
      this.currentItem.selected = false;
      this.currentItem = this.basic;
    },

    handleConfirmDelete(index) {
      this.currentItem.limit.count--;
      this.widgets.splice(index, 1);
      this.handleCancelSelect();
    },

    handleCancelDelete() {
      this.currentItem.showConfirm = false;
    },

    handleInit() {
      this.template = this.$route.query.template;
      console.log(this.value);
      if (!this.value || !this.value.currentTemplate) return false;
      this.handleInitData(this.value);
    },
    handleInitData(data) {
      // console.log('handleInitData', data);
      this.loading = true;

      this.widgets = [];

      const widgets = data.currentTemplate;

      widgets.forEach((widget) => {
        if (this.$refs.decorateContentLeft) {
          this.$refs.decorateContentLeft.handleAddItem(
            widget.components,
            widget
          );
        } else {
          widget.selected = false;
          widget.showConfirm = false;
          this.widgets.push(widget);
        }
        if (widget.defaultSelect) {
          widget.selected = true;
          this.currentItem = widget;
        }
      });

      if (data.basicOption) this.basic.model = data.basicOption;

      this.$nextTick(() => {
        this.loading = false;
      });
    },

    handleSaveTemplate() {
      const data = {
        currentTemplate: this.widgets,
      };

      if (!this.enableSetting.disableDefaultConfig)
        data.basicOption = this.basic.model;

      this.$emit("save", data);
    },

    handleCancel() {
      this.$emit("cancel");
    },
  },

  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "widgets",
        disabled: !!this.enableSetting.disableDrag,
        ghostClass: "ghost",
        filter: ".undraggable",
      };
    },

    diyPageStyle() {
      const model = this.basic.model;
      const background = `${
        model.backImg ? "url(" + model.backImg + ") repeat-y" : model.backColor
      }`;
      return { background, backgroundSize: "cover" };
    },
  },

  watch: {
    value(newVal) {
      if (newVal.currentTemplate) {
        this.handleInitData(newVal);
      }
    },
  },
};
</script>

<style lang="less">
@import "./index.less";
</style>

<style>
.pannelcontent {
  box-sizing: border-box;
  padding: 20px 10px 20px 20px;
}
.pannel-title {
  height: 36px;
  border-bottom: 1px solid #ccc;
  text-align: center;
}
.pannel-title__label {
  display: inline-block;
  padding: 0 20px;
  line-height: 34px;
  font-size: 14px;
  color: #0083b0;
  border-bottom: 2px solid #0083b0;
}
</style>