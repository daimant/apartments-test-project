<script setup lang="ts">
import IconSortDown from "assets/icons/IconSortDown.vue";
import IconSortUp from "assets/icons/IconSortUp.vue";

defineProps<{ text: string }>()
</script>

<template>
  <th>
    <div class="sorting-th">
      <div>{{ text }}</div>
      <div class="sort-icons-container">
        <icon-sort-up/>
        <icon-sort-down/>
      </div>
    </div>
  </th>
</template>

<style scoped lang="scss">
.sorting-th {
  display: flex;
  gap: 8px;
  align-items: center;

  .sort-icons-container {
    display: flex;
    flex-direction: column;
    gap: 2px;
    cursor: pointer;
  }
}
</style>