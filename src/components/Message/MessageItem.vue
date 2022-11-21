<script setup>
  defineProps({
    text: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
  });
</script>

<template>
  <div class="message-item">
    <div v-if="icon" class="message-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        width="1.2em"
        height="1.2em"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
      >
        <!-- info -->
        <path
          v-if="icon === 'info'"
          fill="currentColor"
          d="M3 3h2v18H3V3zm16 0H5v2h14v14H5v2h16V3h-2zm-8 6h2V7h-2v2zm2 8h-2v-6h2v6z"
        />
        <!-- error -->
        <path
          v-else-if="icon === 'error'"
          fill="currentColor"
          d="M5 3H3v18h18V3H5zm14 2v14H5V5h14zm-8 4H9V7H7v2h2v2h2v2H9v2H7v2h2v-2h2v-2h2v2h2v2h2v-2h-2v-2h-2v-2h2V9h2V7h-2v2h-2v2h-2V9z"
        />
        <!-- warn -->
        <path
          v-else-if="icon === 'warn'"
          fill="currentColor"
          d="M14 4V2h-4v2H5v2h14V4h-5zm5 12H5v-4H3v6h5v4h2v-4h4v2h-4v2h6v-4h5v-6h-2V6h-2v8h2v2zM5 6v8h2V6H5z"
        />
        <!-- success -->
        <path
          v-else-if="icon === 'success'"
          fill="currentColor"
          d="M17 3H7v2H5v2H3v10h2v2h2v2h10v-2h2v-2h2V7h-2V5h-2V3zm0 2v2h2v10h-2v2H7v-2H5V7h2V5h10zm-9 6h2v2h2v2h-2v-2H8v-2zm8-2h-2v2h-2v2h2v-2h2V9z"
        />
      </svg>
    </div>
    <span>{{ text }}</span>
  </div>
</template>

<style lang="scss" scoped>
  .message-item {
    @apply transition-all;

    @apply select-none;
    @apply my-1;

    &:deep(.mcframe__main) {
      @apply text-primary px-3 py-1;
      @apply flex space-x-1 items-center;
    }

    .message-icon {
      @apply text-primary inline-block mr-1 leading-0;
    }
  }
</style>
