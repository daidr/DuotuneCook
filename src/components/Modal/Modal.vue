<script setup>
  import { ref, watch, onMounted, onUnmounted } from "vue";
  import LoadingIcon from "../LoadingIcon.vue";
  import { setThemeColor, setThemeColorToDefault } from "@/utils/_";

  const props = defineProps({
    /**
     * 是否可见
     */
    visible: {
      type: Boolean,
      default: false,
    },
    visibleModifiers: {
      type: Object,
      default: () => ({}),
    },
    /**
     * 确认按钮文本
     */
    okText: {
      type: String,
      default: "确认",
    },
    /**
     * 取消按钮文本
     */
    cancelText: {
      type: String,
      default: "取消",
    },
    /**
     * 按下按钮后是否关闭对话框
     */
    autoClose: {
      type: Boolean,
      default: true,
    },
    /**
     * 对话框内容
     */
    content: {
      type: String,
      default: "",
    },
    /**
     * 对话框内容是否居中
     */
    centerContent: {
      type: Boolean,
      default: false,
    },
    /**
     * 对话框标题
     */
    title: {
      type: String,
      default: "提示",
    },
    /**
     * 是否隐藏取消按钮
     */
    hideCancel: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否隐藏确认按钮
     */
    hideOk: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否显示遮罩
     */
    mask: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否渲染到body元素
     */
    renderToBody: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否处于加载状态
     */
    isLoading: {
      type: [Boolean, Object],
      default: false,
    },
    dynamic: {
      type: Boolean,
      default: false,
    },
    moveable: {
      type: Boolean,
      default: false,
    },
  });

  const _isLoading = ref(props.isLoading);

  watch(
    () => props.isLoading,
    (newVal) => {
      _isLoading.value = newVal;
    }
  );

  const modalEl = ref();

  const emit = defineEmits(["cancel", "ok", "open", "close", "update:visible"]);

  const _visible = !props.visibleModifiers["model"]
    ? ref(props.visible)
    : computed({
        get() {
          return props.visible;
        },
        set(value) {
          emit("update:visible", value);
        },
      });

  const close = () => {
    _visible.value = false;
    if (props.dynamic) {
      unmountedHandler();
      modalEl.value.parentNode &&
        modalEl.value.parentNode.parentNode &&
        modalEl.value.parentNode.parentNode.removeChild(
          modalEl.value.parentNode
        );
    }
  };

  const open = () => {
    _visible.value = true;
  };

  const onCancelButtonClick = () => {
    if (!_visible.value) return;
    if (_isLoading.value) return;
    emit("cancel");
    if (props.autoClose && !_isLoading.value) {
      close();
    }
  };

  const onOkButtonClick = () => {
    if (!_visible.value) return;
    emit("ok");
    if (props.autoClose) {
      close();
    }
  };

  const handleOpen = () => {
    if (_visible.value) {
      emit("open");
    }
  };

  if (props.mask) {
    setThemeColor("#ccc");
  }

  const handleClose = () => {
    if (!_visible.value) {
      emit("close");
      if (props.mask) {
        setThemeColorToDefault();
      }
    }
  };

  const onEscKeyUp = (e) => {
    if (e.keyCode === 27) {
      onCancelButtonClick();
    }
  };

  onMounted(() => {
    document.addEventListener("keyup", onEscKeyUp);
    document.addEventListener("pointermove", onMovePointerMove);
    document.addEventListener("pointerup", onMovePointerUp);
    addEventListener("resize", onWindowResize);
  });

  const unmountedHandler = () => {
    document.removeEventListener("keyup", onEscKeyUp);
    document.removeEventListener("pointermove", onMovePointerMove);
    document.removeEventListener("pointerup", onMovePointerUp);
    removeEventListener("resize", onWindowResize);
  };

  onUnmounted(unmountedHandler);

  const setLoadingState = (state) => {
    _isLoading.value = state;
  };

  const modalContainerEl = ref();
  let pointerId = -1;
  const moveX = ref(0);
  const moveY = ref(0);

  const onWindowResize = () => {
    if (!props.moveable) return;
    const screenW =
      (window.innerWidth - modalContainerEl.value.offsetWidth) / 2;
    const screenH =
      (window.innerHeight - modalContainerEl.value.offsetHeight) / 2;

    if (moveX.value > screenW) {
      moveX.value = screenW;
    } else if (moveX.value < -screenW) {
      moveX.value = -screenW;
    }
    if (moveY.value > screenH) {
      moveY.value = screenH;
    } else if (moveY.value < -screenH) {
      moveY.value = -screenH;
    }
  };

  const onMovePointerDown = (e) => {
    if (!props.moveable) return;
    if (pointerId !== -1) return;
    pointerId = e.pointerId;
  };

  const onMovePointerMove = (e) => {
    if (!props.moveable) return;
    if (e.pointerId !== pointerId) return;
    moveX.value += e.movementX;
    moveY.value += e.movementY;
    const screenW =
      (window.innerWidth - modalContainerEl.value.offsetWidth) / 2;
    const screenH =
      (window.innerHeight - modalContainerEl.value.offsetHeight) / 2;

    if (moveX.value > screenW) {
      moveX.value = screenW;
    } else if (moveX.value < -screenW) {
      moveX.value = -screenW;
    }
    if (moveY.value > screenH) {
      moveY.value = screenH;
    } else if (moveY.value < -screenH) {
      moveY.value = -screenH;
    }
  };

  const onMovePointerUp = (e) => {
    if (!props.moveable) return;
    if (pointerId !== e.pointerId) return;
    pointerId = -1;
  };

  defineExpose({ close, open, setLoadingState });
