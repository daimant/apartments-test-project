<script setup lang="ts">
import SortingTh from "./components/SortingTh.vue";
import { formatPrice } from "@/helpers/formatPrice";

const { filteredApartments, isLoading, apartments } = storeToRefs(useApartmentsStore())
const { loadApartments } = useApartmentsStore()

const loadMoreApartments = async () => {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  await loadApartments()
  isLoading.value = false
}
</script>

<template>
  <div>
    <header class="header">Квартиры</header>

    <div v-if="isLoading && !apartments.length" class="state-message">Данные ещё загружаются…</div>

    <div v-else-if="!isLoading && filteredApartments.length === 0" class="state-message">
      По заданным параметрам ничего не найдено
    </div>

    <table v-else class="apartments-table">
      <thead>
      <tr>
        <th>Планировка</th>
        <th>Квартира</th>
        <th>
          <sorting-th text="S, м²" field="area" />
        </th>
        <th>
          <sorting-th text="Этаж" field="floor" />
        </th>
        <th>
          <sorting-th text="Цена, ₽" field="price" />
        </th>
      </tr>
      <tr class="mobile-header">
        <th>
          <sorting-th text="S, м²" field="area" />
          <sorting-th text="Этаж" field="floor" />
          <sorting-th text="Цена, ₽" field="price" />
        </th>
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

      <tr v-for="apartment in filteredApartments" :key="apartment.id" class="mobile-body">
        <td>
          <div class="text-block">
            <div>{{ apartment.name }}</div>

            <div class="bottom">
              <span>{{ apartment.area }}</span>
              <span>{{ apartment.floor }}<span class="floor-cell-from"> из 17</span></span>
              <span>{{ formatPrice(apartment.price) }}</span>
            </div>
          </div>

          <nuxt-img
            :src="apartment.layoutImage"
            :alt="`Планировка ${apartment.rooms}к`"
            class="layout-image"
          />
        </td>
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
  margin: 0 0 3rem 1rem;
}

.apartments-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
  table-layout: fixed;

  .mobile-header, .mobile-body {
    display: none;
  }

  thead, td {
    box-shadow: 0 0.0625rem 0 0 rgba(0, 0, 0, 0.1); /* 1px */
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
    font-size: 0.875rem;
    background-color: white;
    position: sticky;
    top: 0;
    z-index: 10;
  }
}

.state-message {
  padding: 2rem 1.5rem;
  background: var(--light-gray);
  border-radius: var(--border-radius);
}

.layout-image {
  width: 8.125rem;
  height: 5rem;
  object-fit: contain;
  border-radius: 0.25rem;
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
    border: 0.0625rem solid var(--gray-2);
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

@media (max-width: 90rem) { /* 1440px */
  .apartments-table {
    th, td {
      padding: 0.75rem 1rem;
    }

    thead {
      font-size: 0.82rem;
    }
  }
}

@media (max-width: 60rem) {
  .header {
    margin: 0 0 1.5rem 0;
  }

  .apartments-table {
    thead {
      box-shadow: none;

      tr:not(.mobile-header) {
        display: none;
      }

      .mobile-header {
        display: block;
      }

      th {
        padding: 0.5rem;
        line-height: 1.25rem;
        display: flex;
        width: fit-content;
        white-space: nowrap;
        gap: 1.25rem;
      }
    }

    tbody {
      tr:not(.mobile-body) {
        display: none;
      }

      .mobile-body {
        display: block;

        td {
          font-size: 0.875rem;
          box-shadow: none;
          margin-bottom: 0.25rem;
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          border: 0.0625rem solid rgba(#000, 0.1);
          border-radius: 0.5rem;

          &:first-child {
            margin-top: 0.25rem;
          }

          .text-block {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            text-align: left;

            .bottom {
              display: flex;
              gap: 1.25rem;
            }
          }
        }
      }
    }
  }
}

</style>