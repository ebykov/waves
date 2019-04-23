function requestAnimate(options) {

  var start = performance.now();

  requestAnimationFrame(function animate(time) {
    var timeFraction = (time - start) / options.duration;
    if (timeFraction > 1) timeFraction = 1;

    var progress = options.timing(timeFraction)

    options.draw(progress);

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }

  });
}

function one (node, type, callback) {
    type = type.split(' ');
    for (let i = 0; i < type.length; i++) {
        let func = function (e) {
            for (let j = 0; j < type.length; j++) {
                e.currentTarget.removeEventListener(type[j], func);
            }
            return callback(e)
        }
        node.addEventListener(type[i], func, false);
    }
}

function animate(elem, className, duration = false, delay = false) {
    return new Promise((resolve, reject) => {
        one(elem, 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
            if (duration) { elem.style.animationDuration = ''; }
            if (delay) { elem.style.animationDelay = ''; }
            elem.classList.remove(className);
            elem.classList.remove('animated');

            resolve();
        });

        if (duration) { elem.style.animationDuration = duration; }
        if (delay) { elem.style.animationDelay = delay; }

        elem.classList.add(className);
        elem.classList.add('animated');
    });
}

export {
    animate,
    requestAnimate
}