/**
 * Check if localStorage is available
 */
const isAvailable = () => {
    try {
        window.localStorage.setItem('isStorageAvailable', 1);
        window.localStorage.removeItem('isStorageAvailable');

        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Get item from localStorage
 * @param {String} key
 */
export const getItem = (key) => {
    if (isAvailable()) {
        let item = window.localStorage.getItem(key);

        try {
            JSON.parse(item);
        } catch (e) {
            return item;
        }

        return JSON.parse(item);
    }
};

/**
 * Save item in localStorage
 * @param {String} key
 * @param {String} value
 */
export const setItem = (key, value) => {
    value = (typeof value === 'string') ? value : JSON.stringify(value);

    if (isAvailable()) {
        window.localStorage.setItem(key, value);
    }
};

/**
 * Remove item from localStorage
 * @param {String} key
 */
export const removeItem = (key) => {
    if (isAvailable()) {
        window.localStorage.removeItem(key);
    }
};