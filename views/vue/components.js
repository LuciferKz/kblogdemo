/*
    组件 prop 属性

    type:Number, // 属性类型
    default:1, // 默认值
    required:true, // 是否必须
    validator:function(value){
        return value < 3;
    } // 验证数据回调函数

    驼峰命名的属性名，在调用组件填写的时候需要改成短横线隔开方式。

    props:{navIndex:Number}

    <component :nav-index='1'></component>

    prop传入数据如果为对象或数组，如果修改会影响父级组件的状态
 */

//页面标题
Vue.component("main-title", {
  props: {
    id: Number,
    title: String
  },
  computed: {
    normalizeId: function () {
      return this.id + 100000;
    }
  },
  template: "<h1 :id='normalizeId'>{{title}}</h1>",
});

Vue.component("main-content", {
  props: {
    data: [{
      id: 1,
      name: "page1"
    }, {
      id: 2,
      name: "page2"
    }, {
      id: 3,
      name: "page3"
    }]
  },
  template: "<div><slot>暂无内容!</slot></div>"
})

Vue.component("my-article", {
  template: `
        <div class="article-container">
            <slot name="article-title">文章标题</slot>
            <div class="article-content">
                <slot>文章内容</slot>
            </div>
            <slot name="article-signature">署名</slot>
        </div>
    `
})

//局部组件
var mainNav = {
  template: "<nav class='nav'><a href='page1.html' :class='{ active : navIndex == 1}'>菜单一</a><a href='page2.html' :class='{ active : navIndex == 2}'>菜单二</a><a href='#'>菜单三</a></nav>",
  props: {
    navIndex: {
      type: Number,
      default: 1,
      required: true,
      validator: function (value) {
        return value < 3;
      }
    }
  },
  computed: {
  }
}

var mixinFoot = {
  template: `
        <div class="common-foot" :class="clsFootStatus">

        </div>
    `,
  data: function () {
    return {
      clsFootStatus: "shrink"
    }
  },
  created: function () {
    this.expand();
  },
  method: {
    expand: function () {
      this.clsFootStatus = "expand";
    }
  }
};

Vue.component('img-item', {
  props: ['vsrc'],
  template: '<img :src="vsrc ? vsrc + \'abc\' : \'sss\'" />'
})

var commonFoot = Vue.extend(mixinFoot);

Vue.component("common-foot", commonFoot);


Vue.component('treeItem', {
  props: {
    'data': {
      type: Object,
      default() {
        return {}
      },
    }
  },
  mounted() {
    console.log(this.data)
  },
  methods: {
    open() {
      console.log(this);
      this.$set(this.data, 'opened', !this.data.opened);
    }
  },
  computed: {
    opened() {
      return this.data.opened ? 'opened' : '';
    }
  },
  template: `
        <div class="tree-item" :class="opened">
          <div class="userid" @click="open()">{{ data.userId }}</div>
          <div class="tree-branchs" v-show="data.opened">
            <div class="tree-left" v-if="data.map && data.map.left">
                <tree-item :data="data.map.left"></tree-item>
            </div>
            <div class="tree-right" v-if="data.map && data.map.right">
                <tree-item :data="data.map.right"></tree-item>
            </div>
          </div>
        </div>
    `
})

[{
  name: 'field_name',
  mode: '', // 1 sql 2 子集
}]




