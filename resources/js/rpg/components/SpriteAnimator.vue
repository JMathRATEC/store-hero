<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { SpriteClip } from '../data/sprites';

const props = withDefaults(
    defineProps<{
        clip: SpriteClip;
        scale?: number;
        flip?: boolean;
        row?: number;
        sheetColumns?: number;
        sheetRows?: number;
    }>(),
    {
        scale: 2.2,
        flip: false,
        row: 0,
        sheetColumns: 0,
        sheetRows: 1,
    },
);

const frame = ref(0);
let timer: number | undefined;

const width = computed(() => props.clip.frameWidth * props.scale);
const height = computed(() => props.clip.frameHeight * props.scale);
const cols = computed(() => props.sheetColumns || props.clip.frames);

const style = computed(() => {
    const col = frame.value % cols.value;
    const x = -col * props.clip.frameWidth * props.scale;
    const y = -props.row * props.clip.frameHeight * props.scale;
    const sheetW = cols.value * props.clip.frameWidth * props.scale;
    const sheetH = props.sheetRows * props.clip.frameHeight * props.scale;

    return {
        width: `${width.value}px`,
        height: `${height.value}px`,
        backgroundImage: `url("${props.clip.src}")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `${x}px ${y}px`,
        backgroundSize: `${sheetW}px ${sheetH}px`,
        transform: props.flip ? 'scaleX(-1)' : undefined,
        imageRendering: 'pixelated' as const,
    };
});

function start() {
    stop();
    frame.value = 0;
    const interval = Math.max(40, Math.round(1000 / props.clip.fps));
    timer = window.setInterval(() => {
        if (!props.clip.loop && frame.value >= props.clip.frames - 1) {
            stop();
            return;
        }
        frame.value = (frame.value + 1) % props.clip.frames;
    }, interval);
}

function stop() {
    if (timer) {
        window.clearInterval(timer);
        timer = undefined;
    }
}

onMounted(start);
onBeforeUnmount(stop);

watch(
    () => [props.clip.src, props.clip.frames, props.clip.fps, props.row],
    () => start(),
);
</script>

<template>
    <div class="sprite-frame shrink-0" :style="style" role="img" aria-hidden="true" />
</template>
