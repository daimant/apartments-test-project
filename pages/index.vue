<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useApartmentsStore } from '@/stores/apartments'
import Filters from '@/pages/components/filters/Filters.vue'
import ApartmentsTable from '@/pages/components/table/Table.vue'
import IconArrowTop from "@/assets/icons/IconArrowUp.vue";

const apartmentsStore = useApartmentsStore()

const showScrollTop = ref(false)

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  await apartmentsStore.loadApartments()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="app">
    <div class="content">
      <apartments-table />
      <filters />
    </div>

    <button
        v-show="showScrollTop"
        @click="scrollToTop"
        class="scroll-top-btn"
        :class="{ visible: showScrollTop }"
    >
      <icon-arrow-top />
    </button>
  </div>
</template>

<style scoped lang="scss">
.app {
  padding: var(--block-padding) var(--inline-padding);
  margin: 0 auto;
  max-width: 1440px;
  height: calc(100% - var(--block-padding));
  height: calc(100vh - var(--block-padding));
  max-height: calc(100% - var(--block-padding));
  max-height: calc(100vh - var(--block-padding));

  .content {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 5rem;
    align-items: start;
  }

  .scroll-top-btn {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    background: var(--secondary-color);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    transition: var(--transition);
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);

    &.visible {
      opacity: 1;
      visibility: visible;
    }

    &:hover {
      background: color-mix(in srgb, var(--secondary-color) 85%, black 15%);
    }
  }
}

</style>