Vue.component('databaseDefine', {
  props: ['defId'],

  provide () {
    return {
      dbDefine: this,
    }
  },

  data() {
    return {
      visible: false,
      mainTables: [{
        id: 1,
        name: '表一',
        children: [{
          id: 1,
          name: 'field_1_1'
        }, {
          id: 2,
          name: 'field_1_2'
        }, {
          id: 3,
          name: 'field_1_3'
        }, {
          id: 4,
          name: 'field_1_4'
        }, {
          id: 5,
          name: 'field_1_5'
        }, {
          id: 6,
          name: 'field_1_6'
        }, {
          id: 7,
          name: 'field_1_7'
        }, {
          id: 8,
          name: 'field_1_8'
        }]
      }, {
        id: 2,
        name: '表二',
        children: [{
          id: 1,
          name: 'field_2_1',
          children: [
            { id: 11, name: 'field_2_1_1' },
            { id: 12, name: 'field_2_1_2' },
            { id: 13, name: 'field_2_1_3' },
            { id: 14, name: 'field_2_1_4' },
          ],
        }, {
          id: 2,
          name: 'field_2_2'
        }]
      }],
      currentField: {
        mode: 0
      },
      model: {
        def_id: '',
        field_id: '',
        field_name: '',
        field_type: '',
      },

      subSubset: [],
    }
  },
  mounted () {
    this.model.def_id = this.defId;
    this.$on('openPopUp', (data) => {
      console.log('on open popup')
      this.subSubset = data;
      this.visible = true;
    });
    this.$on('closePopUp', () => {
      console.log('close open popup')
      this.visible = false;
    });
  },
  methods: {
    async API_SAVE_DETAIL() {
      let res = await fetch('post', {});
    },
    async API_SAVE_SQL() {
      let res = await fetch('post', {});
    },
    async API_SAVE_SUB_TABLE() {
      let res = await fetch('post', {});
    },
    handleModeChange(field) {
      this.currentField = field;
      this.model.field_id = field.id;
      this.model.field_name = field.name;
      this.model.field_type = field.mode;
    },
    handleCancel() {
      switch (this.currentField.mode) {
        case 0:
          this.handleClose();
          break;
        case 1:
        case 2:
          this.handleReset();
          break;
      }
    },
    handleSave() {
      switch (this.currentField.mode) {
        case 0:
          this.API_SAVE_DETAIL();
          break;
        case 1:
          this.handleSaveSql();
          break;
        case 2:
          this.handleSaveSubsetTable();
          break;
      }
    },
    handleSaveSql() {
      this.model.data_def_json = this.$refs.sqlSetting.getData();
      console.log('sqlSetting', this.model);
      // this.API_SAVE_SQL();
    },
    handleSaveSubsetTable() {
      this.model.data_def_json = this.$refs.subsetSetting.getData();
      console.log('subsetSetting', this.model);
      // this.API_SAVE_SUB_TABLE(data);
    },
    handleClose() {

    },
    handleReset() {
      this.currentField = { mode: 0 }
    },
    handleConfirmPopUp () {
      this.$emit('closePopUp');
    },
    handleCancelPopUp () {
      this.$emit('closePopUp');
    },
  },
  template: `
        <div class="database-define">
            <div class="database-define__maintable">
                <main-table-fields :options="mainTables" @on-mode-change="handleModeChange"></main-table-fields>
            </div>
            <div class="database-define__config">
                <sql-setting ref="sqlSetting" v-if="currentField.mode === 1"></sql-setting>
                <subset-setting ref="subsetSetting" :tables="mainTables" v-else-if="currentField.mode === 2"></subset-setting>
            </div>
            <div class="database-define__detail">
                <div class="database-define__mode-brief">
                  <template v-if="currentField.mode === 0">
                    注:<br />
                    1.根据选择的API入参加载对应的字段和选择框; <br />
                    2.选择框默认显示“请选择”; <br />
                    3.选择不同的选项打开相应的弹层;选择sql则加载<i>自定义SQL</i>弹层;选择子集后加载<i>子集</i>弹层; <br />
                    4.若某个字段同时配置了sql和子集;默认显示sql; <br />
                    5.若某个字段配置了sql或子集，仅显示其配置的内容 即可; <br />
                    6.两种弹层不同时显示。
                  </template>
                  <template v-else-if="currentField.mode === 1">
                    注:<br />
                    自定义SQL中的参数须写成\${}.<br />
                    如:where parms=\${param}<br />
                    点击新增按钮，重新打开一个SQL弹层
                  </template>
                  <template v-else-if="currentField.mode === 2">
                    注: <br />
                    1.最多支持两层;<br />
                      2.自定义SQL中的参数须写成\${}.<br />
                      如:where parms=\${param};<br />
                      3.点击新增按钮，增加一个子弹层;<br />
                      4.从左侧拖动XXXXX到关联参数处并参与计算;<br />
                      5.点击弹层中的选择框<br />
                      弹出小弹层
                  </template>
                </div>
                <div class="database-define__buttons">
                    <input type="button" value="保存" @click="handleSave" class="primary" />
                    <input type="button" value="取消" @click="handleCancel" />
                </div>
            </div>
            <pop-up :visible="visible">
              <div class="sub-subset" slot="body">
                <div class="checkbox-group">
                    <div class="checkbox-group__item" v-for="field in subSubset.options" :key="field.name">
                        <label :for="field.name + $index">{{ field.name }}</label>
                        <input :id="field.name + $index" type="checkbox" v-model="subSubset.fields" :value="field.name" @change="handleFieldChange(field)" />
                    </div>
                </div>
              </div>
              <div slot="footer" class="pop-up__buttons">
                <input type="button" value="保存" @click="handleConfirmPopUp" class="primary" />
                <input type="button" value="取消" @click="handleCancelPopUp" />
              </div>
            </pop-up>
        </div>
    `
})

