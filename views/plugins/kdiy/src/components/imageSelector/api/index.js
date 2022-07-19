export default {
  files: { url: '/goods/attachment/queryPage', method: 'GET' },
  removeFile: { url: '/goods/attachment/delete/', method: 'DELETE' },
  categories: { url: '/goods/attachmentCategory/queryList', method: 'GET' },
  removeCategory: { url: '/goods/attachmentCategory/delete/', method: 'DELETE' },
  saveCategory: { url: '/goods/attachmentCategory/save', method: 'POST' },
  uploadImage: { url: '/goods/attachment/uploadImage', headers: { 'Content-Type': 'multipart/form-data' }, method: 'POST' },
  uploadFile: { url: '/goods/attachment/uploadFile', headers: { 'Content-Type': 'multipart/form-data' }, method: 'POST' }
}
