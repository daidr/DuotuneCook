<script setup>
  import { useI18n } from "vue-i18n";
  import LangSwitch from "./LangSwitch.vue";
  import { Icon } from "@iconify/vue";

  const { t } = useI18n();
</script>

<template>
  <div class="header">
    <div class="main">
      <div class="left">
        <img src="@/assets/images/logo.png" alt="" />{{ t("title.main") }}
      </div>
      <div class="right" id="header-slot"></div>
    </div>
    <div class="lang-switch">
      <LangSwitch />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .header {
    @apply h-40px md:h-50px text-lg md:text-xl;
    @apply select-none;
    @apply flex gap-x-2;
    @apply mt-3 md:mt-5;
    @apply flex-shrink-0;

    .main {
      @apply flex-grow;
      @apply flex justify-between items-center;
      @apply px-2 sm:px-5 md:px-10;

      .left {
        @apply flex justify-center items-center gap-x-1;
        @apply font-bold;

        img {
          @apply w-1.3em h-1.3em pointer-events-none;
        }
      }
    }

    .lang-switch {
      @apply flex justify-between items-center;
      @apply px-1 md:px-2;
      @apply text-base md:text-lg;
    }

    .main,
    .lang-switch {
      @apply bg-primary-light;
      @apply rounded-lg md:rounded-xl;
      @apply shadow-lg shadow-primary/10;
    }
  }
</style>
