<script setup lang="ts">
const { filteredApartments, isLoading } = storeToRefs(useApartmentsStore())
const { loadApartments } = useApartmentsStore()

const loadMoreApartments = async () => {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  await loadApartments()
  isLoading.value = false
}

const formatPrice = (price: number): string => new Intl.NumberFormat('ru-RU').format(price)
</script>

<template>
  <div class="table-section">
    <div class="table-container">
      <table class="apartments-table">
        <thead>
        <tr>
          <th>Планировка</th>
          <th>Квартира</th>
          <th>S, м²</th>
          <th>Этаж</th>
          <th>Цена, ₽</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="apartment in filteredApartments" :key="apartment.id">
          <td class="layout-cell">
            <img
              :src="apartment.layoutImage"
              :alt="`Планировка ${apartment.rooms}к`"
              class="layout-image"
            />
          </td>
          <td class="name-cell">{{ apartment.name }}</td>
          <td class="area-cell">{{ apartment.area }}</td>
          <td class="floor-cell">{{ apartment.floor }}</td>
          <td class="price-cell">{{ formatPrice(apartment.price) }}</td>
        </tr>
        </tbody>
      </table>

      <div class="load-more">
        <button
          @click="loadMoreApartments"
          class="load-more-btn"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Загрузка...' : 'Загрузить еще' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.table-section {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.table-container {
  padding: 1.5rem;
}

.apartments-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
  table-layout: fixed;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }

  th {
    background-color: var(--light-gray);
    font-weight: 600;
    color: var(--primary-color);
    position: sticky;
    top: 0;
    z-index: 10;

    tbody tr:hover {
      background-color: var(--light-gray);
      transition: var(--transition);
    }
  }
}


.layout-cell {
  width: 100px;
  max-width: 100px
}

.layout-image {
  width: 130px;
  height: 80px;
  object-fit: contain;
  border-radius: 4px;
}

.name-cell,
.area-cell,
.floor-cell {
  width: 80px;
  text-align: center;
  font-weight: 500;
}

.price-cell {
  width: 120px;
  text-align: right;
  font-weight: 600;
  color: var(--accent-color);
}

.load-more {
  text-align: center;
  padding: 2rem 0 1rem;
}

.load-more-btn {
  background: var(--secondary-color);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.load-more-btn:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.load-more-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
}
</style>