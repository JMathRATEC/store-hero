<script setup lang="ts">
import { POTIONS } from '../data/potions';
import type { HeroState, SkillDefinition, StageDefinition } from '../types';

defineProps<{
    hero: HeroState;
    stage: StageDefinition;
    skills: SkillDefinition[];
    victoryText: string;
}>();

const emit = defineEmits<{
    upgrade: [
        stat: 'hp' | 'mana' | 'attack' | 'magic' | 'defense' | 'skill',
        skillId?: string,
    ];
    buy: [potionId: string];
    continue: [];
}>();
</script>

<template>
    <section class="mx-auto w-full max-w-4xl animate-[fadeRise_0.55s_ease]">
        <header class="mb-5 text-center sm:mb-8">
            <p
                class="mb-2 text-[10px] tracking-[0.3em] text-[#c9a227] uppercase sm:text-xs sm:tracking-[0.35em]"
            >
                Vitória · {{ stage.chapter }}
            </p>
            <h2 class="font-display text-3xl text-[#f6e7c1] sm:text-4xl">
                Forja seu poder
            </h2>
            <p
                class="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#b9a88a]"
            >
                {{ victoryText }}
            </p>
            <p class="mt-4 text-sm text-[#d7c4a3]">
                Pontos:
                <span class="text-[#c9a227]">{{ hero.skillPoints }}</span>
                · Ouro:
                <span class="text-[#e8c547]">{{ hero.gold }}</span>
                · Nível {{ hero.level }}
            </p>
        </header>

        <div
            class="mb-6 rounded-sm border border-[#5c4a2e] bg-[#17120e] p-3 sm:p-4"
        >
            <p
                class="mb-3 text-[10px] tracking-[0.25em] text-[#c9a227] uppercase sm:text-xs"
            >
                Mercador Errante
            </p>
            <div class="grid gap-2 sm:grid-cols-2 sm:gap-3">
                <button
                    v-for="potion in POTIONS"
                    :key="potion.id"
                    type="button"
                    class="upgrade-card min-h-16 touch-manipulation text-left"
                    :disabled="hero.gold < potion.price"
                    @click="emit('buy', potion.id)"
                >
                    <span
                        class="mb-0.5 flex items-center justify-between gap-2"
                    >
                        <span class="font-medium text-[#f3e6c8]">{{
                            potion.name
                        }}</span>
                        <span class="shrink-0 text-[11px] text-[#e8c547]"
                            >{{ potion.price }} ouro</span
                        >
                    </span>
                    <span class="block text-xs text-[#9f8b68]">{{
                        potion.description
                    }}</span>
                    <span
                        class="mt-1 block text-[10px] tracking-wider uppercase"
                        :style="{ color: potion.accent }"
                    >
                        No inventário: {{ hero.potions[potion.id] ?? 0 }}
                    </span>
                </button>
            </div>
        </div>

        <div
            class="mb-5 grid grid-cols-1 gap-2 sm:mb-6 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3"
        >
            <button
                type="button"
                class="upgrade-card min-h-12 touch-manipulation"
                :disabled="hero.skillPoints <= 0"
                @click="emit('upgrade', 'hp')"
            >
                +18 Vida máxima
            </button>
            <button
                type="button"
                class="upgrade-card min-h-12 touch-manipulation"
                :disabled="hero.skillPoints <= 0"
                @click="emit('upgrade', 'mana')"
            >
                +14 Mana máxima
            </button>
            <button
                type="button"
                class="upgrade-card min-h-12 touch-manipulation"
                :disabled="hero.skillPoints <= 0"
                @click="emit('upgrade', 'attack')"
            >
                +3 Ataque
            </button>
            <button
                type="button"
                class="upgrade-card min-h-12 touch-manipulation"
                :disabled="hero.skillPoints <= 0"
                @click="emit('upgrade', 'magic')"
            >
                +3 Magia
            </button>
            <button
                type="button"
                class="upgrade-card min-h-12 touch-manipulation"
                :disabled="hero.skillPoints <= 0"
                @click="emit('upgrade', 'defense')"
            >
                +2 Defesa
            </button>
        </div>

        <div class="mb-6 sm:mb-8">
            <p
                class="mb-3 text-[10px] tracking-[0.25em] text-[#c9a227] uppercase sm:text-xs"
            >
                Fortalecer habilidades
            </p>
            <div class="grid gap-2 sm:grid-cols-2 sm:gap-3">
                <button
                    v-for="skill in skills"
                    :key="skill.id"
                    type="button"
                    class="upgrade-card min-h-14 touch-manipulation text-left"
                    :disabled="hero.skillPoints <= 0"
                    @click="emit('upgrade', 'skill', skill.id)"
                >
                    <span class="block text-[#f3e6c8]">{{ skill.name }}</span>
                    <span class="text-xs text-[#9f8b68]"
                        >Nível {{ hero.skillLevels[skill.id] ?? 1 }} →
                        {{ (hero.skillLevels[skill.id] ?? 1) + 1 }}</span
                    >
                </button>
            </div>
        </div>

        <div class="flex justify-center">
            <button
                type="button"
                class="rpg-btn w-full max-w-sm sm:w-auto"
                @click="emit('continue')"
            >
                Seguir para a próxima fase
            </button>
        </div>
    </section>
</template>
