<script setup lang="ts">
import IconSortDown from "assets/icons/IconSortDown.vue";
import IconSortUp from "assets/icons/IconSortUp.vue";
import { computed } from 'vue'

type SortField = 'area' | 'floor' | 'price'

const props = defineProps<{
  text: string,
  field: SortField,
  activeField: SortField | null,
  direction: 'asc' | 'desc'
}>()
defineEmits(['sort'])


const isActive = computed(() => props.activeField === props.field)
</script>

<template>
  <th>
    <div class="sorting-th" @click="$emit('sort', field)">
      <div :class="{ active: isActive }">{{ text }}</div>
      <div class="sort-icons-container">
        <icon-sort-up :class="{ active: isActive && direction === 'asc' }"/>
        <icon-sort-down :class="{ active: isActive && direction === 'desc' }"/>
      </div>
    </div>
  </th>
</template>

<style scoped lang="scss">
.sorting-th {
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
  transition: var(--transition);

  .active {
    color: var(--primary-color);
  }

  .sort-icons-container {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .active {
      --color: var(--primary-color)
    }
  }
}
</style>