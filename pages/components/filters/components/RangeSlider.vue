<script setup lang="ts">
import { computed } from 'vue'
import type { IRangeSliderProps, IRangeValue } from "~/types/range-slider";

const props = withDefaults(defineProps<IRangeSliderProps>(), { step: 1, forPrice: false })

const emit = defineEmits<{ 'update:modelValue': [value: IRangeValue] }>()

const fillStyle = computed(() => {
  const minPercent = ((props.modelValue.min - props.min) / (props.max - props.min)) * 100
  const maxPercent = ((props.modelValue.max - props.min) / (props.max - props.min)) * 100

  return { left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }
})

const updateMin = (event: Event) => {
  const target = event.target as HTMLInputElement
  const newMin = Math.min(Number(target.value), props.modelValue.max)

  emit('update:modelValue', { min: newMin, max: props.modelValue.max })
}

const updateMax = (event: Event) => {
  const target = event.target as HTMLInputElement
  const newMax = Math.max(Number(target.value), props.modelValue.min)

  emit('update:modelValue', { min: props.modelValue.min, max: newMax })
}
</script>

<template>
  <div class="range-container">
    <div class="range-result">
      <span>
        <span class="gray-text">от</span>
        {{ min }}
      </span>
      <span>
        <span class="gray-text">до</span>
        {{ max }}
      </span>
    </div>

    <div class="range-slider">
      <input
        :value="modelValue.min"
        type="range"
        class="range-slider-input min-input"
        :min="min"
        :max="max"
        @input="updateMin"
      />
      <input
        :value="modelValue.max"
        type="range"
        class="range-slider-input max-input"
        :min="min"
        :max="max"
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
      height: 3px;
      background: transparent;
      border-radius: 3px;
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
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      z-index: 10;
    }

    &-input::-moz-range-thumb {
      width: 20px;
      height: 20px;
      background: var(--secondary-color);
      border-radius: 50%;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      z-index: 10;
    }

    &-input::-webkit-slider-track {
      -webkit-appearance: none;
      appearance: none;
      height: 6px;
      background: transparent;
      border-radius: 3px;
    }

    &-input::-moz-range-track {
      height: 6px;
      background: transparent;
      border-radius: 3px;
      border: none;
    }
  }

  .range-track {
    position: absolute;
    top: 0.25rem;
    left: 0;
    right: 0;
    height: 6px;
    background: var(--light-gray);
    border-radius: 3px;
    z-index: 1;
  }

  .range-fill {
    position: absolute;
    top: 0;
    height: 100%;
    background: var(--primary-color);
    border-radius: 3px;
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
