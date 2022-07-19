<template>
    <div class="link-selector">
      <el-tabs v-model="activeName">
        <el-tab-pane label="商城页面" name="page">
          <div class="pane-content">
            <div class="page-link" v-for="(page, key) in pageLinks" :key="key">
              <h3><span>{{ page.title }}</span></h3>
              <ul class="links-item">
                <li v-for="item in page.children" :key="item.link" @click="handleSelectPage(item)" :class="{ active: item.link === value }">{{ item.label }}</li>
              </ul>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品分类" name="category">
          <div class="pane-content">
            <el-table ref="table" :data="categories">
              <el-table-column v-for="cfg in categoriesConfig" :key="cfg.prop" :label="cfg.label" :width="cfg.width">
                <template slot-scope="scope">
                  <div v-if="cfg.render" v-html="cfg.render(scope)"></div>
                  <div v-else>{{ scope.row[cfg.prop] }}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作" :width="100">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.link !== value" @click="handleSelectCategory(scope.row)">选择分类</el-button>
                  <span v-else class="active__button">已选分类</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="商品" name="product">
          <div class="pane-content">
            <div class="form-item w300">
              <label>商品名称</label>
              <div>
                <el-input v-model="filter.goodsName" placeholder="请输入商品名称">
                  <el-button slot="append" class="search__button" type="primary" @click="handleGetProducts" icon="el-icon-search"></el-button>
                </el-input>
              </div>
            </div>
            <el-table ref="table" :data="products">
              <el-table-column v-for="cfg in productsConfig" :key="cfg.prop" :label="cfg.label" :width="cfg.width">
                <template slot-scope="scope">
                  <div v-if="cfg.render" v-html="cfg.render(scope)"></div>
                  <div v-else>{{ scope.row[cfg.prop] }}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.link !== value" @click="handleSelectProduct(scope.row)">选择商品</el-button>
                  <span v-else class="active__button">已选商品</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="product-pagination">
              <el-pagination
                :page-sizes="[10, 20, 30, 40]"
                :total="pagination.total"
                :current-page="pagination.current"
                :page-size="pagination.limit"
                @current-change="handleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper"
                ref="pagination">
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="小程序" name="wxapp" v-if="filterTab.wxapp">
          <div class="pane-content">
            <div class="form-item">
              <label>APPID</label>
              <div>
                <el-input v-model="model.wxapp.appid" placeholder="请在此输入跳转小程序的APPID"></el-input>
                <p class="hint">注：该appID需先添加到小程序配置文件中，声明需要跳转的小程序appID列表，并提交审核通过后方可实现跳转。</p>
              </div>
            </div>
            <div class="form-item">
              <label>跳转路径</label>
              <div>
                <el-input v-model="model.wxapp.urldata" placeholder="请在此输入跳转小程序的页面路径"></el-input>
                <p class="hint">注：小程序页面路径为空，默认为跳转到该小程序首页。</p>
              </div>
            </div>
          </div>
          <div class="button__bar">
            <el-button type="primary" class="submit__button" @click="handleSubmit">确定</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="电话" name="phone" v-if="!enableSettings.disablePhone">
          <div class="pane-content">
            <div class="form-item">
              <label>电话</label>
              <el-input v-model="model.phoneNumber"></el-input>
            </div>
          </div>
          <div class="button__bar">
            <el-button type="primary" class="submit__button" @click="handleSubmit">确定</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="自定义" name="custom">
          <div class="pane-content">
            <div class="form-item">
              <label>路径</label>
              <el-input v-model="model.customLinkUrl"></el-input>
            </div>
          </div>
          <div class="button__bar">
            <el-button type="primary" class="submit__button" @click="handleSubmit">确定</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
import quickFormItem from '@/components/quickFormItem';
import dicts from '@/utils/dicts';

const renderThumb = function (data) {
  return data.row.firstImage ? `<img src="${data.row.firstImage}" width="100" height="100" alt="${data.row.firstImage}" />` : '';
}

