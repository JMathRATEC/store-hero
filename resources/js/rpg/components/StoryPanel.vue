<script setup lang="ts">
import { POTIONS } from '../data/potions';
import type { HeroState } from '../types';

defineProps<{
    chapter: string;
    title: string;
    lines: string[];
    index: number;
    progress: string;
    hero: HeroState | null;
}>();

const emit = defineEmits<{
    next: [];
    buy: [potionId: string];
}>();
</script>

<template>
    <section
        class="mx-auto flex min-h-[65vh] w-full max-w-3xl animate-[fadeRise_0.55s_ease] flex-col justify-center sm:min-h-[70vh]"
    >
        <p
            class="mb-2 text-[10px] tracking-[0.3em] text-[#c9a227] uppercase sm:text-xs sm:tracking-[0.35em]"
        >
            {{ progress }}
        </p>
        <p class="mb-1 text-sm text-[#9f8b68]">{{ chapter }}</p>
        <h2
            class="font-display mb-5 text-3xl text-[#f6e7c1] sm:mb-8 sm:text-4xl md:text-5xl"
        >
            {{ title }}
        </h2>

        <div
            class="relative overflow-hidden rounded-sm border border-[#5c4a2e] bg-[#1a140fcc] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-6 md:p-8"
        >
            <div
                class="pointer-events-none absolute inset-0 opacity-30"
                style="
                    background:
                        radial-gradient(
                            circle at 20% 20%,
                            #c45c2633,
                            transparent 40%
                        ),
                        radial-gradient(
                            circle at 80% 80%,
                            #2a7fff22,
                            transparent 35%
                        );
                "
            />
            <p
                class="relative min-h-24 text-base leading-relaxed text-[#e8d7b5] sm:min-h-28 sm:text-lg md:text-xl"
            >
                {{ lines[index] }}
            </p>

            <div
                v-if="hero && index === lines.length - 1"
                class="relative mt-5 space-y-2 border-t border-[#3d2f1d] pt-4"
            >
                <div class="flex items-center justify-between gap-2">
                    <p
                        class="text-[10px] tracking-[0.25em] text-[#c9a227] uppercase"
                    >
                        Mercador Errante
                    </p>
                    <span class="text-xs text-[#e8c547]"
                        >{{ hero.gold }} ouro</span
                    >
                </div>
                <div class="grid gap-2 sm:grid-cols-2">
                    <button
                        v-for="potion in POTIONS"
                        :key="potion.id"
                        type="button"
                        class="touch-manipulation rounded-sm border border-[#5c4a2e] bg-[#211910] px-3 py-2.5 text-left text-sm disabled:opacity-40"
                        :disabled="hero.gold < potion.price"
                        @click="emit('buy', potion.id)"
                    >
                        <span class="flex justify-between gap-2">
                            <span class="text-[#f3e6c8]">{{
                                potion.name
                            }}</span>
                            <span class="text-[#e8c547]">{{
                                potion.price
                            }}</span>
                        </span>
                        <span class="mt-0.5 block text-[11px] text-[#9f8b68]">
                            x{{ hero.potions[potion.id] ?? 0 }} no inventário
                        </span>
                    </button>
                </div>
            </div>

            <div
                class="relative mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between"
            >
                <div class="flex gap-2">
                    <span
                        v-for="(_, i) in lines"
                        :key="i"
                        class="h-1.5 w-6 rounded-full transition"
                        :class="i <= index ? 'bg-[#c9a227]' : 'bg-[#3d2f1d]'"
                    />
                </div>
                <button
                    type="button"
                    class="rpg-btn w-full sm:w-auto"
                    @click="emit('next')"
                >
                    {{
                        index < lines.length - 1
                            ? 'Continuar'
                            : 'Entrar em combate'
                    }}
                </button>
            </div>
        </div>
    </section>
</template>
