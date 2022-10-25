export const PAGE_CONFIG = {
  list: [
    {
      title: '页面名称',
      type: 'Input',
      key: 'pageTitle',
    },
    {
      title: '搜索配置',
      type: 'Checkbox',
      key: 'search',
      data: [
        {
          key: 'input',
          title: '输入框',
        },
        {
          key: 'select',
          title: '下拉框',
        },
        {
          key: 'rangePicker',
          title: '时间范围选择',
        },
        {
          key: 'cascader',
          title: '级联选择',
        },
        {
          key: 'timePicker',
          title: '时间选择',
        },
        {
          key: 'monthPicker',
          title: '月份选择',
        },
        {
          key: 'treeSelect',
          title: '树选择',
        },
      ],
    },
    {
      title: '表格配置',
      type: 'Checkbox',
      key: 'table',
      data: [
        {
          key: 'delete',
          title: '删除功能',
        },
        {
          key: 'wordScale',
          title: '文字缩略',
        },
      ],
    },
  ],
  operate: [
    {
      title: '页面名称',
      type: 'Input',
      key: 'pageTitle',
    },
    {
      title: '表单配置',
      type: 'Checkbox',
      key: 'form',
      data: [
        {
          key: 'input',
          title: '输入框',
        },
        {
          key: 'inputNumber',
          title: '数字输入框',
        },
        {
          key: 'priceInput',
          title: '金额输入框',
        },
        {
          key: 'select',
          title: '下拉框',
        },
        {
          key: 'rangePicker',
          title: '时间范围选择',
        },
        {
          key: 'uploadImage',
          title: '上传图片',
        },
        {
          key: 'timePicker',
          title: '时间选择',
        },
      ],
    },
  ],
  detail: [
    {
      title: '页面名称',
      type: 'Input',
      key: 'pageTitle',
    },
  ],
}
