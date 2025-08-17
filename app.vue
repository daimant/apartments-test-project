<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useApartmentsStore } from './stores/apartments'
import Filters from './components/Filters.vue'
import ApartmentsTable from './components/Table.vue'

const apartmentsStore = useApartmentsStore()

const showScrollTop = ref(false)

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  apartmentsStore.loadApartments()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div>
    <header class="header">Квартиры</header>

    <main class="main">
      <div class="container">
        <div class="content">
          <apartments-table/>
          <filters/>
        </div>
      </div>
    </main>

    <button
      v-show="showScrollTop"
      @click="scrollToTop"
      class="scroll-top-btn"
      :class="{ visible: showScrollTop }"
    >
      ↑
    </button>
  </div>
</template>

<style scoped lang="scss">
.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
}

.main {
  padding: 2rem 0;
}

.content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: start;
}

.header {
  font-size: 2.5rem;
  font-weight: 600;
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
  box-shadow: var(--shadow);
  transition: var(--transition);
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
}

.scroll-top-btn.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.scroll-top-btn:hover {
  background: #2980b9;
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}
</style>