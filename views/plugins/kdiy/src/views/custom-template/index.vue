<template>
  <div>
    <template-page
      v-if="!loading"
      v-model="data"
      @save="handleSave"
      @cancel="handleCancel"
    ></template-page>
  </div>
</template>

<script>
import templatePage from "@/components/templatePage";
import api from "../../api";

export default {
  name: "custom-template",

  components: { templatePage },

  data() {
    return {
      data: {},
      loading: false,
    };
  },

  mounted() {
    this.handleInit();
  },

  methods: {
    handleInit() {
      const id = this.$route.params.id;
      if (!id) return false;
      this.id = id;
      this.handleQuery(id);
    },

    handleQuery(id) {
      this.loading = true;
      return this.API_QUERY(id).then((res) => {
        if (res.result.data) {
          this.data = JSON.parse(res.result.data);
        }
        this.detail = res.result;
        this.loading = false;
      });
    },

    handleValidate(model) {
      let message = null;

      if (!model.title || !model.name) {
        message = "请填写页面名称和标题";
      }

      model.data.currentTemplate.some((widget) => {
        let type = widget.components;
        if (type === "member" && !widget.model.member_text) {
          message = "请填写个人中心标题名称";
        }
        // if (message) this.handleSelectItem(widget);
        return !message;
      });

      if (message) this.$message.warning(message);
      return message;
    },

    handleSave(data) {
      const id = this.$route.params.id; // id

      const type = this.$route.query.type; // 类型

      const action = this.$route.query.action; // 操作目标

      const detail = this.detail; // 页面详情

      const basic = data.basicOption;

      const model = {
        title: basic.pageTitle,
        name: basic.pageName,
        status: 0,
        data,
        type,
      };

      if (this.handleValidate(model)) return false;

      if (detail) {
        model.id = detail.id;
        model.status = detail.status;
        model.type = detail.type;
      }

      data.currentTemplate.forEach((widget) => {
        delete widget.selected;
        delete widget.showConfirm;
        delete widget.limit;
      });

      model.data = JSON.stringify(model.data);

      if (action === "copy") delete model.id;

      this.API_SAVE(model).then((res) => {
        if (res.success) {
          this.handleCancel();
        }
      });
    },

    handleCancel() {
      this.$router.back();
    },

    async API_QUERY(id) {
      let res = await this.$requestEC({ ...api.detail, params: { id } });
      return res;
    },

    async API_SAVE(data) {
      let res = await this.$requestEC({
        ...api[data.id ? "update" : "save"],
        data,
      });
      return res;
    },
  },
};
</script>

<style lang="css">
</style>