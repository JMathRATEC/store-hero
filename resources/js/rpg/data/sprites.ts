import type { HeroClass } from '../types';

export interface SpriteClip {
    src: string;
    frames: number;
    frameWidth: number;
    frameHeight: number;
    fps: number;
    loop: boolean;
}

const knight = (
    file: string,
    frames: number,
    fps = 8,
    loop = true,
): SpriteClip => ({
    src: `/sprites/Knight_1/${encodeURIComponent(file)}`,
    frames,
    frameWidth: 128,
    frameHeight: 128,
    fps,
    loop,
});

const wizard = (
    file: string,
    frames: number,
    fps = 8,
    loop = true,
): SpriteClip => ({
    src: `/sprites/Fire Wizard/${encodeURIComponent(file)}`,
    frames,
    frameWidth: 128,
    frameHeight: 128,
    fps,
    loop,
});

export const HERO_SPRITES: Record<HeroClass, Record<string, SpriteClip>> = {
    warrior: {
        idle: knight('Idle.png', 4, 6),
        walk: knight('Walk.png', 8, 10),
        run: knight('Run.png', 7, 12),
        attack: knight('Attack 1.png', 5, 12, false),
        hurt: knight('Hurt.png', 2, 8, false),
        defend: knight('Defend.png', 5, 10, false),
        dead: knight('Dead.png', 6, 8, false),
        cast: knight('Attack 2.png', 4, 10, false),
    },
    mage: {
        idle: wizard('Idle.png', 7, 7),
        walk: wizard('Walk.png', 6, 9),
        run: wizard('Run.png', 8, 11),
        attack: wizard('Attack_1.png', 4, 10, false),
        hurt: wizard('Hurt.png', 3, 8, false),
        defend: wizard('Attack_1.png', 4, 10, false),
        dead: wizard('Dead.png', 6, 8, false),
        cast: wizard('Attack_2.png', 4, 10, false),
    },
};

export const DRAGON_SPRITE: SpriteClip = {
    src: '/sprites/flying_dragon-1.1/PNG/144x128/flying_dragon-red.png',
    frames: 3,
    frameWidth: 144,
    frameHeight: 128,
    fps: 6,
    loop: true,
};
