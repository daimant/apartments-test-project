<script setup lang="ts">
import SortingTh from "./components/SortingTh.vue";

const { filteredApartments, isLoading, sortField, sortDirection } = storeToRefs(useApartmentsStore())
const { loadApartments, setSort } = useApartmentsStore()

const loadMoreApartments = async () => {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  await loadApartments()
  isLoading.value = false
}

const formatPrice = (price: number): string => new Intl.NumberFormat('ru-RU').format(price)
</script>

<template>
  <div>
    <header class="header">Квартиры</header>

    <table class="apartments-table">
      <thead>
      <tr>
        <th>Планировка</th>
        <th>Квартира</th>
        <sorting-th
          text="S, м²"
          field="area"
          :active-field="sortField"
          :direction="sortDirection"
          @sort="setSort"
        />
        <sorting-th
          text="Этаж"
          field="floor"
          :active-field="sortField"
          :direction="sortDirection"
          @sort="setSort"
        />
        <sorting-th
          text="Цена, ₽"
          field="price"
          :active-field="sortField"
          :direction="sortDirection"
          @sort="setSort"
        />
      </tr>
      </thead>
      <tbody>
      <tr v-for="apartment in filteredApartments" :key="apartment.id">
        <td class="layout-cell">
          <nuxt-img
            :src="apartment.layoutImage"
            :alt="`Планировка ${apartment.rooms}к`"
            class="layout-image"
          />
        </td>
        <td>{{ apartment.name }}</td>
        <td>{{ apartment.area }}</td>
        <td>
          {{ apartment.floor }}
          <span class="floor-cell-from"> из 17</span>
        </td>
        <td>{{ formatPrice(apartment.price) }}</td>
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
</template>

<style scoped lang="scss">

.header {
  font-size: 3.4rem;
  line-height: 1;
  font-weight: 700;
  margin-bottom: 3rem;
}

.apartments-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
  table-layout: fixed;

  thead, td {
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
  }

  th, td {
    padding: 1rem 1.5rem;
    text-align: left;
  }

  td {
    &:first-child {
      padding-inline: 0;
      text-align: center;
    }
  }

  th {
    user-select: none;
    font-weight: 400;
  }

  thead {
    font-size: 0.88rem;
    background-color: white;
    position: sticky;
    top: 0;
    z-index: 10;
  }
}

.layout-image {
  width: 130px;
  height: 80px;
  object-fit: contain;
  border-radius: 4px;
}

.floor-cell-from {
  color: var(--gray)
}

.load-more {
  padding-block: 2.5rem;

  &-btn {
    padding: 0.5rem 1.5rem;
    border-radius: 1.5rem;
    font-size: 1rem;
    border: 1px solid var(--gray-2);
    cursor: pointer;
    transition: var(--transition);
    background-color: white;

    &:hover:not(:disabled) {
      background-color: var(--light-gray)
    }

    :disabled {
      background: #bdc3c7;
      cursor: not-allowed;
      transform: none;
    }
  }
}

</style>