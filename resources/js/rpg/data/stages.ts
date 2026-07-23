import type { StageDefinition } from '../types';

export const STAGES: StageDefinition[] = [
    {
        id: 1,
        name: 'Floresta Sombria',
        chapter: 'Capítulo I',
        story: [
            'As tochas da taverna tremulam quando o mensageiro chega: o Dragão Carmesim despertou nas Montanhas de Cinza.',
            'Para chegar ao covil, você precisa atravessar a Floresta Sombria — onde algo faminto observa entre as árvores.',
            'Dica do bardo: quem só ataca cai. Defenda, meça a mana e escolha o golpe.',
        ],
        victoryStory:
            'A besta se dissolve em névoa. No chão, um amuleto brilha: o caminho das catacumbas se abre.',
        enemyId: 'shadowBeast',
        xpReward: 1,
        skillPoints: 1,
        goldReward: 48,
        hpBonus: 12,
        manaBonus: 6,
        attackBonus: 2,
        magicBonus: 2,
        defenseBonus: 1,
    },
    {
        id: 2,
        name: 'Catacumbas Rubras',
        chapter: 'Capítulo II',
        story: [
            'Debaixo do vilarejo, corredores de ossos ecoam com risadas agudas.',
            'O Castor Necromante se cura enquanto te drena. Interrompa o ritmo dele com pressão e defesa.',
            'Você recusa o pacto. As tochas se apagam. Os mortos se agitam.',
        ],
        victoryStory:
            'O grimório do necromante cai. Nele, um mapa do Castelo Negro — e um aviso: o guardião não conhece piedade.',
        enemyId: 'beaverNecro',
        xpReward: 1,
        skillPoints: 1,
        goldReward: 62,
        hpBonus: 14,
        manaBonus: 8,
        attackBonus: 3,
        magicBonus: 3,
        defenseBonus: 2,
    },
    {
        id: 3,
        name: 'Castelo Negro',
        chapter: 'Capítulo III',
        story: [
            'Torres partidas rasgam o céu. No portão, um cavaleiro de armadura negra ergue uma espada em chamas.',
            'Ele prepara combos devastadores. Sem barreira antes do golpe pesado, a jornada termina aqui.',
            'Aqui não há diálogo. Só aço, fogo e estratégia.',
        ],
        victoryStory:
            'O cavaleiro tomba. Além do portão, o calor do vulcão e o bater de asas anunciam o Dragão Carmesim.',
        enemyId: 'blackKnight',
        xpReward: 1,
        skillPoints: 1,
        goldReward: 80,
        hpBonus: 16,
        manaBonus: 10,
        attackBonus: 3,
        magicBonus: 3,
        defenseBonus: 2,
    },
    {
        id: 4,
        name: 'Covil do Dragão',
        chapter: 'Capítulo Final',
        story: [
            'Pedra derretida. Ossos de reis. O Dragão Carmesim abre os olhos — dois sóis de ódio antigo.',
            'Ele pune ganância: spam de ataque sem véu/escudo é convite à Fúria do Dragão.',
            'Agora só resta uma pergunta: você chega até o dragão… e consegue derrotá-lo?',
        ],
        victoryStory:
            'O dragão cai. As cinzas se abrem em luz dourada. O reino respira — e sua lenda começa.',
        enemyId: 'dragon',
        xpReward: 2,
        skillPoints: 2,
        goldReward: 0,
        hpBonus: 0,
        manaBonus: 0,
        attackBonus: 0,
        magicBonus: 0,
        defenseBonus: 0,
    },
];

export const STORAGE_KEY = 'store-hero-rpg-session';
