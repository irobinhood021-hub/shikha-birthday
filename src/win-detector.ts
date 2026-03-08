const winAudio = new Audio('/wini.m4a');
let hasPlayedWinAudio = false;

const observer = new MutationObserver(() => {
    if (hasPlayedWinAudio) return;

    const gameEnd = document.getElementById('game-end');
    const gameEndMsg = document.getElementById('game-end-msg');

    // Check if the game-end container is visible
    if (gameEnd && !gameEnd.classList.contains('hidden')) {
        const text = gameEndMsg?.textContent || '';

        // The prompt notes checking for "You Win". The current codebase uses "You collected..."
        // We check for variations to ensure it catches the winning state.
        if (text.toLowerCase().includes('you win') || text.toLowerCase().includes('you collected')) {
            winAudio.play().catch(e => console.error("Error playing win audio:", e));
            hasPlayedWinAudio = true;
            observer.disconnect();
        }
    }
});

// Observe the whole document body to make sure we don't miss any DOM changes
observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
});
