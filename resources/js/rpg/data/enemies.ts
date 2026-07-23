import type { EnemyDefinition } from '../types';

const encodePath = (path: string) =>
    path
        .split('/')
        .map((segment) => encodeURIComponent(segment))
        .join('/');

export const ENEMIES: Record<string, EnemyDefinition> = {
    shadowBeast: {
        id: 'shadowBeast',
        name: 'Besta das Sombras',
        title: 'Sentinela da Floresta',
        description: 'Rápida e voraz. Castiga quem só ataca sem se proteger.',
        difficulty: 'fácil',
        maxHp: 145,
        maxMana: 40,
        attack: 18,
        defense: 7,
        magic: 10,
        image: encodePath('/image/monster idle animation (Remix).gif'),
        skills: [
            {
                id: 'claw',
                name: 'Garra Sombria',
                damage: 20,
                manaCost: 0,
                type: 'physical',
            },
            {
                id: 'howl',
                name: 'Uivo Enlouquecedor',
                damage: 28,
                manaCost: 10,
                type: 'magic',
            },
            {
                id: 'pounce',
                name: 'Salto Predador',
                damage: 34,
                manaCost: 14,
                type: 'physical',
            },
        ],
    },
    beaverNecro: {
        id: 'beaverNecro',
        name: 'Castor Necromante',
        title: 'Senhor das Catacumbas',
        description:
            'Drena vida e se cura. Sem pressão constante e defesa no momento certo, a luta se alonga até te matar.',
        difficulty: 'médio',
        maxHp: 210,
        maxMana: 110,
        attack: 12,
        defense: 10,
        magic: 24,
        image: encodePath('/image/beaver necromancer in red robes.png'),
        skills: [
            {
                id: 'boneBolt',
                name: 'Dardo Ósseo',
                damage: 26,
                manaCost: 10,
                type: 'magic',
            },
            {
                id: 'drain',
                name: 'Drenar Alma',
                damage: 18,
                manaCost: 14,
                type: 'heal',
                heal: 28,
            },
            {
                id: 'hex',
                name: 'Maldição Rubra',
                damage: 38,
                manaCost: 20,
                type: 'magic',
            },
            {
                id: 'boneStorm',
                name: 'Tempestade Óssea',
                damage: 46,
                manaCost: 28,
                type: 'magic',
            },
        ],
    },
    blackKnight: {
        id: 'blackKnight',
        name: 'Cavaleiro Negro',
        title: 'Guardião do Portão',
        description:
            'Golpes pesados. Sem escudo/véu antes dos combos, a armadura negra te esmaga.',
        difficulty: 'difícil',
        maxHp: 300,
        maxMana: 70,
        attack: 30,
        defense: 18,
        magic: 12,
        image: encodePath(
            '/image/Um cavaleiro todo preto com uma espada vermelha flamejante.png',
        ),
        skills: [
            {
                id: 'flameSlash',
                name: 'Corte Flamejante',
                damage: 34,
                manaCost: 0,
                type: 'physical',
            },
            {
                id: 'crush',
                name: 'Esmagamento',
                damage: 46,
                manaCost: 12,
                type: 'physical',
            },
            {
                id: 'infernoBlade',
                name: 'Lâmina Infernal',
                damage: 58,
                manaCost: 18,
                type: 'magic',
            },
            {
                id: 'executeStrike',
                name: 'Sentença Negra',
                damage: 72,
                manaCost: 26,
                type: 'physical',
            },
        ],
    },
    dragon: {
        id: 'dragon',
        name: 'Dragão Carmesim',
        title: 'O Último Julgamento',
        description:
            'Alterna fôlego e fúria. Só sobrevive quem gerencia mana, cura e defesa como um estrategista.',
        difficulty: 'lendário',
        maxHp: 480,
        maxMana: 150,
        attack: 36,
        defense: 22,
        magic: 34,
        image: '/sprites/flying_dragon-1.1/PNG/144x128/flying_dragon-red.png',
        isSpriteSheet: true,
        frameWidth: 144,
        frameHeight: 128,
        frames: 3,
        columns: 3,
        rows: 4,
        skills: [
            {
                id: 'bite',
                name: 'Mordida Ancestral',
                damage: 38,
                manaCost: 0,
                type: 'physical',
            },
            {
                id: 'wingBuffet',
                name: 'Vendaval de Asas',
                damage: 48,
                manaCost: 14,
                type: 'physical',
            },
            {
                id: 'fireBreath',
                name: 'Sopro de Fogo',
                damage: 64,
                manaCost: 24,
                type: 'magic',
            },
            {
                id: 'dragonFury',
                name: 'Fúria do Dragão',
                damage: 88,
                manaCost: 36,
                type: 'magic',
            },
        ],
    },
};
