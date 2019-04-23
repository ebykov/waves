import Config from './../config';
import * as Analytics from './lib/analytics';

/**
 * Base special constructor with common methods
 */
class BaseSpecial {

    constructor() {
        this.keyCodes = {
            enter: 13
        };
        this.params = {
            container: document.body
        };

        if (Config.sendPageView) {
            Analytics.sendPageView();
        }
    }

    /**
     * Save custom params
     * @param {Object} params - params object with custom values
     */
    saveParams() {
        Object.assign(this.params, Config);
        this.container = this.params.container;

        this.addEventListeners();
    }

    /**
     * Load css file
     * @param {String} path
     */
    loadStyles(path) {
        return new Promise((resolve, reject) => {
            let link = document.createElement('link');

            link.rel = 'stylesheet';
            link.href = path;

            link.onload = () => resolve();
            link.onerror = () => reject();

            document.body.appendChild(link);
        });
    }

    /**
     * Add event listeners to document
     */
    addEventListeners() {
        this.params.listenedEvents.forEach(eventName => {
            this.container.addEventListener(eventName, event => this.defaultEventHandler(event, eventName));
        });
    }

    /**
     * Default events handler
     * @param {Object} event
     * @param {String} eventName
     */
    defaultEventHandler(event, eventName) {
        let target = event.target;
        let action;

        while (target.parentNode && target !== event.currentTarget) {
            action = target.dataset[eventName];

            /** Send all links clicks to analytics */
            if (eventName === 'click' && target.tagName.toLowerCase() === 'a') {
                Analytics.sendEvent(target.href);
            }

            if (action) break;
            target = target.parentNode;
        }

        action = target.dataset[eventName];

        if (action && this[action]) {
            this[action](event.target, event);
        }
    }

}

export default BaseSpecial;