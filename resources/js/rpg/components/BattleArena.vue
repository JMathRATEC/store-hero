<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type {
    AnimationState,
    BattleLogEntry,
    EnemyDefinition,
    HeroState,
    PotionDefinition,
    SkillDefinition,
} from '../types';
import { POTIONS } from '../data/potions';
import { DRAGON_SPRITE, HERO_SPRITES } from '../data/sprites';
import SpriteAnimator from './SpriteAnimator.vue';
import StatBar from './StatBar.vue';

const props = defineProps<{
    hero: HeroState;
    enemy: EnemyDefinition;
    enemyHp: number;
    enemyMana: number;
    defenseTurns: number;
    furyTurns: number;
    furyBoost: number;
    skills: SkillDefinition[];
    log: BattleLogEntry[];
    isPlayerTurn: boolean;
    isAnimating: boolean;
    playerAnim: AnimationState;
    enemyAnim: AnimationState;
    floatingText: string | null;
    floatingTone: 'damage' | 'heal' | 'mana' | null;
    progress: string;
    skillPower: (skill: SkillDefinition, level: number) => number;
    skillHeal: (skill: SkillDefinition, level: number) => number;
}>();

const emit = defineEmits<{
    useSkill: [skillId: string];
    usePotion: [potionId: string];
}>();

const isMobile = ref(false);
const showLog = ref(false);

function updateViewport() {
    isMobile.value = window.innerWidth < 768;
}

onMounted(() => {
    updateViewport();
    window.addEventListener('resize', updateViewport);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateViewport);
});

const playerClip = computed(() => {
    const set = HERO_SPRITES[props.hero.classId];
    return set[props.playerAnim] ?? set.idle;
});

const enemyIsDragon = computed(() => props.enemy.id === 'dragon');

const heroScale = computed(() => (isMobile.value ? 1.45 : 2.4));
const dragonScale = computed(() => (isMobile.value ? 1.35 : 2.1));

const canUse = (skill: SkillDefinition) =>
    props.isPlayerTurn &&
    !props.isAnimating &&
    props.hero.mana >= skill.manaCost;

const ownedPotions = computed(() =>
    POTIONS.filter((potion) => (props.hero.potions[potion.id] ?? 0) > 0),
);

const canUsePotion = (potion: PotionDefinition) =>
    props.isPlayerTurn &&
    !props.isAnimating &&
    (props.hero.potions[potion.id] ?? 0) > 0;
</script>

