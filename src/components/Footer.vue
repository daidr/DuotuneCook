<script setup>
  import { useI18n } from "vue-i18n";
  import { Icon } from "@iconify/vue";

  const { t } = useI18n();
</script>

<template>
  <div class="footer">
    <span>
      Coded by&nbsp;
      <a href="https://github.com/daidr" target="_blank">
        <Icon icon="uil:external-link-alt" />
        DaiDR
      </a>
      &nbsp;with&nbsp;<Icon icon="mdi:heart" />
    </span>
  </div>
</template>

<style lang="scss" scoped>
  .footer {
    @apply flex justify-center;
    @apply text-xs sm:text-sm md:text-base;
    @apply mb-3 md:mb-4 mt-2;

    span {
      @apply flex items-center;
    }

    a {
      @apply inline-flex items-center gap-x-1;
      @apply text-primary/50;
      @apply underline underline-dashed underline-opacity-0 underline-transparent;

      &:hover {
        @apply underline-current;
      }
    }
  }
</style>
