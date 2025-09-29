// app/services/serviceWorker.ts
export class ServiceWorkerManager {
    private static instance: ServiceWorkerManager;

    static getInstance(): ServiceWorkerManager {
        if (!ServiceWorkerManager.instance) {
            ServiceWorkerManager.instance = new ServiceWorkerManager();
        }
        return ServiceWorkerManager.instance;
    }

    async register(): Promise<ServiceWorkerRegistration | null> {
        if (!('serviceWorker' in navigator)) {
            console.warn('Service Worker not supported');
            return null;
        }

        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            registration.addEventListener('updatefound', () => {
                console.log('Service Worker update available');
            });

            console.log('Service Worker registered');
            return registration;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
            return null;
        }
    }

    async clearApiCache(): Promise<boolean> {
        if (!navigator.serviceWorker.controller) return false;

        return new Promise((resolve) => {
            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
                resolve(event.data.success || false);
            };

            navigator.serviceWorker.controller.postMessage(
                { type: 'CLEAR_API_CACHE' },
                [messageChannel.port2]
            );
        });
    }

    async clearCacheForUrl(url: string): Promise<boolean> {
        if (!navigator.serviceWorker.controller) return false;

        return new Promise((resolve) => {
            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
                resolve(event.data.success || false);
            };

            navigator.serviceWorker.controller.postMessage(
                { type: 'CLEAR_CACHE_FOR_URL', url },
                [messageChannel.port2]
            );
        });
    }

    async getCacheStatus(): Promise<any> {
        if (!navigator.serviceWorker.controller) return null;

        return new Promise((resolve) => {
            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
                resolve(event.data);
            };

            navigator.serviceWorker.controller.postMessage(
                { type: 'GET_CACHE_STATUS' },
                [messageChannel.port2]
            );
        });
    }
}