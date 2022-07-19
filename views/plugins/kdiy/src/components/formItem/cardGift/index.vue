<template>
  <div class="selector">
    <el-button  class="add__button" :disabled="readonly" type="primary" icon="el-icon-plus" @click="handleClick(type, label)" >{{ label }}</el-button>
    <div class="file-list">
      <ul>
        <draggable v-model="data" v-bind="dragOptions">
            <!-- element="div" -->
            <transition-group type="transition">
              <li class="file-list__item" v-for="(item, index) in data" :key="index" >
                <img v-if="type === 'image'" :src="item.imageUrl" alt="" @load="handleFileLoad">
                <div class="file-list_desc">
                  <el-input type="text" value="卡片名称" disabled></el-input>
                  <el-input type="text" v-model="item.name" maxlength="6"></el-input>
                  <p>最多输入不超过6个字符</p>
                </div>
                <i class="remove__button el-icon-error" @click="handleRemove(index)"></i>
              </li>
            </transition-group>
        </draggable>
      </ul>
    </div>
    <el-dialog :title="'请' + dialog.label" :visible.sync="dialog.visible" top="80px" width="1000px" :before-close="handleClose" :appendToBody="appendToBody">
      <div v-if="dialog.visible">
        <image-selector v-model="dialog.value" ref="selector" v-bind="selectorProps"></image-selector>
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
import { createElement } from '@/utils';

export default {
  components: { 
    imageSelector, 
    draggable 
  },
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
    filter: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      selection: [],
      dialog: {
        visible: false,
        label: this.label,
        value: [],
      },
      refresh: false,
      selectorProps: {
        type: this.type,
        multiselect: false,
        filter: {},
      },
    }
  },
  computed: {
    data: {
      get () {
        /**
         * 接收value，不管多选单选，一律调整成数组结构，方便组件内流转
         */
        const value = this.value;
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
      this.dialog.label = label;
      this.dialog.visible = true;
    },
    handleConfirm () {
      const selection = this.$refs.selector.getSelection();
      console.log('selectionselection', selection)
      this.data.push({
        imageUrl: selection.data[0],
        name: ''
      })
      this.refresh = true;

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
    },
    handleRemove (idx, item) {
      this.data.splice(idx, 1);
      this.data = this.data;
    },

    handleInitData (data) {
      if (!data || !data.length) return false;
    }
  },
  mounted () {
    this.initType = Object.prototype.toString.call(this.value).split(' ')[1].slice(0, -1);
    console.log('this.value', this.value)
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
    /* width: 100%; */
    padding: 10px;
    height: 120px;
    border: 1px solid #CCC;
    margin: 5px;
    /* line-height: 100px; */
    vertical-align: top;
    text-align: center;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .file-list__item .file-list_desc{
    padding-left: 20px;
  }
  .file-list__item .file-list_desc p{
    text-align: left;
    color: #999999;
    font-size: 12px;
  }
  .file-list_desc .el-input{
    margin: 5px 0;
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

  /* .file-list__item video, */
  .file-list__item img{
    display: block;
    width: 120px;
    height: 120px;
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