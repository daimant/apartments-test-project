<script setup lang="ts">
import RangeSlider from "./RangeSlider.vue";

const { filters } = storeToRefs(useApartmentsStore())
const { resetFilters } = useApartmentsStore()

const selectRooms = (rooms: number) => {
  filters.value.selectedRooms = filters.value.selectedRooms === rooms ? null : rooms
}
</script>

<template>
  <div class="filters-section">
      <div class="rooms-filter">
        <h4>Количество комнат</h4>
        <div class="rooms-tabs">
          <button
            v-for="room in [1, 2, 3, 4]"
            :key="room"
            @click="selectRooms(room)"
            :class="['room-tab', { active: filters.selectedRooms === room }]"
          >
            {{ room }}к
          </button>
        </div>
      </div>

      <div v-if='filters.priceRange' class="price-filter">
        <h4>Стоимость квартиры, ₽</h4>
        <RangeSlider
          v-model="filters.priceRange"
          :min="filters.priceRange.minLimit"
          :max="filters.priceRange.maxLimit"
          for-price
        />
      </div>

      <div v-if="filters.areaRange" class="area-filter">
        <h4>Площадь, м²</h4>
        <RangeSlider
          v-model="filters.areaRange"
          :min="filters.areaRange.minLimit"
          :max="filters.areaRange.maxLimit"
        />
      </div>

      <!-- Кнопка сброса фильтров -->
      <button @click="resetFilters" class="reset-filters-btn">
        Сбросить параметры
      </button>
  </div>
</template>

<style scoped lang="scss">
.filters-section {
  position: sticky;
  top: 2rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
}

.filters-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  text-align: center;
}


.rooms-filter {
  margin-bottom: 2rem;
}

.rooms-filter h4 {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.rooms-tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.room-tab {
  background: var(--light-gray);
  border: 1px solid var(--border-color);
  padding: 0.75rem 0.5rem;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  text-align: center;
}

.room-tab:hover {
  background: #e9ecef;
  border-color: var(--secondary-color);
}

.room-tab.active {
  background: var(--secondary-color);
  color: white;
  border-color: var(--secondary-color);
}


.price-filter,
.area-filter {
  margin-bottom: 2rem;
}

.price-filter h4,
.area-filter h4 {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: var(--text-color);
}


.reset-filters-btn {
  width: 100%;
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.reset-filters-btn:hover {
  background: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
}
</style>