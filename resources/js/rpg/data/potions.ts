import type { PotionDefinition } from '../types';

export const POTIONS: PotionDefinition[] = [
    {
        id: 'elixir_dawn',
        name: 'Elixir do Alvorecer',
        description: 'Seiva dourada que restaura as feridas do combate.',
        effect: 'heal',
        healAmount: 55,
        price: 32,
        accent: '#e8a0a0',
    },
    {
        id: 'ember_fury',
        name: 'Brasas da Fúria',
        description:
            'Tintura de carvão e sangue de salamandra. Aumenta ataque e magia por 3 turnos.',
        effect: 'attack',
        attackBoost: 10,
        boostTurns: 3,
        price: 38,
        accent: '#e07a3a',
    },
];

export function getPotion(id: string): PotionDefinition | undefined {
    return POTIONS.find((potion) => potion.id === id);
}
