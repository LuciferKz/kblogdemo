<template>
  <el-container class="customer-selector flex-column">
    <div class="search-form" v-if="model">
      <el-row>
        <el-col :span="20">
          <quick-form :model="model" :layout="formLayout" labelWidth="120px" ref="form"></quick-form>
        </el-col>
        <el-col :span="4" align="right">
          <el-button class="search__button" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="main-content flex-box">
      <div class="main-content__container">
        <div class="main-content__table">
          <el-table ref="table" :data="tableData" :row-key="rowKey" @row-click="handleRowClick" @select="handleSelect" @select-all="handleSelectAll">
            <el-table-column v-if="multiselect" type="selection" width="55"></el-table-column>
            <el-table-column v-for="cfg in tableConfig" :key="cfg.prop" :label="cfg.label" :width="cfg.width">
              <template slot-scope="scope">
                <div v-if="cfg.render" v-html="cfg.render(scope)"></div>
                <div v-else>{{ scope.row[cfg.prop] }}</div>
              </template>
            </el-table-column>
            <el-table-column v-if="!multiselect" label="操作">
              <template slot-scope="scope">
                <el-button v-if="!selection.length || scope.row[rowKey] !== selection[0][rowKey]" @click.stop="handleSelectRow(scope.row)">选择</el-button>
                <span v-else class="active__button">已选</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="table-pagination" v-if="pagination.total > 0">
          <el-pagination
            :page-sizes="[10, 20, 30, 40]"
            :total="pagination.total"
            :current-page="pagination.current"
            :page-size="pagination.limit"
            @current-change="handleCurrentChange"
            @size-change="handlePageSizeChange"
            layout="total, sizes, prev, pager, next, jumper"
            ref="pagination">
          </el-pagination>
        </div>
      </div>
      <div class="selection__container" v-if="multiselect">
        <ul>
          <li v-for="(item, index) in selection" :key="'selection' + item.id">{{ item[label] }}<i class="remove__button el-icon-close" @click="handleRemoveRow(item, index)"></i></li>
        </ul>
      </div>
    </div>
  </el-container>
</template>

<script>
import api from './api';
import { ztreeTransfer } from '@/utils';
import dicts from '@/utils/dicts';
import quickForm from "@/components/quickForm";
import config from './config';
import _ from '@/utils/utils';

export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    // type product | coupon | spec 默认 product
    type: {
      type: String,
      default: 'product',
    },
    filter: {
      type: Object,
      default: () => ({}),
    },
    multiselect: {
      type: Boolean,
      default: true,
    }
  },
  components: { quickForm },
  data () {
    const cfg = config[this.type];
    return {
      formLayout : { xs : 24, sm : 24, md : 10, lg : 10, xl : 10 },
      config: cfg,
      model: cfg.form,
      tableConfig: cfg.table,
      searchForm: cfg.searchForm,
      tableData: [],
      selection: [],
      categories: [],
      label: cfg.label,
      rowKey: 'id',
      pagination: {
        total: 0,
        limit: 10,
        current: 1,
      }
    }
  },
  methods: {
    clear () {
      this.$refs.table.clearSelection();
    },
    remove (data) {
      this.handleRemoveRow(data);
    },
    getSelection () {
      this.$emit('input', this.selection);
      return this.selection;
    },

    handleQuery () {
      const limit = this.pagination.limit;
      const offset = limit * (this.pagination.current  - 1);
      return dicts[this.config.query]({ ...this.filter, ...this.searchForm, limit, offset })
      .then(res => {
        this.tableData = res.data;
        this.pagination.total = res.total;
      })
    },
    handleSearch () {
      const selection = this.selection;
      this.searchForm = this.$refs.form.getFormData();
      this.pagination.current = 1;
      this.handleQuery().then(() => {
        this.$nextTick(() => {
          this.selection = selection;
          this.handleSelectDefault(selection);
        })
      })
    },
    handleQueryCategory () {
      return dicts
      .getCategories()
      .then(categories => {
        this.model.categoryId.data = categories;
      })
    },
    handleQueryCouponsDicts () {
      return dicts
      .getCouponsDicts()
      .then(result => {
        this.model.couponType.options = result.social_coupon_coupon_type;
      })
    },
    handleSelectRow (row) {
      this.selection = [row];
    },
    handleRowClick (row) {
      this.handleToggleRowSelection(row);
    },
    handleSelect (rows, row) {
      this.handleToggleRowSelection(row);
    },
    handleSelectAll (rows) {
      let selected = false;
      const mapping = {};
      if (rows.length) {
        this.selection.forEach(d => { mapping[d.id] = d; });
        rows = rows.filter(r => !mapping[r.id]);
        selected = true;
      } else {
        this.tableData.forEach(d => { mapping[d.id] = d; });
        rows = this.selection.filter(r => mapping[r.id]);
      }
      rows.forEach(row => {
        this.handleToggleRowSelection(row, selected);
      })
    },
    handleToggleRowSelection (row, selected) {
      if (!this.multiselect) return false;
      const index = this.selection.findIndex(item => item.id === row.id);
      if (index > -1 && !selected) {
        this.selection.splice(index, 1);
        selected = false;
      } else {
        this.selection.push(row);
        selected = true;
      }
      this.$refs.table.toggleRowSelection(row, selected);
    },
    handleRemoveRow (row, index) {
      const tableData = this.tableData || [];
      const _row = tableData.find(d => d.id === row.id);
      this.$refs.table.toggleRowSelection(_row || row, false);
      this.selection.splice(index, 1);
    },
    handleSelectDefault (data, cb) {
      if (!this.tableData || !this.tableData.length) return false;
      const d = {};
      data.forEach(item => {
        if (item) {
          d[item[this.rowKey]] = 1;
        }
      });
      this.tableData.forEach((row) => {
        if (d[row[this.rowKey]]) {
          this.$refs.table.toggleRowSelection(row, true);
        }
      })
    },
    handleCurrentChange (current) {
      const selection = this.selection;
      this.pagination.current = current;
      this.handleQuery().then(() => {
        this.$nextTick(() => {
          this.selection = selection;
          this.handleSelectDefault(selection);
        })
      });
    },

    handlePageSizeChange (size) {
      this.pagination.limit = size;
      this.handleQuery().then(() => {
        this.$nextTick(() => {
          this.selection = selection;
          this.handleSelectDefault(selection);
        })
      });
    },
  },
  mounted () {
    this.handleQuery().then(() => {
      this.selection = this.value;
      this.selection.forEach(selected => {
        let title = selected.title || selected.name;
        selected.title = title;
        selected.name = title;
      })
      this.handleSelectDefault(this.value);
    });
    (this.type === 'product'|| this.type === 'gift') && this.handleQueryCategory();
    this.type === 'coupon' && this.handleQueryCouponsDicts();
  },
  beforeDestroy () {
    for (let key in this.model) {
      this.model[key].value = '';
    }
  }
}
</script>

<style>
  @import url('./style');
</style>

<style lang="css" scoped>
  .active__button {
    display: inline-block;
    padding: 0 15px;
    background-color: #ed4014;
    border-color: #ed4014;
    border-radius: 3px;
    line-height: 30px;
    color: #FFF;
  }
  .main-content__table {
    overflow: auto;
    height: 500px;
  }
</style>