export default {
  props: {
    value: [String, Object],
    enableSettings: {
      type: Object,
      default: () => ({ disablePhone: 0 })
    },
    filterTab: {
      type: Object,
      default: () => ({ wxapp: true })
    }
  },
  components: { quickFormItem },
  mounted () {
    this.handleInit();
  },
  data () {
    return {
      activeName: 'page',
      lujing: '',
      pageLinks: {
        mall: {
          title: '商城首页',
          children: [
            { label: '商城首页', link: '/pages/index/index' },
            { label: '分类导航', link: '/pages/goods/index/index' }
          ]
        },
        person: {
          title: '个人中心',
          children: [
            // { label: '全部订单', link: '/pages/order/index' },
            // { label: '待付款订单', link: '/pages/order/index?status=0' },
            // { label: '待发货订单', link: '/pages/order/index?status=1' },
            // { label: '待收货订单', link: '/pages/order/index?status=2' },
            // { label: '已完成订单', link: '/pages/order/index?status=3' },
          ]
        },
        custom: {
          title: '自定义页面',
        }
      },
      pagination: {
        total: 10,
        limit: 10,
        current: 1,
      },
      filter: {
        goodsName: '',
        selectGift: false,
        selectOnShelf: true,
        excludedTypes: '3',
        status: 1
      },
      products: [],
      productsConfig: [
        { label: '图片', prop: 'firstImage', render: renderThumb, width: 180 },
        { label: '商品名称', prop: 'title', width: 150 },
        { label: '商品价格', prop: 'presentPrice' },
        { label: '库存', prop: 'virtualStock' }
      ],
      categories: [],
      categoriesConfig: [
        { label: '分类名称', prop: 'name' },
      ],
      model: {
        wxapp: { appid: '', urldata: '' },
        phoneNumber: '', //
        customLinkUrl: '', // 自定义链接
      }
    }
  },
  methods: {
    handleInit () {
      this.handleGetProducts();
      this.handleGetCategories();
      this.handleGetDiyPages();
      this.handleGetLinks();
    },
    handleGetDiyPages () {
      return dicts
      .getDiyPages({ type: '5' })
      .then(diypages => {
        this.diypages = diypages;
        this.pageLinks.custom.children = diypages.map(page => ({ label: page.name, link: '/pages/custom/index?pageid=' + page.id }))
      })
    },
    handleGetLinks () {
      return dicts
      .getLinks()
      .then(res => {
        this.pageLinks.person.children = res.ec_shop_diy_page_orderLink.map(page => ({ label: page.text, link: page.value }))
      })
    },
    handleGetProducts () {
      const limit = this.pagination.limit;
      const offset = limit * (this.pagination.current  - 1);
      return dicts
      .getProducts({ ...this.filter, limit, offset })
      .then(res => {
        this.products = res.data;
        res.data.forEach(item => {
          item.link = '/pages/goods/detail/index?id=' + item.id
        })
        this.pagination.total = res.total;
      })
    },
    handleGetCategories () {
      return dicts
      .getCategories()
      .then(categories => {
        categories.forEach(item => {
          item.link = '/pages/goods/index/index?cate=' + item.id
        })
        this.categories = categories;
      })
    },
    handleCurrentChange (current) {
      this.pagination.current = current;
      this.handleGetProducts();
    },
    handleSubmit () {
      const activeName = this.activeName;
      console.log(activeName, this.model.phoneNumber);
      let value = '';
      switch (activeName) {
        case 'wxapp':
          value = this.model.wxapp;
          break;
        case 'phone':
          value = this.model.phoneNumber;
          break;
        case 'custom':
          value = this.model.customLinkUrl;
          break;
      }
      this.handleClose(value);
    },
    handleSelectPage (page) {
      this.handleClose(page.link);
    },
    handleSelectCategory (row) {
      this.handleClose(row.link);
    },
    handleSelectProduct (row) {
      this.handleClose(row.link);
    },
    handleClose (value) {
      this.$emit('input', value);
      this.$emit('change', value);
      this.$emit('close');
    },
  }
}
</script>

<style lang="css">
  .link-selector {
    /* display: flex;
    flex-direction: column; */
    background: #FFF;
    padding: 20px;
    color: #888;
    min-height: 400px;
  }
  .pane-content {
    /* flex: 1; */
    width: 100%;
    font-size: 12px;
  }
  .button__bar {
    height: 60px;
    text-align: center;
  }
  .form-item {
    display: flex;
    margin-bottom: 10px;
  }
  .form-item label {
    width: 100px;
    /* padding-top: 10px; */
    padding-left: 10px;
  }
  .form-item div {
    flex: 1;
  }
  .form-item .hint {
    margin-top: 5px;
    color: #F00;
  }
  .page-link {
    margin-bottom: 20px;
  }
  .page-link h3 {
    border-bottom: 1px solid #dcdee2;
    margin-bottom: 10px;
  }
  .page-link h3 span {
    display: inline-block;
    width: 100px;
    line-height: 40px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background-color: #dcdee2;
    text-align: center;
    letter-spacing: 1px;
  }
  .links-item li {
    display: inline-block;
    margin: 5px 10px;
    border-radius: 4px;
    border: 1px solid #dcdee2;
    padding: 0 15px;
    line-height: 30px;
    cursor: pointer;
  }
  .links-item li:hover {
    border-color: #2d8cf0;
    color: #2d8cf0;
  }
  .links-item li.active {
    background: #0083b0;
    border-color: #0083b0;
    color: #fff;
  }
  .active__button {
    display: inline-block;
    padding: 0 15px;
    background-color: #ed4014;
    border-color: #ed4014;
    border-radius: 3px;
    line-height: 30px;
    color: #FFF;
  }
  .search__button {
    margin-left: 10px;
  }
  .w300 {
    width: 300px;
  }
  .submit__button {
    width: 100px;
  }
  .product-pagination {
    text-align: center;
    padding-top: 10px;
  }
</style>