<template>
    <section class="mx-auto w-full max-w-6xl animate-[fadeRise_0.45s_ease]">
        <div class="mb-3 md:mb-4">
            <p class="text-[10px] tracking-[0.3em] text-[#c9a227] uppercase md:text-xs">
                {{ progress }}
            </p>
            <div class="flex flex-wrap items-baseline justify-between gap-2">
                <h2 class="font-display text-2xl text-[#f6e7c1] md:text-4xl">
                    {{ enemy.name }}
                </h2>
                <span
                    class="rounded-sm border border-[#5c4a2e] px-2 py-0.5 text-[10px] tracking-wider text-[#c9a227] uppercase"
                >
                    {{ enemy.difficulty }}
                </span>
            </div>
            <p class="mt-1 text-xs text-[#9f8b68] md:text-sm">{{ enemy.title }}</p>
            <p class="mt-1 hidden text-sm text-[#b9a88a] md:block">
                {{ enemy.description }}
            </p>
        </div>

        <div
            class="relative overflow-hidden rounded-sm border border-[#5c4a2e] bg-[#120e0b]"
        >
            <!-- Barras no topo (melhor no celular) -->
            <div
                class="grid grid-cols-2 gap-2 border-b border-[#3d2f1d] bg-[#17120e] p-2.5 md:gap-4 md:p-4"
            >
                <div class="space-y-1.5 rounded-sm border border-[#4a3a24] bg-[#1a140f]/p-2 md:p-3">
                    <div class="flex items-center justify-between gap-1">
                        <p
                            class="truncate text-[10px] tracking-wider text-[#c9a227] uppercase md:text-xs"
                        >
                            {{ hero.name }}
                        </p>
                        <div class="flex shrink-0 gap-1">
                            <span
                                v-if="defenseTurns > 0"
                                class="rounded-sm bg-[#2a3a28] px-1.5 py-0.5 text-[9px] tracking-wider text-emerald-300 uppercase"
                            >
                                Def {{ defenseTurns }}
                            </span>
                            <span
                                v-if="furyTurns > 0"
                                class="rounded-sm bg-[#3a2418] px-1.5 py-0.5 text-[9px] tracking-wider text-orange-300 uppercase"
                            >
                                Fúria {{ furyTurns }}
                            </span>
                        </div>
                    </div>
                    <StatBar
                        label="Vida"
                        :current="hero.hp"
                        :max="hero.maxHp"
                        variant="hp"
                    />
                    <StatBar
                        label="Mana"
                        :current="hero.mana"
                        :max="hero.maxMana"
                        variant="mana"
                    />
                </div>
                <div class="space-y-1.5 rounded-sm border border-[#4a3a24] bg-[#1a140f]/p-2 md:p-3">
                    <p
                        class="truncate text-[10px] tracking-wider text-lime-400/80 uppercase md:text-xs"
                    >
                        {{ enemy.name }}
                    </p>
                    <StatBar
                        label="Vida"
                        :current="enemyHp"
                        :max="enemy.maxHp"
                        variant="enemy"
                    />
                    <StatBar
                        label="Mana"
                        :current="enemyMana"
                        :max="enemy.maxMana"
                        variant="mana"
                    />
                </div>
            </div>

            <div
                class="battle-arena relative flex min-h-[200px] items-end justify-between gap-1 px-2 pt-8 pb-3 sm:min-h-[240px] sm:px-4 md:min-h-[360px] md:gap-4 md:px-10 md:pt-10 md:pb-6"
            >
                <div
                    v-if="floatingText"
                    class="pointer-events-none absolute top-4 left-1/2 z-20 -translate-x-1/2 animate-[floatUp_0.9s_ease] font-display text-2xl md:top-8 md:text-3xl"
                    :class="{
                        'text-rose-400': floatingTone === 'damage',
                        'text-emerald-400': floatingTone === 'heal',
                        'text-sky-300': floatingTone === 'mana',
                    }"
                >
                    {{ floatingText }}
                </div>

                <div class="relative flex flex-1 flex-col items-center">
                    <div
                        class="transition duration-300"
                        :class="{
                            'translate-x-2 md:translate-x-4':
                                playerAnim === 'attack' || playerAnim === 'cast',
                            'opacity-70': playerAnim === 'hurt',
                            grayscale: playerAnim === 'dead',
                        }"
                    >
                        <SpriteAnimator
                            :clip="playerClip"
                            :scale="heroScale"
                            :key="`${playerAnim}-${playerClip.src}-${heroScale}`"
                        />
                    </div>
                </div>

                <div class="relative flex flex-1 flex-col items-center">
                    <div
                        class="flex h-28 items-end justify-center transition duration-300 sm:h-36 md:h-48"
                        :class="{
                            '-translate-x-2 md:-translate-x-3':
                                enemyAnim === 'attack',
                            'opacity-70': enemyAnim === 'hurt',
                            'grayscale scale-95': enemyAnim === 'dead',
                            'animate-[dragonBob_2.4s_ease-in-out_infinite]':
                                enemyIsDragon,
                        }"
                    >
                        <SpriteAnimator
                            v-if="enemyIsDragon"
                            :clip="DRAGON_SPRITE"
                            :scale="dragonScale"
                            :sheet-columns="3"
                            :sheet-rows="4"
                            :row="2"
                            flip
                        />
                        <img
                            v-else
                            :src="enemy.image"
                            :alt="enemy.name"
                            class="max-h-28 max-w-[110px] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] sm:max-h-36 sm:max-w-[140px] md:max-h-48 md:max-w-[180px]"
                            :class="{
                                'animate-[idlePulse_2s_ease-in-out_infinite]':
                                    enemyAnim === 'idle',
                            }"
                        />
                    </div>
                </div>
            </div>

            <!-- Skills + log -->
            <div
                class="border-t border-[#3d2f1d] bg-[#17120e] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:p-4"
            >
                <div class="mb-2 flex items-center justify-between gap-2 md:mb-3">
                    <p class="text-[10px] tracking-[0.2em] text-[#c9a227] uppercase md:text-xs">
                        Habilidades
                        <span class="ml-1 text-[#9f8b68]">
                            {{
                                isPlayerTurn && !isAnimating
                                    ? '· Seu turno'
                                    : '· Aguarde'
                            }}
                        </span>
                    </p>
                    <button
                        type="button"
                        class="rounded-sm border border-[#5c4a2e] px-2 py-1 text-[10px] tracking-wider text-[#d7c4a3] uppercase md:hidden"
                        @click="showLog = !showLog"
                    >
                        {{ showLog ? 'Ocultar log' : 'Ver log' }}
                    </button>
                </div>

                <div class="grid gap-3 md:grid-cols-[1.25fr_0.9fr]">
                    <div class="space-y-2">
                        <div
                            v-if="ownedPotions.length"
                            class="grid grid-cols-1 gap-2 sm:grid-cols-2"
                        >
                            <button
                                v-for="potion in ownedPotions"
                                :key="potion.id"
                                type="button"
                                class="min-h-12 touch-manipulation rounded-sm border border-[#6b3a28] bg-[#241610] px-3 py-2.5 text-left transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                                :disabled="!canUsePotion(potion)"
                                :class="
                                    canUsePotion(potion)
                                        ? 'hover:border-[#e07a3a] hover:bg-[#2e1c14]'
                                        : ''
                                "
                                @click="emit('usePotion', potion.id)"
                            >
                                <div class="flex items-center justify-between gap-2">
                                    <span class="text-sm font-medium" :style="{ color: potion.accent }">
                                        {{ potion.name }}
                                    </span>
                                    <span class="text-[11px] text-[#d7c4a3]"
                                        >x{{ hero.potions[potion.id] ?? 0 }}</span
                                    >
                                </div>
                                <p class="mt-0.5 text-[10px] text-[#9f8b68]">
                                    {{
                                        potion.effect === 'heal'
                                            ? `Cura ${potion.healAmount}`
                                            : `+${potion.attackBoost} ATK/MAG · ${potion.boostTurns} turnos`
                                    }}
                                    · gasta o turno
                                </p>
                            </button>
                        </div>

                        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <button
                            v-for="skill in skills"
                            :key="skill.id"
                            type="button"
                            class="min-h-14 touch-manipulation rounded-sm border border-[#5c4a2e] bg-[#211910] px-3 py-3 text-left transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 md:min-h-0"
                            :disabled="!canUse(skill)"
                            :class="
                                canUse(skill)
                                    ? 'hover:border-[#c9a227] hover:bg-[#2a1f14]'
                                    : ''
                            "
                            @click="emit('useSkill', skill.id)"
                        >
                            <div class="mb-0.5 flex items-center justify-between gap-2">
                                <span class="text-sm font-medium text-[#f3e6c8]">{{
                                    skill.name
                                }}</span>
                                <span class="shrink-0 text-[11px] text-sky-300"
                                    >MP {{ skill.manaCost }}</span
                                >
                            </div>
                            <p class="mb-1 line-clamp-2 text-[11px] leading-snug text-[#9f8b68] md:text-xs">
                                {{ skill.description }}
                            </p>
                            <p
                                class="text-[10px] tracking-wider text-[#c9a227] uppercase"
                            >
                                Nv.{{ hero.skillLevels[skill.id] ?? 1 }}
                                <template v-if="skill.type === 'heal'">
                                    · Cura
                                    {{
                                        skillHeal(
                                            skill,
                                            hero.skillLevels[skill.id] ?? 1,
                                        )
                                    }}
                                </template>
                                <template v-else-if="skill.type === 'buff'">
                                    · -55% dano
                                </template>
                                <template v-else>
                                    · ~
                                    {{
                                        skillPower(
                                            skill,
                                            hero.skillLevels[skill.id] ?? 1,
                                        ) + (furyBoost > 0 ? Math.round(furyBoost * 0.7) : 0)
                                    }}
                                </template>
                            </p>
                        </button>
                        </div>
                    </div>

                    <div
                        class="max-h-40 overflow-y-auto rounded-sm border border-[#3d2f1d] bg-[#120e0b] p-3 md:max-h-56"
                        :class="showLog ? 'block' : 'hidden md:block'"
                    >
                        <p
                            class="mb-2 text-[10px] tracking-[0.25em] text-[#c9a227] uppercase md:text-xs"
                        >
                            Crônica
                        </p>
                        <ul class="space-y-1.5 text-xs md:space-y-2 md:text-sm">
                            <li
                                v-for="entry in log"
                                :key="entry.id"
                                :class="{
                                    'text-[#d7c4a3]': entry.tone === 'neutral',
                                    'text-amber-200': entry.tone === 'player',
                                    'text-rose-300': entry.tone === 'enemy',
                                    'text-[#9f8b68]': entry.tone === 'system',
                                    'text-[#c9a227]': entry.tone === 'crit',
                                }"
                            >
                                {{ entry.text }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
