<script setup>
  import { useI18n } from "vue-i18n";

  const { t, availableLocales, locale } = useI18n();
</script>

<template>
  <select v-model="locale">
    <option v-for="item of availableLocales" :value="item">
      {{ t(`locate.${item}`) }}
    </option>
  </select>
</template>

<style lang="scss" scoped>
  select {
    @apply bg-transparent text-primary h-full;
  }
</style>
