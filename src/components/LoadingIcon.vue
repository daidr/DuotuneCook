<template>
  <div class="loading-wrapper">
    <div class="loading-items"></div>
    <div class="loading-items"></div>
    <div class="loading-items"></div>
  </div>
</template>

<style lang="scss" scoped>
.loading-wrapper {
  @apply w-0.9em h-1.2em;
  @apply flex gap-x-0.1em items-center;

  @keyframes loading {
    0% {
      height: 40%;
    }

    100% {
      height: 100%;
    }
  }

  .loading-items {
    @apply w-full;
    @apply bg-current;
    animation: loading 0.6s ease-in-out infinite alternate both;

    &:nth-of-type(1) {
      animation-delay: 0.2s;
    }

    &:nth-of-type(2) {
      animation-delay: 0.4s;
    }

    &:nth-of-type(3) {
      animation-delay: 0.6s;
    }
  }
}
</style>
