<script setup>
  import MessageContainer from "@/components/Message/MessageContainer.vue";
  import { useI18n } from "vue-i18n";
  import Title from "@/components/utils/Title.vue";
  import Header from "@/components/Header.vue";
  import Footer from "@/components/Footer.vue";

  const { t } = useI18n();
</script>

<template>
  <div class="main-wrapper">
    <Title title="title.main" />
    <Header></Header>
    <main class="main">
      <div class="toolbar-wrapper">
        <p class="title">预设</p>
      </div>
      <div class="preview-wrapper"></div>
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
      @apply grid grid-cols-12 items-start;

      & > div {
        @apply bg-primary-light;
        @apply rounded-lg md:rounded-xl;
        @apply shadow-lg shadow-primary/10;
        @apply p-3;
      }

      .toolbar-wrapper {
        @apply col-span-12 md:col-span-5 lg:col-span-4;

        .title {
          @apply text-lg md:text-lg;
          @apply font-bold;
        }
      }

      .preview-wrapper {
        @apply col-span-12 md:col-span-7 lg:col-span-8;
      }
    }
  }
</style>
