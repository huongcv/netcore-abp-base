const CHECK_INTERVAL = 10000; // 10s

const VERSION_STORAGE_KEY = 'app-version2';

function checkVersion() {
    fetch('/meta.json', { cache: 'no-store' })
        .then(res => res.json())
        .then(({ version }) => {
            self.postMessage({ type: 'VERSION_CHECK', version });
        })
        .catch((err) => {
            console.warn('[Worker] Failed to check version', err);
        });
}

setInterval(checkVersion, CHECK_INTERVAL);
