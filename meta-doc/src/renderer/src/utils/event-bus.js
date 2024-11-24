
//事件总线

// 使用 Vue 实例作为事件总线

import mitt from 'mitt'
import './common-data.js'
import {
  current_file_path,
  current_outline_tree,
  current_article,
  current_article_meta_data,
  dump2json,
  init,
  sync
} from './common-data.js'
import { updateRecentDocs } from './settings.js'
import { path } from 'd3'
const ipcRenderer = window.electron.ipcRenderer
const eventBus = mitt()

export default eventBus

//监听save事件
eventBus.on('save', (msg) => {
  //console.log(window.electron)
  if(msg==='auto-save'){
    if(current_file_path.value===''){
      return//如果没有文件路径，不进行自动保存
    }
  }
  sync();
  ipcRenderer.send('save', { json: dump2json(),path:current_file_path.value })
})

eventBus.on('open-doc', async (path) => {
  await init()
  ipcRenderer.send('open-doc',path)
})

eventBus.on('quit', () => {
  ipcRenderer.send('quit')
})

eventBus.on('save-as', () => {
  sync();
  ipcRenderer.send('save-as', { json: dump2json() ,path:''})
})

eventBus.on('new-doc', async () => {
  await init()
})

eventBus.on('export', () => {
  sync();
  ipcRenderer.send('export', { json: dump2json() })
})

eventBus.on('setting',()=>{
  ipcRenderer.send('setting')

})



//监听主进程的事件，转发给事件总线，从而可以在Vue组件中使用
ipcRenderer.on('update-current-path', (event, path) => {
  //console.log('update-current-path', path)
  current_file_path.value = path
})

ipcRenderer.on('save-success', (event, data) => {
  updateRecentDocs(data)
  eventBus.emit('save-success')
})

ipcRenderer.on('save-file-path', (event, path) => {
  eventBus.emit('save-file-path', path)
  current_file_path.value = path
  //路径改变，需要重新保存
})
ipcRenderer.on('export-success', (event, data) => {
  //console.log(data)
  eventBus.emit('export-success', data)
})

ipcRenderer.on('save-triggered',()=>{
  eventBus.emit('save')
})
ipcRenderer.on('save-as-triggered',()=>{
  eventBus.emit('save-as')
})

ipcRenderer.on('open-doc-success', (event, data) => {
  const obj = JSON.parse(data)
  //console.log(obj)
  //console.log(current_file_path)
  current_outline_tree.value = JSON.parse(JSON.stringify(obj.current_outline_tree))
  //console.log(current_outline_tree)
  current_article.value = obj.current_article
  //console.log(current_article)
  current_article_meta_data.value = JSON.parse(JSON.stringify(obj.current_article_meta_data))
  //console.log(current_article_meta_data)
  
  eventBus.emit('open-doc-success', data)
  //eventBus.emit('refresh')
})

// window.electron.onMessageFromMain((event, message) => {
//     console.log('收到来自主进程的消息:', message);
//   });

// //监听所有事件，给所有事件添加日志
// eventBus.onAny((event, ...args) => {
//     console.log('event:', event, 'args:', args);
// });