Vue.component('mainTableFields', {
  props: {
    options: {
      type: Array,
      default: () => []
    }
  },
  inject: ['dbDefine'],
  data() {
    return {
      value: '',
      fields: [],
    }
  },
  methods: {
    handleTableChange() {
      console.log(this.value);
      const currentOption = this.options.find(opt => opt.id === this.value);
      this.fields = currentOption.children.map(child => ({
        id: child.id,
        name: child.name,
        mode: ''
      }));
    },
    handleModeChange(field) {
      this.$emit('on-mode-change', field)
    }
  },
  template: `
        <div class="main-table-fields">
            <div class="table__select">
                <select v-model="value" @change="handleTableChange">
                    <option value='' disabled selected style='display:none;'>请选择表</option>
                    <option v-for="opt in options" :key="opt.name" :value="opt.id">{{ opt.name }}</option>
                </select>
            </div>
            <ul class="table-fields">
                <li class="table-fields__item" v-for="field in fields">
                    <label>{{ field.name }}</label>
                    <select v-model="field.mode" placeholder="请选择类型" @change="handleModeChange(field)">
                        <option value='' disabled selected style='display:none;'>请选择类型</option>
                        <option :value="1">SQL</option>
                        <option :value="2">子集</option>
                    </select>
                </li>
            </ul>
        </div>
    `
})

Vue.component('relatedParams', {
  template: `
        <div class="related-params">
            <div>关联参数</div>
            <div class="related-params__fields">

            </div>
        </div>
    `
})

Vue.component('sqlSetting', {
  data() {
    return {
      inputSqls: [{
        name: '',
        sql: '',
        related: []
      }]
    }
  },
  methods: {
    getData() {
      return JSON.stringify(this.inputSqls)
    },
    handleAddInputSql (index) {
      this.inputSqls.splice(index + 1, 0, {
        name: '',
        sql: '',
        related: []
      })
    }
  },
  template: `
        <div class="sql-setting">
            <div class="sql-setting__box" v-for="(inputSql, $index) in inputSqls" :key="'inputSql' + $index">
                <div class="sql-setting__left">
                    <related-params v-model="inputSql.related"></related-params>
                </div>
                <div class="sql-setting-form">
                    <div class="sql-setting-form__item">
                        <label>SQL别名</label>
                        <input type="text" placeholder="请输入SQL别名" v-model="inputSql.name" />
                    </div>
                    <div class="sql-setting-form__item">
                        <label>SQL</label>
                        <textarea placeholder="请输入自定义SQL" v-model="inputSql.sql"></textarea>
                    </div>
                </div>
                <div class="button--add" @click="handleAddInputSql($index)"></div>
            </div>
        </div>
    `
})

