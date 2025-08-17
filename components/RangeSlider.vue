<script setup lang="ts">
import { computed } from 'vue'
import type { IRangeSliderProps, IRangeValue } from "~/types/range-slider";

const props = withDefaults(defineProps<IRangeSliderProps>(), { step: 1, forPrice: false })

const emit = defineEmits<{
  'update:modelValue': [value: IRangeValue]
}>()

const fillStyle = computed(() => {
  const minPercent = ((props.modelValue.min - props.min) / (props.max - props.min)) * 100
  const maxPercent = ((props.modelValue.max - props.min) / (props.max - props.min)) * 100

  return {
    left: `${minPercent}%`,
    width: `${maxPercent - minPercent}%`
  }
})

const updateMin = (event: Event) => {
  const target = event.target as HTMLInputElement
  const newMin = Math.min(Number(target.value), props.modelValue.max)

  emit('update:modelValue', {
    min: newMin,
    max: props.modelValue.max
  })
}

const updateMax = (event: Event) => {
  const target = event.target as HTMLInputElement
  const newMax = Math.max(Number(target.value), props.modelValue.min)

  emit('update:modelValue', {
    min: props.modelValue.min,
    max: newMax
  })
}
</script>

<template>
  <div class="range-slider-container">
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

    <div class="range-inputs">
      <input
        :value="modelValue.min"
        type="number"
        class="range-input"
        :min="min"
        :max="modelValue.max"
        @input="updateMin"
      />
      <span class="range-separator">—</span>
      <input
        :value="modelValue.max"
        type="number"
        class="range-input"
        :min="modelValue.min"
        :max="max"
        @input="updateMax"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.range-slider-container {
  margin-bottom: 1rem;
}

.range-slider {
  position: relative;
  height: 40px;
  margin-bottom: 1rem;
}

.range-slider-input {
  position: absolute;
  width: 100%;
  height: 6px;
  background: transparent;
  border-radius: 3px;
  outline: none;
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
  z-index: 2;
}

.range-slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: var(--secondary-color);
  border-radius: 50%;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.range-slider-input::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: var(--secondary-color);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.range-slider-input::-webkit-slider-track {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  background: transparent;
  border-radius: 3px;
}

.range-slider-input::-moz-range-track {
  height: 6px;
  background: transparent;
  border-radius: 3px;
  border: none;
}

.range-track {
  position: absolute;
  top: 17px;
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
  background: var(--secondary-color);
  border-radius: 3px;
  z-index: 2;
}

.min-input {
  z-index: 3;
}

.max-input {
  z-index: 4;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.range-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: center;
}

.range-input:focus {
  outline: none;
  border-color: var(--secondary-color);
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.range-separator {
  color: var(--text-color);
  font-weight: 500;
}

@media (max-width: 480px) {
  .range-inputs {
    flex-direction: column;
    gap: 0.75rem;
  }

  .range-separator {
    display: none;
  }
}
</style>
