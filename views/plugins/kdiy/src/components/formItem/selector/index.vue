<template>
  <div class="selector">
    <!-- <div v-if="buttonConfig.type === 'rect'" class="add__button--rect" :class="{ disabled: readonly }" :style="buttonStyle" @click="handleClick(type, label)" v-show="isShowButton"><i class="el-icon-plus"></i></div> -->
    <el-button v-if="buttonConfig.type !== 'rect'" class="add__button" :disabled="readonly" type="primary" icon="el-icon-plus" @click="handleClick(type, label)" v-show="isShowButton">{{ label }}</el-button>
    <div class="file-list">
      <ul v-if="type === 'image' || type === 'video'">
        <!-- tag="div" -->
        <li class="file-list__button undraggable" key="button-rect" v-if="buttonConfig.type === 'rect'" v-show="isShowButton">
          <div class="add__button--rect" :class="{ disabled: readonly }" :style="buttonStyle" @click="handleClick(type, label)"><i class="el-icon-plus"></i></div>
        </li>
        <draggable v-model="data" v-bind="dragOptions">
            <!-- element="div" -->
            <transition-group type="transition">
              <li class="file-list__item" v-for="(src, index) in data" :key="index" :style="fileStyle">
                <img v-if="type === 'image'" :src="src" alt="" @load="handleFileLoad">
                <video v-else :src="src" controls></video>
                <i class="remove__button el-icon-error" @click="handleRemove(index)"></i>
              </li>
            </transition-group>
        </draggable>
      </ul>
      <!-- (type === 'product' || type === 'coupon' || type === 'gift') -->
      <div v-else-if="~['product', 'coupon', 'gift'].indexOf(type) && data && data.length">
        <el-table v-if="displayType === 'table' && !refresh" class="main-content__table" ref="table" :data="data" row-key="id">
          <el-table-column v-for="cfg in tableConfig" :key="cfg.prop" :label="cfg.label" :width="cfg.width">
            <template slot-scope="scope">
              <div v-if="cfg.render"><custom-component :render="cfg.render" :scope="scope"></custom-component></div>
              <div v-else>{{ scope.row[cfg.prop] }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="handleRemove(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-else-if="displayType === 'list'" class="product-list">
          <dl v-for="(item, index) in data" :key="index" class="product-list__dl">
            <dt><img :src="item.firstImage" width="100" height="100" /></dt>
            <dd>
              <p>商品名称: {{ item.title }}</p>
              <p>商品价格: {{ item.presentPrice }}</p>
              <p>库存: {{ item.virtualStock }}</p>
              <i class="remove__button el-icon-error" @click="handleRemove(index)"></i>
            </dd>
          </dl>
        </div>
      </div>
    </div>
    <el-dialog :title="'请' + dialog.label" :visible.sync="dialog.visible" top="80px" width="1000px" :before-close="handleClose" :appendToBody="appendToBody">
      <div v-if="dialog.visible">
        <image-selector v-if="type === 'image' || type === 'video'" v-model="dialog.value" ref="selector" v-bind="selectorProps"></image-selector>
        <custom-selector v-else ref="selector" v-model="dialog.value" v-bind="selectorProps"></custom-selector>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <div v-if="readonly" class="cover"></div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import imageSelector from '@/components/imageSelector';
import customSelector from '@/components/customSelector';
import { createElement } from '@/utils';
import config from './config';

const customComponent = createElement('customComponent');

export default {
  components: { imageSelector, customSelector, customComponent, draggable },
  props: {
    value: [Array, Object, String], // 传入String 返回选中图片地址；传入Object 返回选中文件对象；
    type: {
      type: String,
      default: 'image', // image video product coupon gift
    },
    label: {
      default: '选择图片',
    },
    multiselect: {
      type: Boolean,
      default: true,
    },
    limit: {
      type: Number,
      default: 10000,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    appendToBody: {
      type: Boolean,
      default: true,
    },
    displayType: {
      type: String,
      default: 'table'
    },
    fileConfig: {
      type: Object,
      default: () => ({}),
    },
    buttonConfig: {
      type: Object,
      default: () => ({
        type: 'button', // 按钮类型
        style: {}, // 按钮样式
      })
    },
    filter: {
      type: Object,
      default: () => ({}),
    },
    skuProps: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    const getConfig = config[this.type];
    const cfg = getConfig ? getConfig(this) : {};
    return {
      // data: this.value,
      // readonly: this.disabled,
      // isShowButton: true, // 多选情况下根据limit常显，单选根据选择数量。
      tableConfig: cfg.columns || [],
      currentRow: null,
      selection: [],
      dialog: {
        visible: false,
        label: this.label,
        value: [],
      },
      refresh: false,
      selectorProps: {
        type: this.type,
        multiselect: true,
        filter: {},
      },
      specMap: {},
    }
  },
  computed: {
    data: {
      get () {
        /**
         * 接收value，不管多选单选，一律调整成数组结构，方便组件内流转
         */
        const value = this.value;
        console.log(value, value.length);
        const data = value instanceof Array ? value : (value ? [value] : []);
        return data;
      },
      set (v) {
        /**
         * 多选情况下，无条件输出数组
         * 单选情况下，根据初试传入类型返回
         */
        let returnValue = this.multiselect ? v : this.initType !== 'Array' ? (v[0] || '') : v;
        this.$emit('input', returnValue);
      }
    },
    readonly () {
      return this.disabled;
    },
    isShowButton () {
      return ((this.type === 'image' || this.type === 'video') && !this.multiselect) ? !this.data.length : (this.limit > this.data.length);
    },
    fileStyle () {
      return (this.buttonConfig.type === 'rect' ? this.buttonConfig.style : this.fileConfig.style) || {};
    },
    buttonStyle () {
      const buttonStyle = this.buttonConfig.style || {};
      return {
        width: buttonStyle.width || 40 + 'px',
        height: buttonStyle.height || 40 + 'px',
        lineHeight: buttonStyle.height || 40 + 'px',
        fontSize: buttonStyle.iconSize || 14 + 'px',
      }
    },
    dragOptions () {
      return {
        animation: 200,
        group: "data",
        filter: '.undraggable'
      };
    },
  },
  
  methods: {
    handleClick (type, label, row) {
      if (this.readonly) return false;
      if (type === 'spec') {
        // 规格
        this.currentRow = row;
        this.dialog.value = Object.assign([], row.child);
        this.selectorProps = Object.assign({}, { type, filter: { goodsId: row.id } }, this.skuProps)
      } else {
        if (type === 'product' && this.displayType === 'table') {
          this.specMap = {}
          this.data.forEach((spu) => {
            this.specMap[spu.id] = spu.child
          })
          console.log(this.specMap);
        }
        this.dialog.value = Object.assign([], this.data);
        this.selectorProps = { type, multiselect: this.multiselect, filter: this.filter }
      }
      this.dialog.label = label;
      this.dialog.visible = true;
    },
    handleConfirm () {
      const selection = this.$refs.selector.getSelection();
      const data = (this.type === 'image' || this.type === 'video') ? selection.data : selection;
      this.refresh = true;

      if (this.selectorProps.type !== 'spec') {
        let newData = [];
        if (this.displayType === 'table' && (this.type === 'product' || this.type === 'gift')) {
            newData = data.slice(0, this.limit).map(item => {
            let skus = this.specMap[item.id] || [];
            return {
              id: item.id,
              name: item.title,
              firstImage: item.firstImage,
              child: skus,
              specsNames: skus.map(item => item.name).join('，')
            }
          });
        } else {
          newData = data.slice(0, this.limit);
        }
        this.data = newData;
      } else {
        const specNames = data.map(item => item.title).join('，');
        this.currentRow.child = data.map(item => ({ id: item.id, name: item.title }));
        this.$set(this.currentRow, 'specsNames', specNames)
      }

      this.$nextTick(() => {
        console.log(JSON.stringify(this.data), this.data.length);
        this.refresh = false;
      })
      this.handleClose();
    },
    handleClose () {
      this.dialog.visible = false;
    },
    handleFileLoad (e) {
      // const file = e.target;
      // if (file.width > file.height) {
      //   file.style.width = '100px';
      // } else {
      //   file.style.height = '100px';
      // }
    },
    handleRemove (idx, item) {
      this.data.splice(idx, 1);
      this.data = this.data;
    },

    handleInitData (data) {
      if (!data || !data.length) return false;

      if ((this.type === 'product' || this.type === 'gift') && this.displayType === 'table') {
        this.$requestEC({
          url: '/goods/sku/crud/relatedGoodsList',
          method: 'POST',
          data: data,
        }).then(res => {
          const tableData = res.result || [];
          tableData.forEach(item => {
            if (!item.child) return false;
            item.specsNames = item.child.map(d => d.name).join(',');
          });
          this.data = tableData;
        })
      } else if (this.type === 'coupon') {
        this.$requestEC({
          url: '/coupon/crud/getCouponByIds',
          method: 'POST',
          data: {
            ids: data
          },
        }).then(res => {
          this.data = res.result || [];
        })
      }
    }
  },
  mounted () {
    this.initType = Object.prototype.toString.call(this.value).split(' ')[1].slice(0, -1);
    this.handleInitData(this.value);
  }
}
</script>

<style scoped>
  .selector {
    position: relative;
  }
  .add__button {
    margin-bottom: 10px;
  }

  .add__button--rect {
    box-sizing: border-box;
    border: 1px solid #CCC;
    /* margin: 5px; */
    text-align: center;
    cursor: pointer;
  }

  .add__button--rect.disabled {
    cursor: not-allowed;
  }
  
  .file-list {
    /* margin-top: 10px; */
    text-align: left;
  }

  .file-list__button {
    display: inline-block;
    margin: 5px;
  }

  .file-list__item {
    position: relative;
    display: inline-block;
    width: 100px;
    height: 100px;
    border: 1px solid #CCC;
    margin: 5px;
    line-height: 100px;
    vertical-align: top;
    text-align: center;
  }
  
  .file-list__item .remove__button,
  .product-list__dl .remove__button {
    display: none;
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 20px;
    cursor: pointer;
  }
  
  .file-list__item:hover .remove__button,
  .product-list__dl:hover .remove__button {
    display: block;
  }

  .file-list__item img,
  .file-list__item video {
    display: block;
    width: 100%;
    height: 100%;
  }

  .main-content__table {
    width: 600px;
  }

  .product-list__dl {
    position: relative;
    display: flex;
    margin-bottom: 10px;
    padding: 5px;
    border: 1px solid #DDD;
  }

  .product-list__dl dt {
    overflow: hidden;
    width: 110px;
    height: 100px;
  }

  .product-list__dl dd {
    flex: 1;
    font-size: 12px;
  }

  .specs-label {
    display: inline-block;
    padding: 5px;
    border: 1px solid #EEE;
    border-radius: 3px;
    cursor: pointer;
    background-color: #FFF;
  }
  .cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 120%;
    cursor: not-allowed;
  }

  .break-word {
    word-break: break-all;
    word-wrap: break-word;
    white-space: normal;
    line-height: 1.5;
  }
</style>