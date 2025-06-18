import { useEffect } from 'react';
import UiUtils from '@ord-core/utils/ui.utils';

const VERSION_STORAGE_KEY = 'appVersion';
const COUNTDOWN_SECONDS = 3;

export const useCheckVersion = () => {
    useEffect(() => {
        const CURRENT_VERSION = localStorage.getItem(VERSION_STORAGE_KEY);
        const worker = new Worker(new URL('/version-check.worker.js', import.meta.url));

        worker.onmessage = (event) => {
            if (event.data?.type === 'VERSION_CHECK') {
                const remoteVersion = event.data.version;

                if (!CURRENT_VERSION) {
                    localStorage.setItem(VERSION_STORAGE_KEY, remoteVersion);
                    return;
                }

                if (remoteVersion !== CURRENT_VERSION) {
                    localStorage.setItem(VERSION_STORAGE_KEY, remoteVersion);
                    console.log('[App] New version detected:', remoteVersion);
                    UiUtils.showInfo(`Có phiên bản mới (${remoteVersion}), đang tải lại sau vài giây...`);
                    let secondsLeft = COUNTDOWN_SECONDS;
                    const countdown = setInterval(() => {
                        if (secondsLeft === 0) {
                            clearInterval(countdown);
                            window.location.reload();
                        } else {
                            UiUtils.showInfo(secondsLeft);
                            console.log(`[App] Reloading in ${secondsLeft--} second(s)...`);
                        }
                    }, 1000);
                }
            }
        };

        return () => worker.terminate();
    }, []);
};