Vue.component('subsetSetting', {
  props: {
    tables: {
      type: Array,
      default: () => []
    }
  },
  inject: ['dbDefine'],
  data() {
    return {
      subsets: [{
        name: '',
        fields: [],
        related: [],
        options: [],
      }],
    }
  },
  methods: {
    getData() {
      return this.subsets.map(subset => ({
        name: subset.name,
        fields: subset.fields,
        related: subset.related
      }))
    },
    handleTableChange(subset) {
      const subsetTable = this.tables.find(tb => tb.name === subset.name);
      if (!subsetTable) return false;
      subset.options = subsetTable.children;
    },
    handleAddSubset (index) {
      this.subsets.splice(index + 1, 0, {
        name: '',
        fields: [],
        related: [],
        options: [],
      })
    },
    handleFieldChange (field, fields) {
      console.log('handleFieldChange', field)
      if (field.children && fields.indexOf(field.name) > -1) {
        this.dbDefine.$emit('openPopUp', {
          options: field.children,
          fields: [],
        })
      }
    }
  },
  template: `
        <div class="subset-setting">
            <div class="subset-setting__box" v-for="(subset, $index) in subsets" :key="'subset' +  $index">
                <div class="subset-setting__left">
                    <related-params></related-params>
                </div>
                <div class="subset-setting-form">
                    <div class="subset-setting-form__item">
                        <select v-model="subset.name" @change="handleTableChange(subset)">
                            <option value='' disabled selected style='display:none;'>请选择表</option>
                            <option v-for="table in tables" :key="table.name" :value="table.name">{{ table.name }}</option>
                        </select>
                    </div>
                    <div class="subset-setting-form__item">
                        <div class="checkbox-group">
                            <div class="checkbox-group__item" v-for="field in subset.options" :key="field.name">
                                <label :for="field.name + $index">{{ field.name }}</label>
                                <input :id="field.name + $index" type="checkbox" v-model="subset.fields" :value="field.name" @change="handleFieldChange(field, subset.fields)" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="button--add" @click="handleAddSubset($index)"></div>
            </div>
        </div>
    `
})

Vue.component('popUp', {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    appendToBody: {
      type: Boolean,
      default: false,
    }
  },
  inject: ['dbDefine'],
  mounted () {
    if (this.visible) this.handleOpen();
  },
  watch: {
    visible (val) {
      console.log(val)
      if (val) {
        this.handleOpen();
      } else {
        this.handleDestory();
      }
    }
  },
  methods: {
    handleOpen () {
      const $el = this.$el;
      if (this.appendToBody) document.body.appendChild($el);
    },

    handleDestory () {
    },

    handleClose () {
      this.dbDefine.$emit('closePopUp')
    }
  },
  template: `
    <transition name="dialog-fade">
      <div class="pop-up" v-if="visible" @click.self="handleClose">
        <div class="pop-up__content" @click.stop="handle">
          <div class="pop-up__header">表名：{{  }}</div>
          <div class="pop-up__body">
            <slot name="body"></slot>
          </div>
          <div class="pop-up__footer">
            <slot name="footer"></slot>  
          </div>
        </div>
      </div>
    </transition>
  `
})

const ajax = function (options) {
	const url = options.url;
  const type = options.type;
  const success = options.success;
  const error = options.error;
  const config = {};
  config.type = type || 'get';
  config[type === 'post' ? 'data' : 'params'] = options.data;
  config.headers = new Headers({
    'Content-Type': 'application/json'
  })
  return new Promise((resolve, reject) => {
    fetch(url, config)
    .then(res => {
      if (success) success(res)
      resolve(res);
    })
    .catch(res => {
      if (error) error(res)
      reject(res);
    })
  })
}

Vue.prototype.$request = function(options){
  return ajax(options);
}