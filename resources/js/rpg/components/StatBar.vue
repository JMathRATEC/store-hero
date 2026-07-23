<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    label: string;
    current: number;
    max: number;
    variant: 'hp' | 'mana' | 'enemy';
}>();

const percent = computed(() => {
    if (props.max <= 0) {
        return 0;
    }

    return Math.max(0, Math.min(100, (props.current / props.max) * 100));
});

const barClass = computed(() => {
    if (props.variant === 'hp') {
        return 'from-rose-700 to-amber-500';
    }

    if (props.variant === 'mana') {
        return 'from-sky-800 to-cyan-400';
    }

    return 'from-emerald-900 to-lime-500';
});
</script>

<template>
    <div class="w-full">
        <div
            class="mb-1 flex items-center justify-between text-[10px] tracking-[0.14em] text-[#d7c4a3] uppercase sm:text-[11px] sm:tracking-[0.18em]"
        >
            <span>{{ label }}</span>
            <span class="text-[#f3e6c8] tabular-nums"
                >{{ Math.ceil(current) }}/{{ max }}</span
            >
        </div>
        <div
            class="h-3 overflow-hidden rounded-sm border border-[#5c4a2e] bg-[#1a140f] shadow-inner"
        >
            <div
                class="h-full bg-linear-to-r transition-all duration-500 ease-out"
                :class="barClass"
                :style="{ width: `${percent}%` }"
            />
        </div>
    </div>
</template>
