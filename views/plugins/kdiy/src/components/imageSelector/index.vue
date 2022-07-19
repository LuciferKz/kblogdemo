<template>
  <el-container class="flex-box" v-loading="loading">
    <div class="image--selector">
      <div class="gallery__handler">
        <div class="search__bar">
          <el-input v-model="filter.name" placeholder="请输入文件名称" @input="handleSearch">
            <el-button slot="append" class="search__button">搜索</el-button>
          </el-input>
        </div>
        <div class="upload__bar">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="handleBeforeUpload"
          >
            <el-button type="primary">上传{{ type === 'image' ? '图片' : '视频' }}</el-button>
          </el-upload>
        </div>
      </div>
      <div class="gallery">
        <ul class="gallery__ul">
          <li v-for="item in files" :key="item.id" @click="handleSelectFile(item)" :class="isSelected(item)">
            <img v-if="type === 'image'" alt="" :src="item[addressKey]" width="100" height="100" />
            <video v-else alt="" :src="item[addressKey]" width="100" height="100"></video>
            <p>{{ item.name }}</p>
            <div class="file__cover">
              <div class="file__handler">
                <i class="el-icon-check"></i>
              </div>
            </div>
            <i class="el-icon-error remove-file__button" @click.stop="handleRemoveFile(item)"></i>
          </li>
        </ul>
        <div class="gallery__pagination">
          <el-pagination
            :page-sizes="[10, 20, 30, 40]"
            :total="pagination.total"
            :current-page="filter.current"
            :page-size="filter.limit"
            @size-change="handlePageSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes, prev, pager, next, jumper"
            ref="pagination">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="categories" v-if="type === 'image'">
      <ul class="categories__ul">
        <li v-for="item in categories" :key="item.id" @click="handleSelectCategory(item)" :class="{ cur: item.id === filter.categoryId }">
          {{ item.name }}<i class="remove_category__button el-icon-close" @click.stop="handleRemoveCategory(item.id)"></i>
        </li>
      </ul>
      <el-popover
        placement="top"
        width="240"
        class="add-category__button"
        popper-class="add-category__popper"
        v-model="addCategoryVisible">
        <p class="add-category__title">分类名称</p>
        <el-input v-model="newCategory" placeholder="新标签名称"></el-input>
        <div class="add-category__buttons">
          <el-button type="info" @click="handleCancelAdd">取消</el-button>
          <el-button type="primary" @click="handleSaveCategory">确定</el-button>
        </div>
        <el-button slot="reference" icon="el-icon-plus">新增分类</el-button>
      </el-popover>
    </div>
  </el-container>
</template>

<script>
import api from './api';
import { debounce } from '@/utils';

