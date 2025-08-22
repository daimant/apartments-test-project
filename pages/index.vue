<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useApartmentsStore } from '@/stores/apartments'
import Filters from '@/pages/components/filters/Filters.vue'
import ApartmentsTable from '@/pages/components/table/Table.vue'
import IconArrowTop from "@/assets/icons/IconArrowUp.vue";
import { useRoute, useRouter } from 'vue-router'
import { useUrlFilters } from '~/composables/useUrlFilters'

const route = useRoute()
const router = useRouter()
const { getFiltersFromUrl } = useUrlFilters(route, router)
const apartmentsStore = useApartmentsStore()

const showScrollTop = ref(false)

const scrollToTop = () => {
  if (process.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  if (process.client) showScrollTop.value = window.scrollY > 300
}

onMounted(async () => {
  if (process.client) window.addEventListener('scroll', handleScroll)

  await apartmentsStore.loadApartments()

  const urlFilters = getFiltersFromUrl()
  apartmentsStore.applyFiltersFromUrl(urlFilters)

  apartmentsStore.enableUrlSync()
})

onUnmounted(() => {
  if (process.client) window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="app">
    <div class="content">
      <apartments-table />
      <filters class="filters-container" />
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
  max-width: 90rem;
  height: calc(100% - var(--block-padding));
  height: calc(100vh - var(--block-padding));
  max-height: calc(100% - var(--block-padding));
  max-height: calc(100vh - var(--block-padding));

  .content {
    display: grid;
    grid-template-columns: 1fr 25rem;
    gap: 5rem;
    align-items: start;
  }

  .scroll-top-btn {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 3.125rem;
    height: 3.125rem;
    background: var(--secondary-color);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    transition: var(--transition);
    opacity: 0;
    visibility: hidden;
    transform: translateY(1.25rem);

    &.visible {
      opacity: 1;
      visibility: visible;
    }

    &:hover {
      background: color-mix(in srgb, var(--secondary-color) 85%, black 15%);
    }
  }
}

@media (max-width: 80rem) { // 1280px
  .app {
    padding: calc(var(--block-padding) / 2) calc(var(--inline-padding) / 2);

    .content {
      grid-template-columns: 1fr 19.875rem;
      gap: 1.75rem;
    }
  }
}


@media (max-width: 45rem) { // 720px
  .app {
    .content {
      display: flex;

      .filters-container {
        display: none;
      }
    }
  }
}

</style>