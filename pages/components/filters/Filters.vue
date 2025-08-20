<script setup lang="ts">
import RangeSlider from "./components/RangeSlider.vue";
import IconCross from "@/assets/icons/IconCross.vue";

const { filters } = storeToRefs(useApartmentsStore())
const { resetFilters } = useApartmentsStore()

const selectRooms = (rooms: number) => {
  filters.value.selectedRooms = filters.value.selectedRooms === rooms ? null : rooms
}

const updateRange = (type: 'priceRange' | 'areaRange', value: { min: number; max: number }) => {
  filters.value[type] = {
    ...filters.value[type],
    min: value.min,
    max: value.max
  }
}
</script>

<template>
  <div class="filters-section">
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

    <div v-if="filters.priceRange" class="filter-container">
      <div>Стоимость квартиры, ₽</div>
      <RangeSlider
        :modelValue="filters.priceRange"
        @update:modelValue="val => updateRange('priceRange', val)"
      />
    </div>

    <div v-if="filters.areaRange" class="filter-container">
      <div>Площадь, м²</div>
      <RangeSlider
        :modelValue="filters.areaRange"
        @update:modelValue="val => updateRange('areaRange', val)"
      />
    </div>

    <div class="reset-filters-btn-container">
      <button @click="resetFilters" class="reset-filters-btn">
        Сбросить параметры
        <IconCross/>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.filters-section {
  position: sticky;
  background: linear-gradient(135deg, rgba(174, 228, 178, 0.3) 0%, rgba(149, 208, 161, 0.3) 100%);
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
  top: 2rem;
  padding: 2.5rem;
  gap: 1.5rem;
  font-size: 0.88rem;
  line-height: 1.25rem;

  .rooms-tabs {
    display: grid;
    grid-template-columns: repeat(4, 44px);
    gap: 1rem;

    .room-tab {
      background: white;
      padding: 0.6rem 0.75rem;
      border-radius: 2rem;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: var(--transition);
      text-align: center;
      border: none;
      height: 2.75rem;

    }

    .room-tab:hover {
      background: #e9ecef;
    }

    .room-tab.active {
      background: var(--primary-color);
      color: white;
    }
  }

  .filter-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .reset-filters-btn-container {
    display: flex;
    align-items: center;
    padding-left: 1rem;
    height: 2rem;
  }

  .reset-filters-btn {
    cursor: pointer;
    transition: var(--transition);
    border: none;
    display: flex;
    gap: 0.5rem;
    background-color: transparent;
    align-items: center;
    line-height: 1.25rem;

    &:hover {
      scale: 1.01;
    }
  }
}


</style>