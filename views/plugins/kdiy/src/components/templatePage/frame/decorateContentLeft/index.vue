<template>
  <div class="decorate-content-left">
    <div class="left-item" v-for="(item, index) in collists" :key="index" :class="{ collapse: item.collapse }" :style="{ height: item.collapse ? '34px' : item.height }">
      <div class="item-listname pointer" @click="handleToggleList(item)">
        {{item.name}}
        <i class="el-icon-arrow-down"></i>
      </div>
      <div class="item-listcontent">
        <div class="listitem pointer" v-for="config in item.tools" :key="config.type" @click="handleAddItem(config.type)">
          <IconSvg :svgid="config.icon"></IconSvg>
          <span>{{config.name}}</span>
          <p>{{config.limit.count}}<template v-if="config.limit.max > 0">/{{config.limit.max}}</template></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tools, toolConfigs } from '../../tools';
import IconSvg from "../../components/iconSvg";
import IconLists from "../../otherComponents/IconList/IconList";
import _ from '@/utils/utils';

export default {
  components: { IconSvg, IconLists },

  data () {
    return {
      collists: [],
      configs: {},
    }
  },

  inject: ['diypage'],

  created () {
    this.handleInitTools();
  },

  methods: {
    // 初始化工具列表
    handleInitTools () {
      console.log(tools, toolConfigs);
      const collists = _.deepClone(tools);
      const configs = _.deepClone(toolConfigs);
      collists.forEach((v, i) => {
        let num = Math.ceil(v.tools.length / 3);
        // 66 + 15 = 81 34 + 15 = 49
        v.height = num * 81 + 49 + 'px';

        v.tools = v.tools.map(name => {
          return configs[name];
        })
      });
      this.collists = collists;
      this.configs = configs;
      console.log('handleInitTools', this.collists);
    },
    // 工具栏切换显示状态
    handleToggleList (item) {
      item.collapse = !item.collapse;
    },
    handleAddItem (type, item) {
      const config = this.configs[type];
      const limit = config.limit;
      if (limit) {
        if (limit.max && limit.count === limit.max) return false;
        limit.count++;
      }
      const model = item ? item.model : _.deepClone(config.model);

      const newItem = {
        id: Date.now(),
        components: config.type,
        model,
        limit: config.limit,
        showConfirm: false,
        selected: false,
      }
      this.diypage.handleAddItem(newItem);
      this.diypage.handleSelectItem(newItem);

      console.log('this.diypage', this.diypage, newItem);
    },
  },
}
</script>