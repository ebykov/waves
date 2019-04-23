/**
 * XMLHttpRequest
 * @param {String} url
 * @param {String} type - GET or POST
 * @param {Formdata} data - FormData object
 */
export default (url, type = 'GET', data = '') => {

    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();

        request.open(type, url);

        /** Special headers for cmtt sites */
        request.setRequestHeader('X-This-Is-CSRF', 'THIS IS SPARTA!');

        if (window.__static_version) {
            request.setRequestHeader('X-JS-Version', window.__static_version);
        }

        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                resolve(request.response);
            } else {
                reject(request.statusText);
            }
        };

        request.onerror = () => reject(request.statusText);

        request.send(data);
    });

};