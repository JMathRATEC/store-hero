<script setup lang="ts">
import { ref } from 'vue';
import { CLASSES } from '../data/classes';
import { HERO_SPRITES } from '../data/sprites';
import type { ClassDefinition, HeroClass } from '../types';
import SpriteAnimator from './SpriteAnimator.vue';

const emit = defineEmits<{
    select: [classId: HeroClass, name: string];
}>();

const heroName = ref('Aventureiro');
const selected = ref<HeroClass>('warrior');
const classList: ClassDefinition[] = [CLASSES.warrior, CLASSES.mage];

function confirm() {
    emit('select', selected.value, heroName.value);
}
</script>

<template>
    <section class="mx-auto w-full max-w-5xl animate-[fadeRise_0.6s_ease]">
        <header class="mb-5 text-center sm:mb-8">
            <p
                class="mb-2 text-[10px] tracking-[0.3em] text-[#c9a227] uppercase sm:text-xs sm:tracking-[0.35em]"
            >
                Escolha seu destino
            </p>
            <h2
                class="font-display text-3xl text-[#f6e7c1] sm:text-4xl md:text-5xl"
            >
                Guerreiro ou Mago?
            </h2>
            <p class="mx-auto mt-3 max-w-xl text-sm text-[#b9a88a]">
                Sem defesa no momento certo, as fases avançadas não perdoam.
            </p>
        </header>

        <label
            class="mx-auto mb-5 flex max-w-sm flex-col gap-2 text-sm text-[#d7c4a3] sm:mb-8"
        >
            Nome do herói
            <input
                v-model="heroName"
                maxlength="20"
                class="rounded-sm border border-[#6b5433] bg-[#1a140f] px-4 py-3 text-base text-[#f6e7c1] outline-none focus:border-[#c9a227] sm:py-2 sm:text-sm"
                placeholder="Seu nome"
                autocomplete="nickname"
            />
        </label>

        <div class="grid gap-4 md:grid-cols-2 md:gap-6">
            <button
                v-for="cls in classList"
                :key="cls.id"
                type="button"
                class="group relative touch-manipulation overflow-hidden rounded-sm border p-4 text-left transition duration-300 sm:p-5"
                :class="
                    selected === cls.id
                        ? 'border-[#c9a227] bg-[#2a1f14] shadow-[0_0_0_1px_#c9a22755]'
                        : 'border-[#4a3a24] bg-[#17120e] hover:border-[#8a6a35]'
                "
                @click="selected = cls.id"
            >
                <div
                    class="mb-3 flex items-end justify-between gap-3 sm:mb-4 sm:gap-4"
                >
                    <div class="min-w-0">
                        <p
                            class="text-[10px] tracking-[0.2em] text-[#c9a227] uppercase sm:text-xs sm:tracking-[0.25em]"
                        >
                            {{ cls.title }}
                        </p>
                        <h3
                            class="font-display text-2xl text-[#f6e7c1] sm:text-3xl"
                        >
                            {{ cls.name }}
                        </h3>
                    </div>
                    <div class="origin-bottom scale-75 sm:scale-100">
                        <SpriteAnimator
                            :clip="HERO_SPRITES[cls.id].idle"
                            :scale="1.8"
                            :flip="cls.id === 'mage'"
                        />
                    </div>
                </div>

                <p class="mb-3 text-sm leading-relaxed text-[#b9a88a] sm:mb-4">
                    {{ cls.description }}
                </p>

                <div
                    class="mb-3 grid grid-cols-1 gap-3 text-xs sm:mb-4 sm:grid-cols-2"
                >
                    <div>
                        <p
                            class="mb-1 tracking-wider text-emerald-400/90 uppercase"
                        >
                            Vantagens
                        </p>
                        <ul class="space-y-1 text-[#d7c4a3]">
                            <li v-for="item in cls.advantages" :key="item">
                                • {{ item }}
                            </li>
                        </ul>
                    </div>
                    <div>
                        <p
                            class="mb-1 tracking-wider text-rose-400/90 uppercase"
                        >
                            Desvantagens
                        </p>
                        <ul class="space-y-1 text-[#d7c4a3]">
                            <li v-for="item in cls.disadvantages" :key="item">
                                • {{ item }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div
                    class="flex flex-wrap gap-2 text-[10px] tracking-wider text-[#9f8b68] uppercase sm:gap-3 sm:text-[11px]"
                >
                    <span>PV {{ cls.baseHp }}</span>
                    <span>Mana {{ cls.baseMana }}</span>
                    <span>ATK {{ cls.baseAttack }}</span>
                    <span>MAG {{ cls.baseMagic }}</span>
                    <span>DEF {{ cls.baseDefense }}</span>
                </div>
            </button>
        </div>

        <div class="mt-6 flex justify-center sm:mt-8">
            <button
                type="button"
                class="rpg-btn w-full max-w-sm sm:w-auto"
                @click="confirm"
            >
                Entrar na aventura
            </button>
        </div>
    </section>
</template>
