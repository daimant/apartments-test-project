<script setup lang="ts">
import IconSortDown from "@/assets/icons/IconSortDown.vue";
import IconSortUp from "@/assets/icons/IconSortUp.vue";
import { computed } from 'vue'
import type { ISortThProps } from "~/types/table";

const props = defineProps<ISortThProps>()
defineEmits(['sort'])

const { sortField, sortDirection } = storeToRefs(useApartmentsStore())
const { setSort } = useApartmentsStore()

const isActive = computed(() => sortField.value === props.field)
</script>

<template>
  <th>
    <div class="sorting-th" @click="setSort(field)">
      <div :class="{ active: isActive }">{{ text }}</div>
      <div class="sort-icons-container">
        <icon-sort-up :class="{ active: isActive && sortDirection === 'asc' }" />
        <icon-sort-down :class="{ active: isActive && sortDirection === 'desc' }" />
      </div>
    </div>
  </th>
</template>

<style scoped lang="scss">
.sorting-th {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  cursor: pointer;
  transition: var(--transition);

  .active {
    color: var(--primary-color);
  }

  .sort-icons-container {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;

    .active {
      --color: var(--primary-color)
    }
  }
}
</style>