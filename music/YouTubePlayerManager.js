class YouTubePlayerManager {
    constructor() {
        this.apiReadyPromise = null;
        this.player = null;
        this.state = {
            isYouTubePlaying: false,
            shouldAutoplayYouTube: false
        };
    }

    /**
     * Safely loads YouTube IFrame API and returns a Promise.
     * The Promise resolves when the API is ready.
     * @returns {Promise<void>}
     */
    loadAPI() {
        if (this.apiReadyPromise) {
            return this.apiReadyPromise;
        }

        this.apiReadyPromise = new Promise((resolve) => {
            // If YT object already exists, the API is already loaded
            if (window.YT && window.YT.Player) {
                resolve();
                return;
            }

            // Set up the global callback to be called by YouTube API
            window.onYouTubeIframeAPIReady = () => {
                console.log('YouTube Iframe API is ready.');
                resolve();
            };

            // Dynamically create and insert the script tag with async attribute
            const scriptTag = document.createElement('script');
            scriptTag.src = 'https://www.youtube.com/iframe_api';
            scriptTag.async = true; // This addresses the performance issue
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);
        });

        return this.apiReadyPromise;
    }

    /**
     * Initializes the player
     * @param {string} elementId - The DOM element ID for the player container
     * @param {object} options - Options containing videoId and playerVars
     * @returns {Promise<YT.Player>}
     */
    async initPlayer(elementId, options) {
        try {
            // Ensure API is loaded before creating player
            await this.loadAPI();

            // If we already have a player instance, destroy it first
            if (this.player) {
                this.player.destroy();
            }

            return new Promise((resolve) => {
                const playerConfig = {
                    videoId: options.videoId,
                    playerVars: options.playerVars,
                    events: {
                        'onReady': (event) => this.onPlayerReady(event, resolve),
                        'onStateChange': (event) => this.onPlayerStateChange(event),
                        'onError': (event) => this.onPlayerError(event)
                    }
                };

                // Add host if provided, or default to https://www.youtube.com for better PWA support
                if (options.host) {
                    playerConfig.host = options.host;
                } else {
                    playerConfig.host = 'https://www.youtube.com';
                }

                this.player = new YT.Player(elementId, playerConfig);
            });

        } catch (error) {
            console.error('Failed to initialize YouTube player:', error);
            throw error;
        }
    }

    onPlayerReady(event, resolve) {
        console.log('Player is ready.');
        // Use CustomEvent to dispatch events
        document.dispatchEvent(new CustomEvent('youtubePlayerReady', {
            detail: {
                player: event.target,
                stateManager: this.state
            }
        }));
        resolve(event.target); // Resolve initPlayer's promise
    }

    onPlayerStateChange(event) {
        // Map player states to custom events
        const stateMap = {
            [YT.PlayerState.PLAYING]: 'youtubePlayerPlaying',
            [YT.PlayerState.PAUSED]: 'youtubePlayerPaused',
            [YT.PlayerState.ENDED]: 'youtubePlayerEnded',
            [YT.PlayerState.BUFFERING]: 'youtubePlayerBuffering',
            [YT.PlayerState.CUED]: 'youtubePlayerCued'
        };

        const eventName = stateMap[event.data];
        if (eventName) {
            document.dispatchEvent(new CustomEvent(eventName, {
                detail: {
                    player: event.target,
                    state: event.data,
                    stateManager: this.state
                }
            }));
        }
    }
    
    onPlayerError(event) {
        console.error('YouTube Player Error:', event.data);
        document.dispatchEvent(new CustomEvent('youtubePlayerError', { 
            detail: { 
                error: event.data,
                stateManager: this.state
            } 
        }));
    }

    // Public methods to get player state and instance
    isPlaying() {
        if (this.player && typeof this.player.getPlayerState === 'function') {
            const playerState = this.player.getPlayerState();
            return playerState === YT.PlayerState.PLAYING;
        }
        return this.state.isYouTubePlaying;
    }

    getPlayer() {
        return this.player;
    }

    setState(newState) {
        Object.assign(this.state, newState);
    }

    getState() {
        return this.state;
    }

    // Control methods
    playVideo() {
        if (this.player) {
            this.player.playVideo();
            this.state.isYouTubePlaying = true;
        }
    }

    pauseVideo() {
        if (this.player) {
            this.player.pauseVideo();
            this.state.isYouTubePlaying = false;
        }
    }

    loadVideoById(videoId) {
        if (this.player) {
            this.player.loadVideoById(videoId);
        }
    }

    // Additional control methods
    seekTo(seconds, allowSeekAhead) {
        if (this.player) {
            this.player.seekTo(seconds, allowSeekAhead);
        }
    }

    getCurrentTime() {
        if (this.player) {
            return this.player.getCurrentTime();
        }
        return 0;
    }

    getDuration() {
        if (this.player) {
            return this.player.getDuration();
        }
        return 0;
    }

    getPlayerState() {
        if (this.player) {
            return this.player.getPlayerState();
        }
        return -1; // Unstarted state
    }
}