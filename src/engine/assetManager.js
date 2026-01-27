import { ASSET_PATHS } from './constants.js';

class AssetManager {
    constructor() {
        this.labyrinthSpritesheet = null;
        this.images = {};
        this.gifs = {};
        this.levels = {};
    }

    loadImage(key, path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            this.images[key] = img;
            resolve();
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
    });
}

    loadGif(key, path) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            this.gifs[key] = img;
            resolve();
        };
        img.onerror = () => reject(new Error(`Failed to load gif: ${path}`));
    });
    }

    loadLevel(key, path) {
    return fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load level: ${path}`);
            }
            return response.text();
        })
        .then(data => {
            this.levels[key] = data;
        });
    }

    // Load specific asset on demand
    async loadAssetByKey(key) {
        const asset = ASSET_PATHS[key];
        if (!asset) throw new Error(`Asset not found: ${key}`);
        
        if (asset.type === 'image') {
            await this.loadImage(key, asset.path);
        } else if (asset.type === 'gif') {
            await this.loadGif(key, asset.path);
        } else if (asset.type === 'level') {
            await this.loadLevel(key, asset.path);
        } else {
            throw new Error(`Unknown asset type for key: ${key}`);
        }
    }

    // Load everything at once
    async loadAllAssets() {
        for (const [key, asset] of Object.entries(ASSET_PATHS)) {
            await this.loadAssetByKey(key);
        }
    }
    
    // BONUS: Replace asset (for skins)
    replaceAsset(key, newImage) {
        if (this.images[key]) {
            this.images[key] = newImage;
        } else if (this.gifs[key]) {
            this.gifs[key] = newImage;
        }
    }
    
    // BONUS: Get asset by key
    getAsset(key) {
        return this.images[key] || this.gifs[key] || this.levels[key];
    }
}

export const assetManager = new AssetManager();