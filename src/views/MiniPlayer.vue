<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { setTheme } from '@/utils/utils';

const currentSong = ref(null);
const playerProgress = ref(0);

const updateCurrentSong = (data) => {
    if(!data) return;
    currentSong.value = JSON.parse(data);
}

const upddateProgress = (data) => {
    if(!data) return;
    playerProgress.value = parseFloat(data);
}

/** @param {StorageEvent} ev */
const storageHandler = (ev) => {
    // console.log(ev);
    if(!ev.key) return;
    switch(ev.key) {
        case 'current_song':
            updateCurrentSong(ev.newValue);
            break;
        case 'player_progress':
            upddateProgress(ev.newValue);
            break;
    }
}

const onWindowShrinked = (event, side) => {
    document.body.classList.add('shrinked');
    document.body.classList.toggle('shrink-left', side === 'left');
    document.body.classList.toggle('shrink-right', side === 'right');
}

const onWindowExpanded = () => {
    document.body.classList.remove('shrinked', 'shrink-left', 'shrink-right');
}

onMounted(() => {
    window.addEventListener('storage', storageHandler);
    updateCurrentSong(localStorage.getItem('current_song'));
    upddateProgress(localStorage.getItem('player_progress'));

    setTheme(localStorage.getItem('theme') || 'light');

    window.electron?.ipcRenderer.on('window-shrinked', onWindowShrinked);
    window.electron?.ipcRenderer.on('window-expanded', onWindowExpanded);
});

onUnmounted(() => {
    window.removeEventListener('storage', storageHandler);

    window.electron?.ipcRenderer.off('window-shrinked', onWindowShrinked);
    window.electron?.ipcRenderer.off('window-expanded', onWindowExpanded);
});
</script>

<template>
    <div class="mini-player">
        <div class="song-info">
            <div class="cover-and-play">
                <img class="song-cover" :src="currentSong?.img" :alt="currentSong?.name" />
                <button class="play-btn" type="button"><i class="fas fa-play"></i></button>
            </div>
            <div class="song-title">
                <span class="song-name">{{ currentSong?.name }}</span>
                <span class="song-author">{{ currentSong?.author }}</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
body {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

body.shrinked {
    opacity: 0.5;
}

body.shrinked.shrink-left {
    transform: translateX(-20px);
}

body.shrinked.shrink-right {
    transform: translateX(20px);
}
</style>

<style lang="scss" scoped>
.mini-player {
    -webkit-app-region: drag;
    width: calc(100vw - 2px);
    height: calc(100vh - 2px);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background-color: var(--background-color);
    font-size: 0.8rem;

    button {
        margin: 0;
        padding: 0;
        border: 0;
        background-color: transparent;

        :hover {
            opacity: 0.6;
        }
    }
}

.song-info {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.cover-and-play {
    display: block;
    width: 64px;
    height: 100%;

    .song-cover {
        width: auto;
        height: 100%;
        position: absolute;
    }

    .play-btn {
        position: absolute;
        color: white;
    }
}

.song-title {
    >* {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 8rem;
        height: 1rem;
    }
}
</style>