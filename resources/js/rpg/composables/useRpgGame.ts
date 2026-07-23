import { computed, onMounted, onUnmounted, reactive, watch } from 'vue';
import { CLASSES } from '../data/classes';
import { ENEMIES } from '../data/enemies';
import { getPotion, POTIONS } from '../data/potions';
import { STAGES, STORAGE_KEY } from '../data/stages';
import type {
    AnimationState,
    BattleLogEntry,
    GameState,
    HeroClass,
    HeroState,
    SkillDefinition,
} from '../types';

const initialState = (): GameState => ({
    screen: 'intro',
    hero: null,
    stageIndex: 0,
    storyIndex: 0,
    battleLog: [],
    enemyHp: 0,
    enemyMana: 0,
    playerDefenseTurns: 0,
    furyTurns: 0,
    furyBoost: 0,
    isPlayerTurn: true,
    isAnimating: false,
    playerAnim: 'idle',
    enemyAnim: 'idle',
    floatingText: null,
    floatingTone: null,
    startedAt: null,
});

let logCounter = 0;

function createHero(classId: HeroClass, name: string): HeroState {
    const def = CLASSES[classId];
    const unlocked = def.skills
        .filter((skill) => skill.unlockLevel <= 1)
        .map((skill) => skill.id);

    return {
        name: name.trim() || def.name,
        classId,
        level: 1,
        skillPoints: 0,
        gold: 55,
        potions: {
            elixir_dawn: 1,
        },
        maxHp: def.baseHp,
        hp: def.baseHp,
        maxMana: def.baseMana,
        mana: def.baseMana,
        attack: def.baseAttack,
        defense: def.baseDefense,
        magic: def.baseMagic,
        unlockedSkills: unlocked,
        skillLevels: Object.fromEntries(unlocked.map((id) => [id, 1])),
    };
}

function normalizeHero(hero: HeroState): HeroState {
    return {
        ...hero,
        gold: hero.gold ?? 0,
        potions: hero.potions ?? {},
    };
}

function skillPower(skill: SkillDefinition, level: number): number {
    return Math.round(skill.baseDamage * (1 + (level - 1) * 0.18));
}

