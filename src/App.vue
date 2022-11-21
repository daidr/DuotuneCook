<script setup>
  import MessageContainer from "@/components/Message/MessageContainer.vue";
  import { useI18n } from "vue-i18n";
  import Title from "@/components/utils/Title.vue";
  import Header from "@/components/Header.vue";
  import { Icon } from "@iconify/vue";
  import Footer from "@/components/Footer.vue";
  import { computed, reactive, ref, watch } from "vue";
  import { useMessage } from "./components/Message";
  import { useElementSize } from "@vueuse/core";

  const { t } = useI18n();
  const { error, success } = useMessage();

  const presetColors = reactive([
    {
      show: "#2edfff",
      primary: "#6ce2fe",
      secondary: "#4b0083",
      contrast: 0.75,
    },
    {
      show: "#74a6ff",
      primary: "#82a1fc",
      secondary: "#5a0005",
      contrast: 0.75,
    },
    {
      show: "#da74fe",
      primary: "#df7bfc",
      secondary: "#120078",
      contrast: 0.76,
    },
    {
      show: "#c45ff7",
      primary: "#d675fc",
      secondary: "#01330c",
      contrast: 0.94,
    },
    {
      show: "#ef719e",
      primary: "#fb6dc0",
      secondary: "#360060",
      contrast: 0.62,
    },
    {
      show: "#f75269",
      primary: "#fc5c75",
      secondary: "#07134c",
      contrast: 0.76,
    },
    {
      show: "#f2a984",
      primary: "#f8bb9c",
      secondary: "#28007e",
      contrast: 0.71,
    },
    {
      show: "#f6c983",
      primary: "#fcbe5d",
      secondary: "#6a0053",
      contrast: 0.67,
    },
    {
      show: "#fada85",
      primary: "#fce08e",
      secondary: "#0c3760",
      contrast: 0.83,
    },
    {
      show: "#fdf8a0",
      primary: "#fdfaa1",
      secondary: "#650057",
      contrast: 1.0,
    },
    {
      show: "#dde67d",
      primary: "#dbe681",
      secondary: "#4b0079",
      contrast: 0.82,
    },
    {
      show: "#96d35f",
      primary: "#abfe6a",
      secondary: "#0e156f",
      contrast: 0.79,
    },
  ]);

  const currentColor = reactive({
    show: "#2edfff",
    primary: "#6ce2fe",
    secondary: "#4b0083",
    contrast: 0.75,
  });

  watch(currentColor, () => {
    drawImageWithFilterToCanvas();
  });

  const currentActivePresetIndex = computed(() => {
    return presetColors.findIndex((color) => {
      return (
        color.primary === currentColor.primary &&
        color.secondary === currentColor.secondary &&
        color.contrast === currentColor.contrast
      );
    });
  });

  const setPresetColor = ({ primary, secondary, contrast }) => {
    currentColor.primary = primary;
    currentColor.secondary = secondary;
    currentColor.contrast = contrast;
  };

  const hasImage = ref(false);
  const isDragIn = ref(false);

  const OriImgEl = ref();
  const oriImgUrl = ref("");

  const { width } = useElementSize(OriImgEl);

  const currentSliderPosRatio = ref(500);
  const currentPos = computed(() => {
    const ratio = (1000 - currentSliderPosRatio.value) / 1000;
    return width.value * ratio;
  });

  let originImage;

  const fileInputEl = ref();

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    loadFile(file);

    // 清除input的值，这样可以重复选择同一个文件
    fileInputEl.value.value = "";
  };

  const onClick = () => {
    if (hasImage.value) return;
    fileInputEl.value.click();
  };
  const onUploadClick = () => {
    fileInputEl.value.click();
  };
  const onDownloadClick = () => {
    // canvas to blob
    const PreviewCanvasEl = document.getElementById("PreviewCanvas");
    PreviewCanvasEl.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = `preview-${Date.now()}.png`;
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);
    });
  };
  const onDragEnter = (e) => {
    e.preventDefault();
    isDragIn.value = true;
  };
  const onDragOver = (e) => {
    e.preventDefault();
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    isDragIn.value = false;
  };
  const onDrop = (e) => {
    e.preventDefault();
    let file = e.dataTransfer.files[0];

    loadFile(file);
  };

  const loadFile = (file) => {
    // 判断是否为图片
    if (!file.type.includes("image")) {
      error(t("message.error.image"));
      return;
    }

    let reader = new FileReader();

    reader.onload = () => {
      let img = document.createElement("img");
      img.src = reader.result;

      // 判断图片是否加载完成
      img.onload = () => {
        originImage = img;
        oriImgUrl.value = img.src;
        hasImage.value = true;

        setTimeout(() => {
          drawImageWithFilterToCanvas();
        }, 100);
      };

      // 判断图片是否加载失败
      img.onerror = () => {
        error(t("message.error.imageerror"));
      };
    };

    reader.readAsDataURL(file);

    isDragIn.value = false;
  };

  const isSafari =
    /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

  const ctxGrayscale = (ctx) => {
    const imageData = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const v = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      data[i] = data[i + 1] = data[i + 2] = v;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const ctxContrast = (ctx, factor) => {
    const imageData = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    );
    const data = imageData.data;

    const intercept = 128 * (1 - factor);

    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] * factor + intercept;
      data[i + 1] = data[i + 1] * factor + intercept;
      data[i + 2] = data[i + 2] * factor + intercept;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const drawImageWithFilterToCanvas = () => {
    const PreviewCanvasEl = document.getElementById("PreviewCanvas");
    // 如果图片尺寸和canvas尺寸不同，则重新设置canvas尺寸
    if (
      PreviewCanvasEl.width !== originImage.width ||
      PreviewCanvasEl.height !== originImage.height
    ) {
      PreviewCanvasEl.width = originImage.width;
      PreviewCanvasEl.height = originImage.height;
    }

    let offscreenCtx = PreviewCanvasEl.getContext("2d");

    // 设置 grayscale filter
    offscreenCtx.filter = `grayscale(100%) contrast(${currentColor.contrast})`;

    // 绘制图片到 canvas
    offscreenCtx.drawImage(originImage, 0, 0);

    if (isSafari) {
      ctxGrayscale(offscreenCtx);
      ctxContrast(offscreenCtx, currentColor.contrast);
    }

    // 清除 grayscale filter
    offscreenCtx.filter = `none`;

    // 正片叠底 currentColor.primary
    offscreenCtx.globalCompositeOperation = "multiply";
    offscreenCtx.fillStyle = currentColor.primary;
    offscreenCtx.fillRect(0, 0, PreviewCanvasEl.width, PreviewCanvasEl.height);

    // 变亮 currentColor.secondary
    offscreenCtx.globalCompositeOperation = "lighten";
    offscreenCtx.fillStyle = currentColor.secondary;
    offscreenCtx.fillRect(0, 0, PreviewCanvasEl.width, PreviewCanvasEl.height);

    // 重置 globalCompositeOperation
    offscreenCtx.globalCompositeOperation = "source-over";
  };
