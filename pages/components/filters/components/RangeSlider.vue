<script setup lang="ts">
import { computed } from 'vue'
import type { IRange } from "~/types/filters";
import { formatPrice } from "@/helpers/formatPrice";

const emit = defineEmits<{ 'update:modelValue': [value: IRange] }>()
const filter = defineModel<IRange>('modelValue', { required: true })

const fillStyle = computed(() => {
  const minPercent = ((filter.value?.min - filter.value?.minLimit) / (filter.value?.maxLimit - filter.value?.minLimit)) * 100
  const maxPercent = ((filter.value?.max - filter.value?.minLimit) / (filter.value?.maxLimit - filter.value?.minLimit)) * 100

  return { left: `${ minPercent }%`, width: `${ maxPercent - minPercent }%` }
})

const updateMin = (event: Event) => {
  const target = event.target as HTMLInputElement
  const newMin = Math.min(Number(target.value), filter.value?.max)

  emit('update:modelValue', { ...filter.value, min: newMin, max: filter.value?.max })
}

const updateMax = (event: Event) => {
  if (!filter.value) return
  const target = event.target as HTMLInputElement
  const newMax = Math.max(Number(target.value), filter.value?.min)

  emit('update:modelValue', { ...filter.value, min: filter.value?.min, max: newMax })
}
</script>

<template>
  <div class="range-container">
    <div class="range-result">
      <span>
        <span class="gray-text">от</span>
        {{ formatPrice(filter?.min) }}
      </span>
      <span>
        <span class="gray-text">до</span>
        {{ formatPrice(filter?.max) }}
      </span>
    </div>

    <div class="range-slider">
      <input
          :value="filter?.min"
          type="range"
          class="range-slider-input min-input"
          :min="filter?.minLimit"
          :max="filter?.maxLimit"
          @input="updateMin"
      />
      <input
          :value="filter?.max"
          type="range"
          class="range-slider-input max-input"
          :min="filter?.minLimit"
          :max="filter?.maxLimit"
          @input="updateMax"
      />
      <div class="range-track">
        <div class="range-fill" :style="fillStyle"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.range-container {
  .range-result {
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-size: 1rem;
    line-height: 1.5;
    margin-bottom: 0.375rem;

    span {
      display: flex;
      gap: 0.5rem;
    }

    .gray-text {
      color: var(--gray);
    }
  }

  .range-slider {
    position: relative;
    height: 0.875rem;

    &-input {
      position: absolute;
      width: 100%;
      height: 0.1875rem;
      background: transparent;
      border-radius: 0.1875rem;
      outline: none;
      pointer-events: none;
      -webkit-appearance: none;
      appearance: none;
      z-index: 2;
      top: 0.35rem;
    }

    &-input::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 0.875rem;
      height: 0.875rem;
      background: var(--primary-color);
      border-radius: 50%;
      cursor: pointer;
      pointer-events: auto;
      box-shadow: 0 0.125rem 0.375rem rgba(0, 0, 0, 0.2);
      z-index: 10;
    }

    &-input::-moz-range-thumb {
      width: 1.25rem;
      height: 1.25rem;
      background: var(--secondary-color);
      border-radius: 50%;
      cursor: pointer;
      border: none;
      box-shadow: 0 0.125rem 0.375rem rgba(0, 0, 0, 0.2);
      z-index: 10;
    }

    &-input::-webkit-slider-track {
      -webkit-appearance: none;
      appearance: none;
      height: 0.375rem;
      background: transparent;
      border-radius: 0.1875rem;
    }

    &-input::-moz-range-track {
      height: 0.375rem;
      background: transparent;
      border-radius: 0.1875rem;
      border: none;
    }
  }

  .range-track {
    position: absolute;
    top: 0.35rem;
    left: 0;
    right: 0;
    height: 0.1875rem;
    background: var(--light-gray-2);
    border-radius: 0.1875rem;
    z-index: 1;
  }

  .range-fill {
    position: absolute;
    top: 0;
    height: 100%;
    background: var(--primary-color);
    border-radius: 0.1875rem;
    z-index: 2;
  }

  .min-input {
    z-index: 3;
  }

  .max-input {
    z-index: 4;
  }
}
</style>
