export type HeroClass = 'warrior' | 'mage';

export type GameScreen =
    | 'intro'
    | 'class-select'
    | 'story'
    | 'battle'
    | 'upgrade'
    | 'victory'
    | 'defeat';

export type AnimationState =
    | 'idle'
    | 'walk'
    | 'run'
    | 'attack'
    | 'hurt'
    | 'defend'
    | 'dead'
    | 'cast';

export interface SkillDefinition {
    id: string;
    name: string;
    description: string;
    manaCost: number;
    baseDamage: number;
    heal?: number;
    defenseBonus?: number;
    defenseTurns?: number;
    type: 'physical' | 'magic' | 'heal' | 'buff';
    animation: AnimationState;
    unlockLevel: number;
}

export interface ClassDefinition {
    id: HeroClass;
    name: string;
    title: string;
    description: string;
    advantages: string[];
    disadvantages: string[];
    baseHp: number;
    baseMana: number;
    baseAttack: number;
    baseDefense: number;
    baseMagic: number;
    spriteFolder: string;
    accent: string;
    skills: SkillDefinition[];
}

export interface EnemySkill {
    id: string;
    name: string;
    damage: number;
    manaCost: number;
    type: 'physical' | 'magic' | 'heal';
    heal?: number;
}

export interface EnemyDefinition {
    id: string;
    name: string;
    title: string;
    description: string;
    difficulty: 'fácil' | 'médio' | 'difícil' | 'lendário';
    maxHp: number;
    maxMana: number;
    attack: number;
    defense: number;
    magic: number;
    image: string;
    isSpriteSheet?: boolean;
    frameWidth?: number;
    frameHeight?: number;
    frames?: number;
    columns?: number;
    rows?: number;
    skills: EnemySkill[];
}

export interface StageDefinition {
    id: number;
    name: string;
    chapter: string;
    story: string[];
    victoryStory: string;
    enemyId: string;
    xpReward: number;
    skillPoints: number;
    goldReward: number;
    hpBonus: number;
    manaBonus: number;
    attackBonus: number;
    magicBonus: number;
    defenseBonus: number;
}

export interface PotionDefinition {
    id: string;
    name: string;
    description: string;
    effect: 'heal' | 'attack';
    healAmount?: number;
    attackBoost?: number;
    boostTurns?: number;
    price: number;
    accent: string;
}

export interface HeroState {
    name: string;
    classId: HeroClass;
    level: number;
    skillPoints: number;
    gold: number;
    potions: Record<string, number>;
    maxHp: number;
    hp: number;
    maxMana: number;
    mana: number;
    attack: number;
    defense: number;
    magic: number;
    unlockedSkills: string[];
    skillLevels: Record<string, number>;
}

export interface BattleLogEntry {
    id: number;
    text: string;
    tone: 'neutral' | 'player' | 'enemy' | 'system' | 'crit';
}

export interface GameState {
    screen: GameScreen;
    hero: HeroState | null;
    stageIndex: number;
    storyIndex: number;
    battleLog: BattleLogEntry[];
    enemyHp: number;
    enemyMana: number;
    playerDefenseTurns: number;
    furyTurns: number;
    furyBoost: number;
    isPlayerTurn: boolean;
    isAnimating: boolean;
    playerAnim: AnimationState;
    enemyAnim: AnimationState;
    floatingText: string | null;
    floatingTone: 'damage' | 'heal' | 'mana' | null;
    startedAt: string | null;
}