</script>

<template>
  <div class="main-wrapper">
    <Title title="title.main" />
    <Header></Header>
    <main class="main">
      <div class="toolbar-wrapper" :class="{ disabled: !hasImage }">
        <p class="title">{{ t("page.toolbar.title.presets") }}</p>
        <div class="panel">
          <div class="preset-group">
            <div
              v-for="(colors, index) of presetColors"
              :key="colors"
              class="preset-item"
              :data-primary="colors.primary"
              :style="{
                color: colors.show,
              }"
              :class="{
                active: index === currentActivePresetIndex,
              }"
              @click="setPresetColor(colors)"
            ></div>
          </div>
        </div>
        <br />
        <p class="title">{{ t("page.toolbar.title.config") }}</p>
        <div class="panel">
          <div class="config-group">
            <div class="config-item">
              <div class="key">{{ t("page.toolbar.config.primary") }}</div>
              <div class="value">
                <div class="input-wrapper">
                  <input
                    v-model="currentColor.primary"
                    type="color"
                    :style="{
                      color: currentColor.primary,
                    }"
                  />
                </div>
              </div>
            </div>
            <div class="config-item">
              <div class="key">{{ t("page.toolbar.config.secondary") }}</div>
              <div class="value">
                <div class="input-wrapper">
                  <input
                    v-model="currentColor.secondary"
                    type="color"
                    :style="{
                      color: currentColor.secondary,
                    }"
                  />
                </div>
              </div>
            </div>
            <div class="config-item">
              <div class="key">{{ t("page.toolbar.config.contrast") }}</div>
              <div class="value">
                <input
                  v-model.number="currentColor.contrast"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  :style="{
                    color: currentColor.contrast,
                  }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="preview-wrapper"
        @dragenter="onDragEnter"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
        @click="onClick"
      >
        <input
          type="file"
          ref="fileInputEl"
          @change="onFileChange"
          style="display: none"
          accept="image/*"
        />
        <div v-if="!hasImage" class="protips">
          {{ t("page.preview.protips") }}
        </div>
        <div
          class="drag-border"
          :class="{
            active: isDragIn,
          }"
        ></div>
        <div v-if="hasImage" class="preview-tools">
          <div class="tool-item" @click="onDownloadClick">
            <Icon icon="uil:save"></Icon>
          </div>
          <div class="tool-item" @click="onUploadClick">
            <Icon icon="uil:image-upload"></Icon>
          </div>
        </div>
        <div v-if="hasImage" class="preview-out">
          <div class="preview">
            <!-- 该元素用于撑开容器 -->
            <img :src="oriImgUrl" alt="" class="ori-img" ref="OriImgEl" />
            <div
              class="preview-img"
              :style="{
                right: `${currentPos}px`,
              }"
            >
              <canvas
                id="PreviewCanvas"
                :style="{
                  width: `${width}px`,
                }"
              ></canvas>
            </div>
            <input
              v-model.number="currentSliderPosRatio"
              type="range"
              min="0"
              max="1000"
              class="slider"
            />
            <div
              class="slider-element"
              :style="{
                transform: `translate3d(${-currentPos + 1}px, 0, 0)`,
              }"
            ></div>
          </div>
        </div>
      </div>
    </main>
    <Footer></Footer>
  </div>
  <MessageContainer />
