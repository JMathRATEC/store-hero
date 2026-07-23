# Crônicas do Dragão

RPG web em turnos inspirado em clássicos de Dungeons & Dragons. Escolha sua classe, atravesse quatro fases e descubra se consegue derrotar o **Dragão Carmesim**.

A aventura roda no frontend (Vue + TypeScript). Laravel/Inertia apenas servem a página.

---

## Será que você consegue chegar até o dragão e derrotá-lo?

Uma jornada curta, desafiadora e estratégica: defesa no timing certo, mana bem gasta, poções na hora certa e upgrades entre as fases.

### Classes

| Classe | Perfil | Destaques |
|--------|--------|-----------|
| **Guerreiro** | Tanque corpo a corpo | Alta vida, escudo poderoso, golpes fortes com pouca mana |
| **Mago** | Conjurador frágil | Mana alta, véu arcano, cura e bursts mágicos |

### Fases

1. **Floresta Sombria** — Besta das Sombras  
2. **Catacumbas Rubras** — Castor Necromante  
3. **Castelo Negro** — Cavaleiro Negro  
4. **Covil do Dragão** — Dragão Carmesim *(chefão final)*

Entre as fases você forja atributos, fortalece habilidades e visita o **Mercador Errante**.

### Poções

| Poção | Efeito | Preço |
|-------|--------|-------|
| **Elixir do Alvorecer** | Restaura vida | 32 ouro |
| **Brasas da Fúria** | +ataque/magia por 3 turnos | 38 ouro |

Poções são compradas antes do combate ou após vitórias e **gastam o turno** quando usadas na batalha.

---

## Como jogar

1. Abra `/rpg` (a raiz `/` redireciona para lá).
2. Escolha **Guerreiro** ou **Mago**.
3. Leia a história, compre poções se precisar e entre em combate.
4. No seu turno: ataque, defenda, cure ou use poção.
5. Após vencer, gaste pontos de habilidade e ouro.
6. Chegue ao dragão… e tente derrubá-lo.

**Dica:** spam de ataque sem defesa costuma acabar mal. Inimigos priorizam golpes pesados quando você está desprotegido.

---

## Stack

- **Laravel 13** + **Inertia.js**
- **Vue 3** + **TypeScript**
- **Tailwind CSS 4**
- Sprites e imagens em `public/sprites` e `public/image`

O combate, inventário e progresso ficam no navegador (estado da sessão de jogo).

---

## Requisitos

- PHP 8.3+
- Composer
- Node.js 20+ (npm)
- Extensão PDO (MySQL ou SQLite, conforme seu `.env`)

Para só jogar o RPG, sessões em arquivo bastam — não é necessário banco para a página `/rpg`.

---

## Instalação

```bash
git clone git@github.com:JMathRATEC/store-hero.git
cd store-hero

composer install
cp .env.example .env
php artisan key:generate

npm install
```

Configure o `.env` conforme seu ambiente. Para desenvolvimento local sem MySQL:

```env
SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

Se usar SQLite, garanta o driver PHP (`pdo_sqlite`) e o arquivo `database/database.sqlite`.

---

## Rodando o projeto

Em dois terminais:

```bash
# terminal 1
php artisan serve

# terminal 2
npm run dev
```

Acesse:

- Jogo: [http://127.0.0.1:8000/rpg](http://127.0.0.1:8000/rpg)
- Raiz: [http://127.0.0.1:8000](http://127.0.0.1:8000) → redireciona para `/rpg`

Build de produção:

```bash
npm run build
php artisan serve
```

---

## Estrutura do jogo

```
resources/js/
  pages/Rpg.vue              # página principal
  rpg/
    components/              # UI de batalha, história, loja, etc.
    composables/useRpgGame.ts
    data/                    # classes, inimigos, fases, poções, sprites
    types.ts
routes/web.php               # / → /rpg · /rpg → Rpg
public/sprites/              # Guerreiro, Mago, Dragão
public/image/                # inimigos das fases 1–3
```

---

## Scripts úteis

```bash
npm run dev          # Vite
npm run build        # assets de produção
npm run types:check  # TypeScript (vue-tsc)
php artisan test     # testes Pest
```

---

## Créditos de assets

- Sprites de personagem (Knight / Wizard packs) em `public/sprites`
- Dragão: *Flying Dragon Rework* (ZaPaper / AntumDeluge) — ver `public/sprites/flying_dragon-1.1/LICENSE.txt`
- Imagens de monstros em `public/image`

---

## Licença

Projeto baseado no starter Laravel + Vue. Código da aplicação sob os termos do repositório; assets de terceiros mantêm suas respectivas licenças.
