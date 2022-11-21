import { h, render } from 'vue'
import { ENV_MODE } from '@/utils/env'
import Modal from './Modal.vue'

const createAlertModal = ({
  title = '提示',
  content = '',
  okText = '确认',
  cancelText = '取消',
  hideOk = false,
  hideCancel = false,
  centerContent = false,
  mask = true,
  onOk = () => { },
  onCancel = () => { },
}) => {
  const container = document.createElement('div')
  const vnode = h(Modal, {
    title,
    content,
    okText,
    cancelText,
    hideOk,
    hideCancel,
    centerContent,
    dynamic: true,
    visible: true,
    renderToBody: false,
    mask,
    onOk,
    onCancel
  })
  render(vnode, container)
  document.body.appendChild(container)
  return vnode;
}

const createPromptModal = ({
  title = '提示',
  content = '',
  okText = '确认',
  cancelText = '取消',
  hideOk = false,
  hideCancel = false,
  placeholder = '',
  centerContent = false,
  autoClose = true,
  mask = true,
  onOk = () => { },
  onCancel = () => { }
}) => {
  const container = document.createElement('div')
  let inputResult = ''
  const input = h('input', {
    placeholder,
    class:
      'bg-white w-full px-2 py-1 rounded-md outline-transparent transition border-red-800 border-2',
    onInput: (e) => {
      inputResult = e.target.value
    }
  })
  const vnode = h(
    Modal,
    {
      title,
      content,
      okText,
      cancelText,
      hideOk,
      hideCancel,
      autoClose,
      centerContent,
      mask,
      dynamic: true,
      visible: true,
      renderToBody: false,
      onOk: () => {
        onOk({ modal: vnode, methods: vnode.component.exposed }, inputResult)
      },
      onCancel: () => {
        onCancel({ modal: vnode, methods: vnode.component.exposed }, inputResult)
      }
    },
    {
      default: () => [h('p', { class: 'text-red-800' }, content), input]
    }
  )
  render(vnode, container)
  document.body.appendChild(container)
  return vnode;
}

const createCustomModal = ({
  title = '提示',
  content = '',
  okText = '确认',
  cancelText = '取消',
  hideOk = false,
  hideCancel = false,
  centerContent = false,
  autoClose = true,
  mask = true,
  moveable = false,
  isLoading = false,
  onOk = () => { },
  onCancel = () => { }
}) => {
  const container = document.createElement('div')
  const vnode = h(
    Modal,
    {
      title,
      okText,
      cancelText,
      hideOk,
      hideCancel,
      autoClose,
      centerContent,
      moveable,
      mask,
      isLoading,
      dynamic: true,
      visible: true,
      renderToBody: false,
      onOk: () => {
        onOk({ modal: vnode, methods: vnode.component.exposed }, content)
      },
      onCancel: () => {
        onCancel({ modal: vnode, methods: vnode.component.exposed }, content)
      }
    },
    {
      default: () => content
    }
  )
  render(vnode, container)
  document.body.appendChild(container)
  return vnode;
}

// export to window.debug if in debug mode
if (ENV_MODE !== 'production') {
  window.debug = {
    ...(window.debug || {}),
    modal: {
      createAlertModal,
      createPromptModal,
      createCustomModal
    }
  }
}

export { createAlertModal, createPromptModal, createCustomModal }
