/**
 * Make html element
 * @param {String} tagName
 * @param {Array|String} classNames - array of classnames or string for single classname
 * @param {Object} attributes - object with html attributes
 */
export const makeElement = (tagName, classNames = [], attributes = []) => {
    tagName = tagName.toLowerCase();

    let element = document.createElement(tagName);

    if (classNames) {
        if (typeof classNames === 'object') {
            classNames.forEach(cname => {
                element.classList.add(cname);
            });
        } else if (typeof classNames === 'string') {
            element.classList.add(classNames);
        }
    }

    for (let attr in attributes) {
        if (attr === 'data') {
            let dataAttributes = attributes[attr];

            for (let attr in dataAttributes) {
                element.dataset[attr] = dataAttributes[attr];
            }
        } else {
            element[attr] = attributes[attr];
        }
    }

    return element;
};

/**
 * Cache elements with [data-view] attribute and put them in given object
 * @param {Object} obj - object
 */
export const cacheElements = (obj, attr = 'view') => {
    let newObj = {},
        elements = document.querySelectorAll(`[data-${attr}]`);

    Array.prototype.forEach.call(elements, el => {
        let name = el.dataset[attr];
        newObj[name] = el;
    });

    Object.assign(obj, newObj);
};

/**
 * Get all siblings of specified element, excluding this element
 * @param {Element} element
 */
export const getSiblings = (element) => {
    let siblings = [],
        sibling = element.parentNode.firstChild;

    for (; sibling; sibling = sibling.nextSibling) {
        if (sibling.nodeType !== 1 || sibling === element) continue;
        siblings.push(sibling);
    }

    return siblings;
};

/**
 * Remove all children from element
 * @param {Element} parent
 */
export const removeChildren = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

/**
 * Remove specified element from its parent
 * @param {Element} element
 */
export const removeElement = (element) => {
    if (element) {
        element.parentNode.removeChild(element);
    }
};

/**
 * Transform html string to node
 * @param {String} html
 */
export const htmlStringToNode = (html) => {
    let el = document.createElement('div');

    el.innerHTML = html;

    return el.firstChild;
};

/**
 * Prepend source element before first child of target element
 * @param {Element} parent
 * @param {Element} el
 */
export const prepend = (parent, el) => {
    parent.insertBefore(el, parent.firstChild);
};

/** Quick check if element is in DOM */
export const isElementInDom = (el) => {
    return el.parentNode;
};