</script>

<template>
  <teleport to="#teleports" :disabled="!renderToBody">
    <transition
      name="fade"
      @after-enter="handleOpen"
      @after-leave="handleClose"
    >
      <div v-if="_visible" ref="modalEl" class="modal">
        <div v-if="mask" class="mask" @click="onCancelButtonClick"></div>
        <div
          class="transform-container"
          :style="{ transform: `translate(${moveX}px,${moveY}px)` }"
        >
          <div
            ref="modalContainerEl"
            class="modal-container"
            :class="{ moveable }"
          >
            <div class="title" @pointerdown="onMovePointerDown">
              <slot name="header">
                <div class="title-default">{{ title }}</div>
              </slot>
            </div>
            <div class="content" :class="{ center: centerContent }">
              <slot>{{ content }}</slot>
            </div>
            <div v-if="!hideCancel || !hideOk" class="buttons">
              <div
                v-if="!hideCancel"
                class="cancel-btn"
                :class="{ hide: _isLoading }"
                @click="onCancelButtonClick"
              >
                {{ cancelText }}
              </div>
              <div
                v-if="!hideOk"
                class="ok-btn"
                :class="{ loading: _isLoading }"
                @click="onOkButtonClick"
              >
                <LoadingIcon v-if="_isLoading" />
                {{ _isLoading ? "" : okText }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style lang="scss" scoped>
  .modal {
    @apply z-91 fixed;

    .mask {
      @apply fixed top-0 left-0 right-0 bottom-0 bg-black/20;
    }

    .transform-container {
      @apply fixed top-0 left-0 right-0 bottom-0 pointer-events-none;
    }

    .modal-container {
      @apply max-h-85vh pointer-events-auto;
      @apply fixed top-1/2 left-1/2 min-w-xs sm: min-w-sm md:max-w-3xl lg:max-w-4xl transform-gpu -translate-x-1/2 -translate-y-1/2;

      &:deep(.mcframe__main) {
        @apply p-5;
        @apply flex flex-col;
      }

      .title {
        @apply pb-2 font-bold select-none;

        .title-default {
          @apply text-2xl text-primary text-center;
        }
      }

      &.moveable {
        .title {
          @apply cursor-move;
        }
      }

      .content {
        @apply text-lg text-primary/80 whitespace-pre-wrap;
        @apply overflow-auto;

        &.center {
          @apply text-center;
        }
      }

      .buttons {
        @apply flex justify-end space-x-4 mt-3;

        .cancel-btn,
        .ok-btn {
          @apply cursor-pointer transition select-none transform-gpu;

          &:deep(.mcbutton__main) {
            @apply px-6 py-1;
          }
        }

        .cancel-btn {
          @apply pointer-events-auto;

          &.hide {
            @apply opacity-0 pointer-events-none;
          }
        }

        .ok-btn {
          @apply flex items-center;

          &.loading {
            @apply opacity-50 pointer-events-none;
            @apply text-2xl;
          }
        }
      }
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