export default {
  props: {
    value: Array,
    type: {
      type: String,
      default: 'image',
    },
    multiselect: {
      type: Boolean,
      default: false,
    },
    duplicate: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      loading: false,
      files: [],
      categories: [],
      selected: {},
      pagination: {
        total: 0,
      },
      filter: {
        type: 'image',
        categoryId: '',
        name: '',
        offset: 0,
        limit: 10,
        current: 1,
      },
      newCategory: '',
      addCategoryVisible: false,
      addressKey: 'imgAddress',
    }
  },
  methods: {
    getSelected () {
      const selected = this.multiselect ? this.handleGetMultiSelected() : this.handleGetSelected();
      this.$emit('input', selected.data);
      return selected;
    },

    getSelection () {
      return this.getSelected();
    },
    
    remove (id) {
      const target = this.selected[id];
      this.multiselect ? delete this.selected[id] : this.selected = {};
      return target;
    },
    
    clear () {
      this.selected = {};
    },
    
    handleGetSelected () {
      const v = this.selected[this.addressKey];
      return { data: v ? [v] : [] };
    },

    handleGetMultiSelected () {
      const selection = Object.values(this.selected).map(file => file[this.addressKey]).concat(this.value);
      return this.duplicate ? { data: selection } : this.handleDuplicateRemoval(selection);
    },

    handleDuplicateRemoval (arr) {
      const newFile = arr.filter((image) => !(this.value.indexOf(image) > -1)) // 选中的文件（不包括已选中）
      const newArr = Array.from(new Set(arr)); // 选中的文件（包括已选中）
      return { data: newArr, newFile: newFile, duplicate: arr.length - newArr.length };
    },

    handleQuery () {
      const limit = this.filter.limit;
      const offset = limit * (this.filter.current  - 1);
      this.filter.limit = limit;
      this.filter.offset = offset;
      this.loading = true;
      console.log('handleQuery', this.filter);
      this
      .handleGetFiles(this.filter)
      .then((res) => {
        this.files = res.result.data;
        this.pagination.total = res.result.total;
        this.loading = false;
      })
    },

    handleSearch: debounce(function () {
      this.handleQuery();
    }, 500),

    handleUpload (data) {
      this.loading = true;
      this
      .$requestEC({
        ...api[this.type === 'image' ? 'uploadImage' : 'uploadFile'],
        data,
      })
      .then((res) => {
        this.loading = false;
        if (res.success) {
          this.$message.success(res.message);
          this.handleQuery();
        }
      });
    },

    handleUploadSuccess(res, file) {
    },

    handleBeforeUpload (file) {
      let valid = false;

      if (this.type === 'image') {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isPNG) {
          this.$message.error('上传图片只能是 JPG、PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }

        valid = (isJPG || isPNG) && isLt2M;

      } else {
        const isMP4 = file.type === 'video/mp4';
        const isLt5M = file.size / 1024 / 1024 < 5;

        if (!isMP4) {
          this.$message.error('上传视频只能是 MP4 格式!');
        }
        if (!isLt5M) {
          this.$message.error('上传视频大小不能超过 5MB!');
        }

        valid = isMP4 && isLt5M;
      }

      if (valid) {
        const _formData = new FormData();
        _formData.append('file', file);
        _formData.append('categoryId', this.filter.categoryId);
        _formData.append('type', 1);
        this.type === 'video' && _formData.append('fileType', 'video');
        this.handleUpload(_formData);
      }

      return valid;
    },

    handleSelectFile (file) {
      if (this.multiselect) {
        if (this.selected[file.id]) {
          this.$delete(this.selected, file.id);
        } else {
          this.$set(this.selected, file.id, file);
        }
      } else {
        this.selected = file;
      }
      this.$emit('select', file);
    },

    handleSelectCategory (category) {
      this.filter.categoryId = category.id;
      this.filter.current = 1;
      this.handleQuery(category.id);
    },

    handlePageSizeChange (size) {
      this.filter.limit = size;
      this.handleQuery();
    },

    handleCurrentChange (p) {
      this.filter.current = p;
      this.handleQuery();
    },

    handleRemoveFile (file) {
      this.$confirm( this.$t('请确认是否',{ do : this.$t('删除1') , name : this.$t('文件')}), this.$t('提示'), {
        confirmButtonText: this.$t('是'),
        cancelButtonText: this.$t('否'),
        type: 'warning'
      }).then(() => {
        this
        .$requestEC({
          url: api.removeFile.url + file.id,
          method: api.removeFile.method,
        })
        .then(() => {
          this.handleQuery()
        })
      }).catch(() => {

      });
    },

    handleRemoveCategory (id) {
      this.$confirm( this.$t('请确认是否',{ do : this.$t('删除1') , name : this.$t('分类')}), this.$t('提示'), {
        confirmButtonText: this.$t('是'),
        cancelButtonText: this.$t('否'),
        type: 'warning'
      }).then(() => {
        const config = { ...api.removeCategory }
        config.url = config.url + id
        this
        .$requestEC(config)
        .then((res) => {
          if (res.success) {
            this.$message.success(res.message);
            this.handleGetCategories();
          }
        })
      }).catch(() => {

      });
    },

    handleGetFiles (params) {
      if (!params.categoryId && params.type === 'image') return false;
      params.type = this.type;
      // console.log(params);
      return this.$requestEC({ ...api.files, params });
    },

    handleGetCategories () {
      const type = this.type;
      if (type !== 'image') return false;
      return this
      .$requestEC({
        ...api.categories,
        data: {
          type: 'image'
        }
      })
      .then(res => {
        this.categories = res.result;
        return res.result;
      });
    },

    handleSaveCategory () {
      if (!this.newCategory) {
        this.$message.warning('分类名称不能为空！');
        return false;
      }
      this
      .$requestEC({
        ...api.saveCategory,
        data: {
          name: this.newCategory
        },
      })
      .then((res) => {
        if (res.success) {
          this.$message.success(res.message);
          this.handleGetCategories();
        }
        this.addCategoryVisible = false;
      })
    },
    handleCancelAdd () {
      this.addCategoryVisible = false;
    }
  },
  computed: {
    isSelected () {
      return function (file) {
        return this.selected && ((this.multiselect && this.selected[file.id]) || this.selected.id === file.id) ? 'selected' : ''
      }
    },
  },
  mounted () {
    this.filter.type = this.type;
    if (this.type === 'image') {
      this
      .handleGetCategories()
      .then((categories) => {
        this.handleSelectCategory(categories[0]);
      });
    } else {
      this.handleQuery()
    }
  },
}
</script>

<style scoped>
  @import url('./style');
</style>