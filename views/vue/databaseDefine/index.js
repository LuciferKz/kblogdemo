const api = {
  saveDef: { url: 'crmFlowDataDef/insertOrUpdate', method: 'post' }, // 保存def
  
  saveDefDetail: { url: 'crmFlowDataDefDetail/insertOrUpdate', method: 'post' }, // 保存sql或者子集

  getDef: { url: 'crmFlowDataDef/getCrmFlowDataDef', method: 'post' }, // 获取def详情
  
  getDefDetail:  { url: 'crmFlowDataDefDetail/getCrmFlowDataDefDatail', method: 'post' },

  getTableFile: { url: 'crmFlowDataDefDetail/getTableFile', method: 'post' }, // 获取表信息
}

const clone = function (obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  let rst;
  if (obj instanceof Array) {
    rst = [];
    for (let i = 0, l = obj.length; i < l; i++) {
      if (typeof obj[i] === 'object' && obj[i] != null) {
        rst[i] = clone(obj[i]);
      } else {
        rst[i] = obj[i];
      }
    }
  } else {
    rst = {};
    for (const k in obj) {
      if (typeof obj[k] === 'object' && obj[k] != null) {
        rst[k] = clone(obj[k]);
      } else {
        rst[k] = obj[k];
      }
    }
  }

  return rst;
}

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
      mainTable: {
        data: {},
        dataApi: [],
        filedWay: [],
      },
      subsetSetting: {
        tables: [],
      },
      tableField: {
        dataApi: [],
        filedWay: [],
        dataFlow: [],
      },
      currentField: { mode: 0 },
      subSubset: [],
      dataDefJson: {},
    }
  },
  mounted () {
    // $('#dbdefine-name').value()
    let getTableField = this.$request({
      ...api.getTableFile,
      params: {
        crmFlowDataDefId: this.defId,
      },
    })
    let getDef = this.API_GET_DEF({ id: this.defId })
    Promise
    .all([getTableField, getDef])
    .then(res => {
      if (!res || res.length < 2) return false;
      let tableField = res[0];
      this.mainTable.dataApi = tableField.dataApi;
      this.mainTable.filedWay = tableField.filedWay;
      this.tableField = tableField;
      let defData = res[1].data;
      const dataDefJson = defData.defJson;
      this.name = defData.name;
      this.mainTable.apiId = defData.apiId;
      this.mainTable.data = dataDefJson ? JSON.parse(dataDefJson) : {};
    })

    this.$on('openPopUp', (data) => {
      this.subSubset = data;
      this.visible = true;
    });
    this.$on('closePopUp', () => {
      this.visible = false;
    });
  },
  methods: {
    async API_GET_DEF (data = {}) {
      let res = this.$request({ ...api.getDef, params: { crmFlowDataDefId: this.defId }, data })
      return res;
    },
    async API_GET_DEF_DETAIL (data) {
      let res = this.$request({ ...api.getDefDetail, data })
      return res;
    },
    async API_SAVE_DETAIL(data) {
      let res = await this.$request({ ...api.saveDef, data });
      return res;
    },
    async API_SAVE_SQL(data) {
      let res = await this.$request({ ...api.saveDefDetail, data });
      return res;
    },
    async API_SAVE_SUB_TABLE(data) {
      let res = await this.$request({ ...api.saveDefDetail, data });
      return res;
    },
    handleTableChange (val) {
      this.apiId = val;
    },
    handleModeChange(field) {
      this.currentField = field;
      this.subsetSetting.table = clone(this.tableField.dataFlow);
      if (field.mode) {
        this
        .API_GET_DEF_DETAIL({
          defId: this.defId,
          fieldId: field.id,
          fieldType: field.mode,
        }).then(res => {
          this.dataDefJson = res.dataDefJson ? JSON.parse(res.dataDefJson) : {};
        })
      } else {
        this.dataDefJson = {};
      }
      this.$forceUpdate();
    },
    handleCancel() {
      if (this.currentField.mode == 0) {
        this.handleClose();
      } else {
        this.handleReset();
      }
    },
    handleSave() {
      if (this.currentField.mode == 0) {
        this.handleSaveDef();
      } else if (this.currentField.mode == 1) {
        this.handleSaveSql();
      } else if (this.currentField.mode == 2) {
        this.handleSaveSubsetTable();
      }
    },
    handleSaveDef () {
      const model = {};
      const dataDefJson = this.$refs.mainTable.getData();
      model.id = this.defId;
      model.apiId = this.apiId;
      model.name = this.name;
      model.data_def_json = JSON.stringify(dataDefJson);
      this.API_SAVE_DETAIL(model).then(res => {
        if (res.msg) {
          if (!res.code) {
            this.$message.success(res.msg);
            this.handleClose();
          } else {
            this.$message.error(res.msg);
          }
        }
      });
    },
    handleSaveSql() {
      this.$refs.sqlSetting.validate((valid) => {
        if (valid) {
          const model = {};
          const dataDefJson = this.$refs.sqlSetting.getData();
          model.def_id = this.defId;
          model.field_id = this.currentField.id;
          model.field_type = 1;
          model.field_name = this.currentField.name;
          model.data_alias = dataDefJson.inputSqls.map(inputSql => inputSql.name).join(',');
          model.data_def_json = JSON.stringify(dataDefJson);
    
          console.log('sqlSetting', model);
          this.API_SAVE_SQL(model).then(res => {
            if (res.msg) {
              if (!res.code) {
                this.$message.success(res.msg);
                this.handleReset();
              } else {
                this.$message.error(res.msg);
              }
            }
          });
        }
      })
    },
    handleSaveSubsetTable() {
      const model = {};
      const dataDefJson = this.$refs.subsetSetting.getData();
      model.def_id = this.defId;
      model.field_id = this.currentField.id;
      model.field_type = 2;
      model.field_name = this.currentField.name;
      model.data_alias = dataDefJson.selectTables.map(tb => tb.name).join(',');
      model.data_def_json = JSON.stringify(dataDefJson);

      console.log('subsetSetting', model);
      this.API_SAVE_SUB_TABLE(model).then(res => {
        if (res.msg) {
          if (!res.code) {
            this.$message.success(res.msg);
            this.handleReset();
          } else {
            this.$message.error(res.msg);
          }
        }
      });;
    },
    handleClose() {
      this.$emit('close');
    },
    handleReset() {
      this.currentField = { mode: 0 }
    },
    handleConfirmPopUp () {
      this.$emit('closePopUp', this.subSubset.fields);
    },
    handleCancelPopUp () {
      this.$emit('closePopUp');
    },
  },
  template: `
        <div class="database-define">
            <div class="database-define__maintable">
                <main-table-fields
                  ref="mainTable"
                  :apiId="mainTable.apiId"
                  :data="mainTable.data"
                  :dataApi="mainTable.dataApi"
                  :filedWay="mainTable.filedWay"
                  @on-table-change="handleTableChange"
                  @on-mode-change="handleModeChange"
                ></main-table-fields>
            </div>
            <div class="database-define__config">
                <sql-setting :data="dataDefJson" ref="sqlSetting" v-if="currentField.mode == 1"></sql-setting>
                <subset-setting :data="dataDefJson" ref="subsetSetting" :tables="subsetSetting.table" v-else-if="currentField.mode == 2"></subset-setting>
            </div>
            <div class="database-define__detail">
                <div class="database-define__mode-brief">
                  <template v-if="currentField.mode == 0">
                    注:<br />
                    1.根据选择的API入参加载对应的字段和选择框; <br />
                    2.选择框默认显示“请选择”; <br />
                    3.选择不同的选项打开相应的弹层;选择sql则加载<i>自定义SQL</i>弹层;选择子集后加载<i>子集</i>弹层; <br />
                    4.若某个字段同时配置了sql和子集;默认显示sql; <br />
                    5.若某个字段配置了sql或子集，仅显示其配置的内容 即可; <br />
                    6.两种弹层不同时显示。
                  </template>
                  <template v-else-if="currentField.mode == 1">
                    注:<br />
                    自定义SQL中的参数须写成\${}.<br />
                    如:where parms=\${param}<br />
                    点击新增按钮，重新打开一个SQL弹层
                  </template>
                  <template v-else-if="currentField.mode == 2">
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
              <div slot="header">表名：{{ subSubset.name }}</div>
              <div class="sub-subset" slot="body">
                <div class="checkbox-group">
                    <div class="checkbox-group__item" v-for="(field, $index) in subSubset.options" :key="field.name">
                        <label :for="field.name + $index">{{ field.name }}</label>
                        <input :id="field.name + $index" type="checkbox" v-model="subSubset.fields" :value="field.name" />
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
    apiId: [String, Number],
    data: {
      type: Object,
      default: () => ({})
    },
    dataApi: {
      type: Array,
      default: () => []
    },
    filedWay: {
      type: Array,
      default: () => []
    }
  },
  inject: ['dbDefine'],

  data() {
    return {
      // apiId: '',
      tableId: '',
      fields: [],
      dragOptions: {
        list: [],
        clone (data) {
          return data.objectName;
        },
        group: {
          group: 'related-params',
          pull: 'clone',
          put: false,
        }
      }
    }
  },

  watch: {
    apiId (newVal) {
      this.tableId = newVal;
      this.handleGetFields(newVal);
    }
  },

  methods: {
    getData () {
      const fieldMap = {};
      this.fields.forEach(field => {
        fieldMap[field.name] = {
          id: field.id,
          name: field.name,
          type: field.mode,
        }
      })
      return fieldMap;
    },
    handleGetFields (apiId) {
      const currentOption = this.dataApi.find(opt => opt.id === apiId);
      this.fields = currentOption.fields.map((field) => {
        let fieldData = this.data[field.name];
        field.mode = fieldData ? fieldData.type : 0;
        return field;
      });
      this.dragOptions.list = this.fields;
    },
    handleTableChange () {
      this.handleGetFields(this.tableId);
      this.$emit('on-table-change', this.tableId);
      this.$emit('on-mode-change', { mode: 0 });
    },
    handleModeChange (field) {
      this.$emit('on-mode-change', field);
    }
  },

  template: `
      <div class="main-table-fields">
        <div class="table__select">
          <select v-model="tableId" @change="handleTableChange">
            <option value='' disabled selected style='display:none;'>请选择表</option>
            <option v-for="opt in dataApi" :key="opt.name" :value="opt.id">{{ opt.name }}</option>
          </select>
        </div>
        <div class="table-fields">
          <zdraggable v-model="fields" v-bind="dragOptions">
              <div class="table-fields__item" v-for="field in fields">
                <label draggable="true" :data="field.objectName">{{ field.objectName }}</label>
                <select v-model="field.mode" @click="handleModeChange(field)" @change="handleModeChange(field)">
                  <option :value="0" disabled selected style='display:none;'>请选择</option>
                  <option v-for="way in filedWay" :key="way.value" :value="way.value">{{ way.label }}</option>
                </select>
              </div>
          </zdraggable>
        </div>
      </div>
    `
})

Vue.component('relatedParams', {
  props: {
    value: String,
  },
  computed: {
    list: {
      get () {
        let list = this.value ? this.value.split(',') : [];
        return list;
      },
      set (val) {
        this.$emit('input', val.join(','))
      }
    }
  },
  methods: {
    handleChange (data) {
      this.list = Array.from(new Set(data));
    },
    handleRemoveItem (index) {
      this.list.splice(index, 1);
      this.list = Array.from(new Set(this.list));
    },
  },
  template: `
        <div class="related-params">
            <div>关联参数</div>
            <div class="related-params__fields">
              <zdraggable class="related-params__box" group="related-params" :list="list" @change="handleChange">
                <div class="related-fields__item" v-for="(name,$index) in list" :key="name">{{ name }}<i class="button--close" @click="handleRemoveItem($index)"></i></div>
              </zdraggable>
            </div>
        </div>
    `
})

Vue.component('sqlSetting', {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      invalidItemMap: {},
      rules: {
        name: [{ required: true }],
        sql: [{ pattern: /^select [^*]*$/ }]
      },
      inputSqls: [{ name: '', sql: '', dataparam: '' }]
    }
  },
  watch: {
    'data.inputSqls' (newVal) {
      this.inputSqls = newVal || [{ name: '', sql: '', dataparam: '' }];
    }
  },
  methods: {
    validate (fn) {
      let invalid = false;
      this.invalidItemMap = {};
      this.inputSqls.forEach((item, index) => {
        for (let name in item) {
          let rules = this.rules[name];
          if (!rules) return;
          rules.forEach((r) => {
            let value = item[name];
            if (r.required && !value) {
              invalid = true;
              this.$set(this.invalidItemMap, `${index}_${name}`, '不能为空');
            }
            if (r.pattern && !new RegExp(r.pattern).test(value)) {
              invalid = true;
              this.$set(this.invalidItemMap, `${index}_${name}`, '格式不正确');
            }
          })
        }
      });
      fn(!invalid);
    },
    getData() {
      return { inputSqls: this.inputSqls }
    },
    handleAddInputSql (index) {
      this.inputSqls.splice(index + 1, 0, { name: '', sql: '', dataparam: '' })
    },
    handleRemoveInputSql (index) {
      this.inputSqls.splice(index, 1);
    }
  },
  template: `
        <div class="sql-setting">
            <div class="sql-setting__box" v-for="(inputSql, $index) in inputSqls" :key="'inputSql' + $index">
                <div class="sql-setting__left">
                    <related-params v-model="inputSql.dataparam"></related-params>
                </div>
                <div class="sql-setting-form">
                    <div class="sql-setting-form__item">
                        <label>SQL别名</label>
                        <div class="form-item__input">
                          <input type="text" placeholder="请输入SQL别名" v-model="inputSql.name" />
                          <div class="valid-message" v-if="invalidItemMap[$index+'_name']">{{ invalidItemMap[$index+'_name'] }}</div>
                        </div>
                    </div>
                    <div class="sql-setting-form__item">
                        <label>SQL</label>
                        <div class="form-item__textarea">
                          <textarea placeholder="请输入自定义SQL" v-model="inputSql.sql"></textarea>
                          <div class="valid-message" v-if="invalidItemMap[$index+'_sql']">{{ invalidItemMap[$index+'_sql'] }}</div>
                        </div>
                    </div>
                </div>
                <div class="button--remove" @click="handleRemoveInputSql($index)" v-if="inputSqls.length > 1"></div>
                <div class="button--add" @click="handleAddInputSql($index)"></div>
            </div>
        </div>
    `
})

Vue.component('subsetSetting', {
  props: {
    data: [Object],
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
        dataparam: '',
        subFieldsMap: {},
        fields: [],
        options: [],
        wheresql: '',
      }],
    }
  },
  watch: {
    'data.selectTables' (newVal) {
      this.setData(newVal || [{
        name: '',
        dataparam: '',
        subFieldsMap: {},
        fields: [],
        options: [],
        wheresql: '',
      }]);
    }
  },
  methods: {
    getData() {
      return {
        selectTables: this.subsets.map(subset => {
          const subsetTable = this.tables.find(tb => tb.name === subset.name);
          subsetTable.wheresql = subset.wheresql;
          subsetTable.dataparam = subset.dataparam;
          subsetTable.fields = subsetTable.fields.filter((field) => {
            if (~subset.fields.indexOf(field.name)) {
              let subFieldsMap = subset.subFieldsMap[field.name];
              if (field.children && subFieldsMap) {
                field.children = field.children.filter(subfield => ~subFieldsMap.indexOf(subfield.name));
              }
              return true;
            }
            return false;
          });
          return subsetTable;
        })
      }
    },
    setData (data) {
      this.subsets = data.map(subset => {
        const subsetTable = this.tables.find(tb => tb.name === subset.name);
        const subFieldsMap = {};
        subset.fields.forEach((field) => {
          if (field.children && field.children.length) {
            subFieldsMap[field.name] = [];
            field.children.forEach(subfield => {
              subFieldsMap[field.name].push(subfield.name);
            })
          }
        })
        return {
          name: subset.name, // 子集选中表名
          dataparam: subset.dataparam, // 关联参数
          fields: subset.fields.map((f) => f.name), // 子集选中字段
          subFieldsMap: subFieldsMap || {}, // 子集的子集
          wheresql: subset.wheresql, // wheresql
          options: subsetTable.fields, // 子集字段列表
        }
      })
    },
    handleTableChange(subset) {
      const subsetTable = this.tables.find(tb => tb.name === subset.name);
      if (!subsetTable) return false;
      subset.options = subsetTable.fields;
    },
    handleAddSubset (index) {
      this.subsets.splice(index + 1, 0, {
        name: '',
        dataparam: '',
        subFieldsMap: {},
        fields: [],
        options: [],
        wheresql: '',
      })
    },
    handleRemoveSubset (index) {
      this.subsets.splice(index, 1);
    },
    handleFieldChange (field, subset) {
      let subFieldsMap = subset.subFieldsMap;
      if (!subFieldsMap[field.name]) subFieldsMap[field.name] = [];
      let subfields = subFieldsMap[field.name]
      if (field.children && subset.fields.indexOf(field.name) > -1) {
        this.dbDefine.$emit('openPopUp', {
          name: field.name,
          options: field.children,
          fields: subfields,
        })
        this.dbDefine.$on('closePopUp', (fields) => {
          subFieldsMap[field.name] = fields;
        })
      }
    }
  },
  template: `
        <div class="subset-setting">
            <div class="subset-setting__box" v-for="(subset, $index) in subsets" :key="'subset' +  $index">
                <div class="subset-setting__left">
                    <related-params v-model="subset.dataparam"></related-params>
                </div>
                <div class="subset-setting-form">
                    <div class="subset-setting-form__item subset-form__table-name">
                        <select v-model="subset.name" @change="handleTableChange(subset)">
                            <option value='' disabled selected style='display:none;'>请选择表</option>
                            <option v-for="table in tables" :key="table.name" :value="table.name">{{ table.name }}</option>
                        </select>
                    </div>
                    <div class="subset-setting-form__item subset-form__fields">
                        <div class="checkbox-group">
                            <div class="checkbox-group__item" v-for="field in subset.options" :key="field.name">
                                <label :for="field.name + $index">{{ field.name }}</label>
                                <input :id="field.name + $index" type="checkbox" v-model="subset.fields" :value="field.name" @change="handleFieldChange(field, subset)" />
                            </div>
                        </div>
                    </div>
                    <div class="subset-setting-form__item subset-form__wheresql">
                      <label>where</label>
                      <input type="text" v-model="subset.wheresql" />
                    </div>
                </div>
                <div class="button--remove" @click="handleRemoveSubset($index)" v-if="subsets.length > 1"></div>
                <div class="button--add" @click="handleAddSubset($index)"></div>
            </div>
        </div>
    `
})

Vue.component('zdraggable', {
  props: {
    group: [String, Object],
    list: {
      type: Array,
      default: () => []
    },
    clone: Function
  },
  data () {
    return {
      default: {
        put: true,
      }
    }
  },
  computed: {
    config: {
      get () {
        const group = this.group;
        const config = {};
        Object.assign(config, this.default, group ? (typeof group === 'string' ? { group: this.group } : this.group) : {});
        return config;
      }
    },
  },
  watch: {
    list: {
      handler (newVal) {
        console.log(newVal);
      },
      deep: true,
    }
  },
  mounted () {
    this.handleBindEvent();
  },
  methods: {
    handleBindEvent () {
      const $el = this.$el;
      let content = null;
      $el.addEventListener('dragstart', (event) => {
        const index = Array.from($el.childNodes).indexOf(event.target.parentNode);
        if (this.config.pull) {
          if (this.config.pull === 'clone' && this.clone) {
            content = this.clone(this.list[index]);
          } else {
            content = this.list.splice(index, 1);
          }
          const dragContent = JSON.stringify({
            group: this.config.group,
            content,
          })
          event.dataTransfer.setData("dragContent", dragContent);
        }
      })
      $el.addEventListener('drop', (event) => {
        event.preventDefault();
        if (this.config.put) {
          let dragContent = JSON.parse(event.dataTransfer.getData("dragContent"));
          if (dragContent.group === this.config.group) {
            this.list.push(dragContent.content);
            this.$emit('change', this.list)
          }
        }
      })
      $el.addEventListener('dragover', (event) => {
        event.preventDefault();
      })
    },
  },
  template: `
    <div class="z-draggable">
      <slot></slot>
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
      this.$emit('close');
    }
  },
  template: `
    <transition name="dialog-fade">
      <div class="pop-up" v-if="visible" @click.self="handleClose">
        <div class="pop-up__content">
          <div class="pop-up__header">
            <slot name="header"></slot>
          </div>
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

const qsStringify = function (d) {
  let strs = [];
  for (let name in d) {
    strs.push(name + '=' + d[name]);
  }
  return strs.join('&');
}

const request = function (options) {
  let baseUrl = 'http://localhost:8088/';
	let url = `${baseUrl}${options.url}`;
  const method = options.method;
  const config = {};
  config.method = method || 'get';
  if (method.toUpperCase() === 'POST') {
    config.body = JSON.stringify(options.data);
    // config.body = qsStringify(options.data);
  }
  if (options.params) url = url + '?' + qsStringify(options.params);
  config.headers = new Headers({
    'Content-Type': 'application/json'
    // 'Content-Type': 'multipart/form-data'
    // 'Content-Type': 'application/x-www-form-urlencoded'
  })

  return new Promise((resolve, reject) => {
    fetch(url, config)
    .then(response => {
      response.json().then(res => {
        resolve(res);
      })
    })
    .catch(res => {
      reject(res);
    })
  })
}

Vue.prototype.$request = function(options){
  return request(options).then(res => {
    return res;
  });
}

Vue.prototype.$message = {
  success (msg) {
    layui.layer.msg(msg)
  },
  warning (msg) {
    layui.layer.msg(msg)
  },
  error (msg) {
    layui.layer.msg(msg)
  }
}