</template>

<style scoped lang="scss">
  .toolbar {
    @apply select-none;
    @apply fixed top-0 right-0 mt-2 mr-2 flex gap-x-2;
    .lang-switch {
      select {
        @apply w-full h-full;
      }
    }
  }

  .main-wrapper {
    @apply max-w-1300px w-full min-h-100vh;
    @apply px-3 md:px-5;
    @apply flex flex-col;

    .main {
      @apply transition my-5 flex-grow;
      @apply gap-5;
      @apply grid grid-cols-12 items-start content-start;

      & > div {
        @apply bg-primary-light;
        @apply rounded-lg md:rounded-xl;
        @apply shadow-lg shadow-primary/10;
        @apply p-3 md:p-5;
      }

      .toolbar-wrapper {
        @apply col-span-12 md:col-span-5 lg:col-span-4;
        @apply md:(sticky top-5);

        &.disabled {
          @apply pointer-events-none filter grayscale-100;
        }

        .title {
          @apply text-lg md:text-lg font-bold;
          @apply ml-4;
          @apply relative select-none;

          &::before {
            content: "";
            @apply absolute -left-2.5 top-0.5 bottom-0.5 w-1;
            @apply rounded-full;
            background: linear-gradient(246deg, #cf010e 50%, #2500ba 50%);
          }
        }

        .panel {
          @apply ml-4 mt-3;

          .preset-group {
            @apply flex flex-wrap gap-4;

            .preset-item {
              @apply w-8 h-8 rounded-full;
              @apply cursor-pointer;
              @apply transition;
              @apply bg-current;
              @apply relative;

              &:hover {
                @apply opacity-80;
              }

              &::after {
                content: "";
                @apply absolute -top-1.2 -left-1.2 -bottom-1.2 -right-1.2;
                @apply rounded-full;
                @apply border-3 border-transparent transition;
              }

              &.active {
                @apply pointer-events-none;

                &::after {
                  @apply border-primary/80;
                }
              }

              &::before {
                content: "";
                @apply absolute top-0 left-0 right-0 bottom-0;
                @apply border-2 border-current rounded-full;
                @apply filter brightness-85;
              }
            }
          }

          .config-group {
            @apply flex flex-col ml-2 gap-2;

            .config-item {
              @apply flex gap-2 items-center;
              .key,
              .value {
                @apply flex justify-center items-center;
              }

              .input-wrapper {
                @apply rounded-full w-30 h-6 overflow-hidden;
                @apply bg-white relative;
                @apply border-2 border-primary;

                input[type="color"] {
                  @apply border-0 p-0 m-0 rounded-none;
                  background-color: transparent;
                  @apply absolute -top-3 -left-3 w-40 h-12 cursor-pointer;
                }
              }
            }
          }
        }
      }

      .preview-wrapper {
        @apply col-span-12 md:col-span-7 lg:col-span-8;

        @apply relative;

        .preview-tools {
          @apply w-full;
          @apply flex justify-end gap-2;
          @apply pb-2 text-xl;

          .tool-item {
            @apply cursor-pointer;
            @apply transition;
            @apply rounded-md;
            @apply bg-primary/10;
            @apply p-2;

            &:hover {
              @apply opacity-80;
            }

            &:active {
              @apply bg-primary text-primary-light;
            }
          }
        }

        .protips {
          @apply text-center text-27px md:text-32px lg:text-36px font-extrabold opacity-30;
          @apply py-15;
          @apply select-none pointer-events-none;
        }

        .drag-border {
          @apply absolute top-3 left-3 right-3 bottom-3;
          @apply transition;
          @apply pointer-events-none;
          @apply border-4 border-dashed border-primary rounded-md md:rounded-lg opacity-0;

          &.active {
            @apply opacity-30;
          }
        }

        .preview-out {
          @apply flex justify-center;
        }

        .preview {
          @apply relative select-none;
          @apply rounded-md overflow-hidden;

          .preview-img {
            @apply z-1 overflow-hidden absolute top-0 left-0 bottom-0;
            @apply pointer-events-none;
          }

          .ori-img {
            @apply pointer-events-none w-full;
          }

          .slider {
            @apply absolute top-0 left-0 bottom-0 w-full z-2 opacity-0;
          }

          .slider-element {
            @apply absolute top-0 bottom-0 right-0 z-3 bg-white w-3px;
            @apply pointer-events-none;
            @apply transform-gpu;
          }
        }
      }
    }
  }
</style>
