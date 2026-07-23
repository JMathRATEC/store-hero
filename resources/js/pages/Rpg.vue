<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { computed } from 'vue';
import BattleArena from '@/rpg/components/BattleArena.vue';
import ClassSelect from '@/rpg/components/ClassSelect.vue';
import SpriteAnimator from '@/rpg/components/SpriteAnimator.vue';
import StoryPanel from '@/rpg/components/StoryPanel.vue';
import UpgradePanel from '@/rpg/components/UpgradePanel.vue';
import { useRpgGame } from '@/rpg/composables/useRpgGame';
import { HERO_SPRITES } from '@/rpg/data/sprites';
import { STAGES } from '@/rpg/data/stages';

const {
    state,
    currentStage,
    currentEnemy,
    availableSkills,
    progressLabel,
    startAdventure,
    selectClass,
    advanceStory,
    useSkill,
    usePotion,
    buyPotion,
    upgradeStat,
    continueToNextStage,
    resetGame,
    skillPower,
    skillHeal,
} = useRpgGame();

const hasSave = computed(() => state.hero !== null && state.screen !== 'intro');
</script>

<template>
    <Head title="Crônicas do Dragão">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossorigin=""
        />
        <link
            href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Source+Sans+3:wght@400;600&display=swap"
            rel="stylesheet"
        />
    </Head>

    <div class="rpg-root min-h-screen text-[#e8d7b5]">
        <div class="rpg-backdrop" />

        <header
            class="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4 sm:py-5 md:px-6"
        >
            <div class="min-w-0">
                <p
                    class="text-[9px] tracking-[0.3em] text-[#c9a227] uppercase sm:text-[10px] sm:tracking-[0.4em]"
                >
                    Aventura de masmorras
                </p>
                <h1
                    class="font-display truncate text-lg text-[#f6e7c1] sm:text-xl md:text-2xl"
                >
                    Crônicas do Dragão
                </h1>
            </div>
            <div class="flex shrink-0 items-center gap-2 sm:gap-3">
                <span
                    v-if="state.hero"
                    class="hidden text-[11px] tracking-wider text-[#e8c547] uppercase sm:inline"
                >
                    {{ state.hero.gold }} ouro
                </span>
                <button
                    v-if="hasSave"
                    type="button"
                    class="touch-manipulation rounded-sm border border-[#5c4a2e] px-2.5 py-2 text-[10px] tracking-wider text-[#d7c4a3] uppercase hover:border-[#c9a227] sm:px-3 sm:text-xs"
                    @click="resetGame"
                >
                    Novo
                </button>
                <a
                    href="/"
                    class="touch-manipulation rounded-sm border border-[#5c4a2e] px-2.5 py-2 text-[10px] tracking-wider text-[#d7c4a3] uppercase hover:border-[#c9a227] sm:px-3 sm:text-xs"
                >
                    Voltar
                </a>
            </div>
        </header>

        <main
            class="relative z-10 mx-auto w-full max-w-6xl px-3 pb-10 sm:px-4 sm:pb-16 md:px-6"
        >
            <!-- INTRO -->
            <section
                v-if="state.screen === 'intro'"
                class="flex min-h-[70vh] animate-[fadeRise_0.7s_ease] flex-col items-center justify-center py-4 text-center sm:min-h-[75vh]"
            >
                <div
                    class="mb-5 flex scale-75 items-end justify-center gap-2 sm:mb-8 sm:scale-100 sm:gap-6 md:gap-10"
                >
                    <SpriteAnimator
                        :clip="HERO_SPRITES.warrior.idle"
                        :scale="2.2"
                        class="animate-[idlePulse_2.8s_ease-in-out_infinite]"
                    />
                    <SpriteAnimator
                        :clip="HERO_SPRITES.mage.idle"
                        :scale="2.2"
                        flip
                        class="animate-[idlePulse_2.8s_ease-in-out_infinite]"
                        style="animation-delay: 0.4s"
                    />
                </div>

                <p
                    class="mb-2 text-[10px] tracking-[0.35em] text-[#c9a227] uppercase sm:mb-3 sm:text-xs sm:tracking-[0.45em]"
                >
                    Uma lenda clássica de masmorras
                </p>
                <h2
                    class="font-display mb-3 max-w-3xl text-3xl leading-tight text-[#f6e7c1] sm:mb-4 sm:text-4xl md:text-6xl"
                >
                    Será que você consegue chegar até o dragão e derrotá-lo?
                </h2>
                <p
                    class="mx-auto mb-6 max-w-2xl text-sm text-[#b9a88a] sm:mb-8 sm:text-base md:text-lg"
                >
                    Quatro fases. Defesa e ataque no timing certo. Compre poções
                    no mercador, escolha Guerreiro ou Mago e enfrente o Dragão
                    Carmesim.
                </p>

                <div
                    class="mb-8 grid w-full max-w-3xl gap-2 text-left text-sm text-[#d7c4a3] sm:mb-10 sm:grid-cols-3 sm:gap-3"
                >
                    <div
                        class="bg-[#17120e]/p-3 rounded-sm border border-[#4a3a24] sm:p-4"
                    >
                        <p class="mb-1 text-[#c9a227]">1 · Floresta</p>
                        <p class="text-xs text-[#9f8b68] sm:text-sm">
                            Besta das Sombras
                        </p>
                    </div>
                    <div
                        class="bg-[#17120e]/p-3 rounded-sm border border-[#4a3a24] sm:p-4"
                    >
                        <p class="mb-1 text-[#c9a227]">
                            2–3 · Catacumbas & Castelo
                        </p>
                        <p class="text-xs text-[#9f8b68] sm:text-sm">
                            Necromante e Cavaleiro
                        </p>
                    </div>
                    <div
                        class="bg-[#17120e]/p-3 rounded-sm border border-[#4a3a24] sm:p-4"
                    >
                        <p class="mb-1 text-[#c9a227]">4 · Covil</p>
                        <p class="text-xs text-[#9f8b68] sm:text-sm">
                            Dragão Carmesim
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    class="rpg-btn w-full max-w-xs text-sm sm:w-auto sm:text-base"
                    @click="startAdventure"
                >
                    Começar a jornada
                </button>
            </section>

            <ClassSelect
                v-else-if="state.screen === 'class-select'"
                @select="selectClass"
            />

            <StoryPanel
                v-else-if="state.screen === 'story' && currentStage"
                :chapter="currentStage.chapter"
                :title="currentStage.name"
                :lines="currentStage.story"
                :index="state.storyIndex"
                :progress="progressLabel"
                :hero="state.hero"
                @next="advanceStory"
                @buy="buyPotion"
            />

            <BattleArena
                v-else-if="
                    state.screen === 'battle' && state.hero && currentEnemy
                "
                :hero="state.hero"
                :enemy="currentEnemy"
                :enemy-hp="state.enemyHp"
                :enemy-mana="state.enemyMana"
                :defense-turns="state.playerDefenseTurns"
                :fury-turns="state.furyTurns"
                :fury-boost="state.furyBoost"
                :skills="availableSkills"
                :log="state.battleLog"
                :is-player-turn="state.isPlayerTurn"
                :is-animating="state.isAnimating"
                :player-anim="state.playerAnim"
                :enemy-anim="state.enemyAnim"
                :floating-text="state.floatingText"
                :floating-tone="state.floatingTone"
                :progress="progressLabel"
                :skill-power="skillPower"
                :skill-heal="skillHeal"
                @use-skill="useSkill"
                @use-potion="usePotion"
            />

            <UpgradePanel
                v-else-if="
                    state.screen === 'upgrade' && state.hero && currentStage
                "
                :hero="state.hero"
                :stage="currentStage"
                :skills="availableSkills"
                :victory-text="currentStage.victoryStory"
                @upgrade="(stat, skillId) => upgradeStat(stat, skillId)"
                @buy="buyPotion"
                @continue="continueToNextStage"
            />

            <section
                v-else-if="state.screen === 'victory'"
                class="flex min-h-[65vh] animate-[fadeRise_0.6s_ease] flex-col items-center justify-center px-1 text-center"
            >
                <p
                    class="mb-2 text-xs tracking-[0.35em] text-[#c9a227] uppercase"
                >
                    Fim da jornada
                </p>
                <h2
                    class="font-display mb-4 text-3xl text-[#f6e7c1] sm:text-5xl"
                >
                    O Dragão caiu!
                </h2>
                <p class="mb-8 max-w-xl text-sm text-[#b9a88a] sm:text-base">
                    {{ STAGES[3]?.victoryStory }}
                    <template v-if="state.hero">
                        Glória a {{ state.hero.name }},
                        {{
                            state.hero.classId === 'warrior'
                                ? 'Guerreiro'
                                : 'Mago'
                        }}
                        de nível {{ state.hero.level }}.
                    </template>
                </p>
                <button
                    type="button"
                    class="rpg-btn w-full max-w-xs sm:w-auto"
                    @click="resetGame"
                >
                    Jogar novamente
                </button>
            </section>

            <section
                v-else-if="state.screen === 'defeat'"
                class="flex min-h-[65vh] animate-[fadeRise_0.6s_ease] flex-col items-center justify-center px-1 text-center"
            >
                <p
                    class="mb-2 text-xs tracking-[0.35em] text-rose-400 uppercase"
                >
                    Derrota
                </p>
                <h2
                    class="font-display mb-4 text-3xl text-[#f6e7c1] sm:text-5xl"
                >
                    A escuridão venceu… por agora
                </h2>
                <p class="mb-8 max-w-xl text-sm text-[#b9a88a] sm:text-base">
                    Tente de novo: defenda antes dos golpes pesados, cure no
                    timing certo e não gaste toda a mana de uma vez.
                </p>
                <button
                    type="button"
                    class="rpg-btn w-full max-w-xs sm:w-auto"
                    @click="resetGame"
                >
                    Tentar de novo
                </button>
            </section>
        </main>
    </div>
</template>