function skillHeal(skill: SkillDefinition, level: number): number {
    return Math.round((skill.heal ?? 0) * (1 + (level - 1) * 0.15));
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useRpgGame() {
    const state = reactive<GameState>(initialState());

    const currentStage = computed(() => STAGES[state.stageIndex] ?? null);
    const currentEnemy = computed(() => {
        const stage = currentStage.value;

        return stage ? ENEMIES[stage.enemyId] : null;
    });
    const classDef = computed(() =>
        state.hero ? CLASSES[state.hero.classId] : null,
    );
    const availableSkills = computed(() => {
        if (!state.hero || !classDef.value) {
            return [] as SkillDefinition[];
        }

        return classDef.value.skills.filter((skill) =>
            state.hero!.unlockedSkills.includes(skill.id),
        );
    });

    const progressLabel = computed(() => {
        if (!currentStage.value) {
            return '';
        }

        return `${currentStage.value.chapter} · Fase ${state.stageIndex + 1}/${STAGES.length}`;
    });

    function pushLog(text: string, tone: BattleLogEntry['tone'] = 'neutral') {
        state.battleLog.unshift({
            id: ++logCounter,
            text,
            tone,
        });

        if (state.battleLog.length > 40) {
            state.battleLog.length = 40;
        }
    }

    function persist() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
            // ignore quota / private mode
        }
    }

    function load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);

            if (!raw) {
                return;
            }

            const saved = JSON.parse(raw) as GameState;
            Object.assign(state, saved);

            if (state.hero) {
                state.hero = normalizeHero(state.hero);
            }

            if (state.furyTurns === undefined) {
                state.furyTurns = 0;
            }

            if (state.furyBoost === undefined) {
                state.furyBoost = 0;
            }

            if (state.screen === 'battle') {
                state.isAnimating = false;
                state.playerAnim = 'idle';
                state.enemyAnim = 'idle';
                state.isPlayerTurn = true;
            }
        } catch {
            clearSave();
        }
    }

    function clearSave() {
        localStorage.removeItem(STORAGE_KEY);
    }

    function resetGame() {
        clearSave();
        Object.assign(state, initialState());
    }

    function startAdventure() {
        state.screen = 'class-select';
        state.startedAt = new Date().toISOString();
        persist();
    }

    function selectClass(classId: HeroClass, name: string) {
        state.hero = createHero(classId, name);
        state.stageIndex = 0;
        state.storyIndex = 0;
        state.screen = 'story';
        persist();
    }

    function advanceStory() {
        const stage = currentStage.value;

        if (!stage) {
            return;
        }

        if (state.storyIndex < stage.story.length - 1) {
            state.storyIndex += 1;
            persist();

            return;
        }

        beginBattle();
    }

    function beginBattle() {
        const enemy = currentEnemy.value;

        if (!enemy || !state.hero) {
            return;
        }

        state.enemyHp = enemy.maxHp;
        state.enemyMana = enemy.maxMana;
        state.playerDefenseTurns = 0;
        state.furyTurns = 0;
        state.furyBoost = 0;
        state.isPlayerTurn = true;
        state.isAnimating = false;
        state.playerAnim = 'idle';
        state.enemyAnim = 'idle';
        state.battleLog = [];
        state.screen = 'battle';
        pushLog(`${enemy.name} bloqueia o caminho!`, 'system');
        pushLog(`Dificuldade: ${enemy.difficulty.toUpperCase()}`, 'system');
        pushLog(
            'Estratégia: defenda antes dos golpes pesados e gerencie a mana.',
            'system',
        );
        persist();
    }

    async function playAnimation(
        target: 'player' | 'enemy',
        anim: AnimationState,
        ms = 700,
    ) {
        if (target === 'player') {
            state.playerAnim = anim;
        } else {
            state.enemyAnim = anim;
        }

        await wait(ms);

        if (target === 'player' && state.hero && state.hero.hp > 0) {
            state.playerAnim = 'idle';
        } else if (target === 'enemy' && state.enemyHp > 0) {
            state.enemyAnim = 'idle';
        }
    }

    function showFloat(text: string, tone: GameState['floatingTone']) {
        state.floatingText = text;
        state.floatingTone = tone;
        window.setTimeout(() => {
            state.floatingText = null;
            state.floatingTone = null;
        }, 900);
    }

    function calcPlayerDamage(skill: SkillDefinition): number {
        if (!state.hero || !currentEnemy.value) {
            return 0;
        }

        const level = state.hero.skillLevels[skill.id] ?? 1;
        const power = skillPower(skill, level);
        const enemy = currentEnemy.value;
        const offense =
            skill.type === 'magic' ? state.hero.magic : state.hero.attack;
        const boosted = offense + state.furyBoost;
        const mitigation = Math.floor(enemy.defense * 0.65);
        const variance = 0.85 + Math.random() * 0.2;
        const raw = (power + boosted * 0.7 - mitigation) * variance;
        const crit = Math.random() < 0.08;

        return Math.max(1, Math.round(raw * (crit ? 1.35 : 1)));
    }

    function calcEnemyDamage(
        damage: number,
        type: 'physical' | 'magic' | 'heal',
    ): number {
        if (!state.hero || !currentEnemy.value) {
            return 0;
        }

        const enemy = currentEnemy.value;
        const mitigation =
            type === 'magic'
                ? Math.floor(state.hero.defense * 0.2)
                : Math.floor(state.hero.defense * 0.4);
        const offenseBonus =
            (type === 'magic' ? enemy.magic : enemy.attack) * 0.5;
        let raw = Math.max(1, damage + offenseBonus - mitigation);

        if (state.playerDefenseTurns > 0) {
            raw = Math.round(raw * 0.45);
        } else {
            // Sem defesa: chance de golpe crítico inimigo
            if (Math.random() < 0.18) {
                raw = Math.round(raw * 1.4);
            }
        }

        return Math.max(1, Math.round(raw * (0.95 + Math.random() * 0.15)));
    }

    function pickEnemySkill() {
        const enemy = currentEnemy.value;
        const hero = state.hero;

        if (!enemy || !hero) {
            return null;
        }

        const affordable = enemy.skills.filter(
            (skill) => skill.manaCost <= state.enemyMana,
        );
        const pool =
            affordable.length > 0
                ? affordable
                : enemy.skills.filter((skill) => skill.manaCost === 0);

        if (pool.length === 0) {
            return enemy.skills[0] ?? null;
        }

        const heals = pool.filter(
            (skill) => skill.type === 'heal' && skill.heal,
        );
        const heavy = pool.filter(
            (skill) => skill.damage >= 34 || skill.manaCost >= 18,
        );
        const light = pool.filter(
            (skill) => skill.damage < 34 && skill.type !== 'heal',
        );

        // Curar quando ferido
        if (
            state.enemyHp <= enemy.maxHp * 0.4 &&
            heals.length > 0 &&
            Math.random() < 0.75
        ) {
            return heals[Math.floor(Math.random() * heals.length)]!;
        }

        // Sem defesa do jogador: prioriza golpe pesado
        if (
            state.playerDefenseTurns <= 0 &&
            heavy.length > 0 &&
            Math.random() < 0.8
        ) {
            return heavy[Math.floor(Math.random() * heavy.length)]!;
        }

        // Com defesa ativa: chips baratos ou cura
        if (state.playerDefenseTurns > 0) {
            if (
                heals.length > 0 &&
                state.enemyHp < enemy.maxHp * 0.7 &&
                Math.random() < 0.45
            ) {
                return heals[Math.floor(Math.random() * heals.length)]!;
            }

            if (light.length > 0) {
                return light[Math.floor(Math.random() * light.length)]!;
            }
        }

        // Jogador com pouca vida: finalizar
        if (hero.hp <= hero.maxHp * 0.35 && heavy.length > 0) {
            return heavy[Math.floor(Math.random() * heavy.length)]!;
        }

        return pool[Math.floor(Math.random() * pool.length)]!;
    }

    async function useSkill(skillId: string) {
        if (
            !state.hero ||
            !currentEnemy.value ||
            state.isAnimating ||
            !state.isPlayerTurn ||
            state.screen !== 'battle'
        ) {
            return;
        }

        const skill = classDef.value?.skills.find(
            (item) => item.id === skillId,
        );

        if (!skill) {
            return;
        }

        if (state.hero.mana < skill.manaCost) {
            pushLog('Mana insuficiente!', 'system');

            return;
        }

        state.isAnimating = true;
        state.isPlayerTurn = false;
        state.hero.mana -= skill.manaCost;

        await playAnimation('player', skill.animation, 750);

        if (skill.type === 'heal') {
            const healed = skillHeal(
                skill,
                state.hero.skillLevels[skill.id] ?? 1,
            );
            state.hero.hp = clamp(state.hero.hp + healed, 0, state.hero.maxHp);
            pushLog(
                `${state.hero.name} usa ${skill.name} e recupera ${healed} de vida.`,
                'player',
            );
            showFloat(`+${healed}`, 'heal');
        } else if (skill.type === 'buff') {
            state.playerDefenseTurns = skill.defenseTurns ?? 2;
            pushLog(
                `${state.hero.name} ergue a guarda com ${skill.name}! (-55% dano por ${state.playerDefenseTurns} turnos)`,
                'player',
            );
            showFloat('DEFESA', 'mana');
        } else {
            const damage = calcPlayerDamage(skill);
            state.enemyHp = clamp(
                state.enemyHp - damage,
                0,
                currentEnemy.value.maxHp,
            );
            pushLog(
                `${state.hero.name} lança ${skill.name} e causa ${damage} de dano!`,
                'player',
            );
            showFloat(`-${damage}`, 'damage');
            await playAnimation('enemy', 'hurt', 450);
        }

        if (state.enemyHp <= 0) {
            await onEnemyDefeated();

            return;
        }

        await wait(350);
        await enemyTurn();
    }

    async function enemyTurn() {
        const enemy = currentEnemy.value;
        const hero = state.hero;

        if (!enemy || !hero) {
            state.isAnimating = false;

            return;
        }

        const skill = pickEnemySkill();

        if (!skill) {
            state.isAnimating = false;
            state.isPlayerTurn = true;

            return;
        }

        state.enemyMana = Math.max(0, state.enemyMana - skill.manaCost);
        await playAnimation('enemy', 'attack', 700);

        if (skill.type === 'heal' && skill.heal) {
            const heal = skill.heal;
            state.enemyHp = clamp(state.enemyHp + heal, 0, enemy.maxHp);
            const chip = calcEnemyDamage(skill.damage, 'magic');
            hero.hp = clamp(hero.hp - chip, 0, hero.maxHp);
            pushLog(
                `${enemy.name} usa ${skill.name}: causa ${chip} e cura ${heal}.`,
                'enemy',
            );
            showFloat(`-${chip}`, 'damage');
            await playAnimation('player', 'hurt', 450);
        } else {
            const damage = calcEnemyDamage(
                skill.damage,
                skill.type === 'heal' ? 'magic' : skill.type,
            );
            const wasCrit =
                state.playerDefenseTurns <= 0 && damage >= skill.damage * 1.25;
            hero.hp = clamp(hero.hp - damage, 0, hero.maxHp);
            pushLog(
                wasCrit
                    ? `${enemy.name} acerta CRÍTICO com ${skill.name} (${damage})!`
                    : `${enemy.name} usa ${skill.name} e causa ${damage} de dano!`,
                'enemy',
            );
            showFloat(`-${damage}`, 'damage');
            await playAnimation('player', 'hurt', 450);
        }

        if (state.playerDefenseTurns > 0) {
            state.playerDefenseTurns -= 1;

            if (state.playerDefenseTurns === 0) {
                pushLog('Sua defesa acabou!', 'system');
            }
        }

        if (state.furyTurns > 0) {
            state.furyTurns -= 1;

            if (state.furyTurns === 0) {
                state.furyBoost = 0;
                pushLog('O efeito das Brasas da Fúria se esvai.', 'system');
            }
        }

        // Regeneração baixa — mana é recurso estratégico
        hero.mana = clamp(
            hero.mana + (hero.classId === 'mage' ? 5 : 2),
            0,
            hero.maxMana,
        );
        state.enemyMana = clamp(state.enemyMana + 8, 0, enemy.maxMana);

        if (hero.hp <= 0) {
            await playAnimation('player', 'dead', 900);
            state.screen = 'defeat';
            state.isAnimating = false;
            pushLog('Você caiu em combate...', 'system');
            persist();

            return;
        }

        state.isPlayerTurn = true;
        state.isAnimating = false;
        persist();
    }

    async function onEnemyDefeated() {
        const stage = currentStage.value;
        const enemy = currentEnemy.value;

        if (!stage || !enemy || !state.hero) {
            return;
        }

        await playAnimation('enemy', 'dead', 800);
        pushLog(`${enemy.name} foi derrotado!`, 'crit');
        state.isAnimating = false;

        if (state.stageIndex >= STAGES.length - 1) {
            state.screen = 'victory';
            persist();

            return;
        }

        // bônus pós-fase
        state.hero.level += stage.xpReward;
        state.hero.skillPoints += stage.skillPoints;
        state.hero.gold += stage.goldReward;
        state.hero.maxHp += stage.hpBonus;
        state.hero.maxMana += stage.manaBonus;
        state.hero.attack += stage.attackBonus;
        state.hero.magic += stage.magicBonus;
        state.hero.defense += stage.defenseBonus;
        state.hero.hp = state.hero.maxHp;
        state.hero.mana = state.hero.maxMana;
        state.furyTurns = 0;
        state.furyBoost = 0;
        pushLog(`Você saqueou ${stage.goldReward} moedas de ouro.`, 'crit');

        // desbloqueia skills por nível
        const def = CLASSES[state.hero.classId];

        for (const skill of def.skills) {
            if (
                skill.unlockLevel <= state.hero.level &&
                !state.hero.unlockedSkills.includes(skill.id)
            ) {
                state.hero.unlockedSkills.push(skill.id);
                state.hero.skillLevels[skill.id] = 1;
                pushLog(`Nova habilidade: ${skill.name}!`, 'crit');
            }
        }

        state.screen = 'upgrade';
        persist();
    }

    function upgradeStat(
        stat: 'hp' | 'mana' | 'attack' | 'magic' | 'defense' | 'skill',
        skillId?: string,
    ) {
        if (!state.hero || state.hero.skillPoints <= 0) {
            return;
        }

        if (stat === 'skill' && skillId) {
            if (!state.hero.unlockedSkills.includes(skillId)) {
                return;
            }

            state.hero.skillLevels[skillId] =
                (state.hero.skillLevels[skillId] ?? 1) + 1;
        } else if (stat === 'hp') {
            state.hero.maxHp += 18;
            state.hero.hp = state.hero.maxHp;
        } else if (stat === 'mana') {
            state.hero.maxMana += 14;
            state.hero.mana = state.hero.maxMana;
        } else if (stat === 'attack') {
            state.hero.attack += 3;
        } else if (stat === 'magic') {
            state.hero.magic += 3;
        } else if (stat === 'defense') {
            state.hero.defense += 2;
        }

        state.hero.skillPoints -= 1;
        persist();
    }

    function buyPotion(potionId: string) {
        const potion = getPotion(potionId);

        if (!state.hero || !potion) {
            return;
        }

        if (state.hero.gold < potion.price) {
            return;
        }

        state.hero.gold -= potion.price;
        state.hero.potions[potionId] = (state.hero.potions[potionId] ?? 0) + 1;
        persist();
    }

    async function usePotion(potionId: string) {
        if (
            !state.hero ||
            state.isAnimating ||
            !state.isPlayerTurn ||
            state.screen !== 'battle'
        ) {
            return;
        }

        const potion = getPotion(potionId);
        const qty = state.hero.potions[potionId] ?? 0;

        if (!potion || qty <= 0) {
            return;
        }

        state.hero.potions[potionId] = qty - 1;
        state.isAnimating = true;

        if (potion.effect === 'heal') {
            const healed = potion.healAmount ?? 0;
            state.hero.hp = clamp(state.hero.hp + healed, 0, state.hero.maxHp);
            pushLog(
                `${state.hero.name} bebe ${potion.name} e recupera ${healed} de vida.`,
                'player',
            );
            showFloat(`+${healed}`, 'heal');
            await playAnimation('player', 'cast', 500);
        } else {
            state.furyBoost = potion.attackBoost ?? 10;
            state.furyTurns = potion.boostTurns ?? 3;
            pushLog(
                `${state.hero.name} bebe ${potion.name}! +${state.furyBoost} ataque/magia por ${state.furyTurns} turnos.`,
                'player',
            );
            showFloat('FÚRIA', 'mana');
            await playAnimation('player', 'cast', 500);
        }

        // Poção gasta o turno — escolha estratégica
        state.isPlayerTurn = false;
        await wait(250);
        await enemyTurn();
    }

    function continueToNextStage() {
        if (!currentStage.value) {
            return;
        }

        state.stageIndex += 1;
        state.storyIndex = 0;
        state.screen = 'story';
        persist();
    }

    function skipUpgrade() {
        continueToNextStage();
    }

    watch(state, () => persist(), { deep: true });

    function handlePageHide() {
        clearSave();
    }

    onMounted(() => {
        load();
        window.addEventListener('pagehide', handlePageHide);
    });

    onUnmounted(() => {
        window.removeEventListener('pagehide', handlePageHide);
    });

    return {
        state,
        currentStage,
        currentEnemy,
        classDef,
        availableSkills,
        progressLabel,
        potions: POTIONS,
        startAdventure,
        selectClass,
        advanceStory,
        useSkill,
        usePotion,
        buyPotion,
        upgradeStat,
        continueToNextStage,
        skipUpgrade,
        resetGame,
        skillPower,
        skillHeal,
    };
}
