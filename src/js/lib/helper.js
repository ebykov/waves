/**
 * Simple images preload
 * @param {Array} urls - array of urls
 */
export const preloadImages = (urls) => {
    urls.forEach(url => {
        let image = new Image();
        image.src = url;
    });
};

/**
 * Decline russian words
 * @param {Number} number
 * @param {Array} words - array of 3 words (e.g. ['машина','машины','машин'])
 */
export const declineWord = (number, words) => {
    let result = number + '&nbsp;';

    if (number % 10 == 1 && number % 100 != 11) {
        result += words[0];
    } else if ([2, 3, 4].indexOf(number % 10) > -1 && [12, 13, 14].indexOf(number % 100) < 0) {
        result += words[1];
    } else {
        result += words[2];
    }

    return result;
};

/**
 * Format large numbers
 * @param {Number} number
 * @param {String} string - string between thousands. Non-breaking space by default
 */
export const formatNumber = (number, string = '&nbsp;') => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, string);
};

/**
 * Scroll window to target element
 * @param {Element} element
 * @param {Number} offset - offset from top
 */
export const scrollToElement = (element, offset = 0) => {
    let y = element.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - offset;

    window.scroll(0, y);

    // Uncomment when using native smooth scroll with smoothscroll-polyfill
    // window.scroll({ top: y, left: 0, behavior: 'smooth' });
};

/**
 * Copy certain string to clipboard
 * @param {String} string - string to copy
 * @param {Function} callback - fired whether command was successful or not
 */
export const copyToClipboard = (string, callback) => {
    let input = document.createElement('textarea'),
        isSuccess = false;

    Object.assign(input.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        opacity: '0'
    });

    input.value = string;
    document.body.appendChild(input);
    input.select();

    try {
        document.execCommand('copy');
        isSuccess = true;
    } catch (e) { }

    document.body.removeChild(input);

    callback(isSuccess);
};

/** Return random number in given range */
export const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};