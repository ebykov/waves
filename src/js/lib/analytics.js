import Config from './../../config';

const CONSOLE_STYLE = 'color: #E87E04';

/**
 * Send analytics events via GTM
 * @param {String} label - event label
 * @param {String} action - event action ("Click" by default)
 */
export const sendEvent = (label, action = 'Click') => {
    let value = `${Config.analyticsCategory} — ${label} — ${action}`;

    if (!IS_PRODUCTION) {
        console.log(`Analytics: %c${value}`, CONSOLE_STYLE);
    }

    if (window.dataLayer !== undefined && Config.analyticsCategory) {
        window.dataLayer.push({
            event: 'data_event',
            data_description: value
        });
    }
};

/**
 * Send pageview event via GTM
 */
export const sendPageView = () => {
    if (!IS_PRODUCTION) {
        console.log('Analytics: %cPage — View', CONSOLE_STYLE);
    }

    if (window.dataLayer !== undefined) {
        window.dataLayer.push({
            event: 'Page — View',
            post_details: {},
            section: 'special',
            tags: [],
            title: document.title,
            url: window.location.pathname
        });
    }
};