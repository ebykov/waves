/**
 * Find most frequent value in array
 * @param {Array} array
 */
export const getMostFrequentValue = (array) => {
    let result = [...array];

    return result.sort((a, b) =>
        result.filter(v => v === a).length - result.filter(v => v === b).length
    ).pop();
};

/**
 * Shuffle an array (original array will be modified)
 * @param {Array} array
 */
export const shuffle = (array) => {
    let j, x, i;

    for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
};

/**
 * Convert nodelist to array
 * @param {NodeList} nodeList
 */
export const toArray = (nodeList) => {
    return Array.prototype.slice.call(nodeList);
};