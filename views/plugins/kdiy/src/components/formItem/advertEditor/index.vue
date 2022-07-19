<template>
  <div class="advert-editor">
    <div class="hint">单张图片尺寸建议750*350，</div>
    <div class="advert-editor__list" v-if="advertImages.length">
      <div class="advert-item" v-for="(item, $index) in advertImages" :key="$index">
        <div class="advert-item__image"><img :src="item.image" width="135" height="96"/></div>
        <div class="advert-item__detail">
          <div class="detail-row">
            <el-input v-model="item.image" disabled>
              <el-button slot="append" @click="handleSelectImage(item, $index)">选择图片</el-button>
            </el-input>
          </div>
          <div class="detail-row">
            <el-input v-model="item.linkUrl" disabled>
              <el-button slot="append">选择链接</el-button>
            </el-input>
          </div>
          <i class="advert-item__delete el-icon-delete" @click="handleDelete(item, $index)"></i>
        </div>
      </div>
    </div>
    <div class="advert-editor__button" @click="handleOpen">
      <i class="el-icon-plus"></i>添加广告图片
    </div>
    <div class="hint">最多添加10个广告，拖动选中的图片广告可对其排序</div>

    <el-dialog title="选择图片" :visible.sync="dialogVisible" width="1000px" height="800px" appendToBody>
      <div v-if="dialogVisible">
        <image-selector v-if="!currentItem" v-model="selection" ref="selector" multiselect></image-selector>
        <image-selector v-else ref="selector"></image-selector>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import imageSelector from '@/components/imageSelector';

export default {
  components: { imageSelector },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      selection: [],
      currentItem: null,
      dialogVisible: false,
    }
  },
  mounted () {
    console.log(this.advertImages);
    this.selection = this.advertImages.map(advert => advert.image);
  },
  computed: {
    advertImages: {
      get () {
        return this.value;
      },
      set (value) {
        this.$emit('input', value);
      }
    }
  },
  methods: {
    handleOpen () {
      this.dialogVisible = true;
    },
    handleClose () {
      this.currentItem = null;
      this.dialogVisible = false;
    },
    handleConfirm () {
      const selection = this.$refs.selector.getSelection();
      if (this.currentItem) {
        this.currentItem.image = selection.data[0]
      } else {
        selection.data.forEach(image => {
          this.advertImages.push({ image })
        })
      }
      this.handleClose();
    },
    handleDelete (item, index) {
      this.advertImages.splice(index, 1);
      this.selection = this.advertImages.map(advert => advert.image);
    },

    handleSelectImage (item, index) {
      this.currentItem = item;
      this.handleOpen();
    },
  }
}
</script>

<style lang="css">
.advert-editor {
}

.advert-editor .hint {
  font-size: 12px;
  color: #888;
}

.advert-editor__button {
  border: 1px dashed #CCC;
  margin: 10px 0;
  padding: 10px 0;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
}

.advert-editor__button .el-icon-plus {
  margin-right: 10px;
}

.advert-editor__list {
  margin-top: 10px;
  border: 1px solid #CCC;
}

.advert-item {
  position: relative;
  display: flex;
  padding: 15px 15px 10px;
  background: #EEE;
  border-bottom: 1px dashed #CCC;
}
.advert-item:last-child {
  border-bottom: none;
}
.advert-item__image {
  margin-right: 10px;
}
.advert-item__delete {
  position: absolute;
  top: 0;
  right: 0;
  padding: 5px;
  background: #999;
  color: #FFF;
  cursor: pointer;
}
.detail-row {
  margin-top: 12px;
}
</style>