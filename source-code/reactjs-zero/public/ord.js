var ord = window.ora || {};
ord.ui = ord.ui || {};
ord.ui.setBusy = function () {
    ord.event.trigger('event@ord.ui.setBusy');
};

ord.ui.clearBusy = function () {
    ord.event.trigger('event@ord.ui.clearBusy');
};
ord.notify = ord.notify || {};

ord.notify.success = function (message, title, options) {
    ord.event.trigger('event@ord.notify', {
        type: 'success', message: message, title: title, options: options
    });
};

ord.notify.info = function (message, title, options) {
    ord.event.trigger('event@ord.notify', {
        type: 'info', message: message, title: title, options: options
    });
};

ord.notify.warn = function (message, title, options) {
    ord.event.trigger('event@ord.notify', {
        type: 'warn', message: message, title: title, options: options
    });
};

ord.notify.error = function (message, title, options) {
    ord.event.trigger('event@ord.notify', {
        type: 'error', message: message, title: title, options: options
    });
};
ord.notify.errorCommonResult = function (commonResult, options) {
    ord.event.trigger('event@ord.notify.errorCommonResult', {
        commonResult: commonResult, options: options
    });
};


/* SIMPLE EVENT BUS *****************************************/
ord.event = (function () {
    var _callbacks = {};

    var on = function (eventName, callback) {
        if (!_callbacks[eventName]) {
            _callbacks[eventName] = [];
        }

        _callbacks[eventName].push(callback);
    };

    var off = function (eventName, callback) {
        var callbacks = _callbacks[eventName];
        if (!callbacks) {
            return;
        }

        var index = -1;
        for (var i = 0; i < callbacks.length; i++) {
            if (callbacks[i] === callback) {
                index = i;
                break;
            }
        }

        if (index < 0) {
            return;
        }

        _callbacks[eventName].splice(index, 1);
    };

    var trigger = function (eventName) {
        var callbacks = _callbacks[eventName];
        if (!callbacks || !callbacks.length) {
            return;
        }

        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < callbacks.length; i++) {
            callbacks[i].apply(this, args);
        }
    };

    // Public interface ///////////////////////////////////////////////////

    return {
        on: on,
        off: off,
        trigger: trigger,
    };
})();
ord.flattenData = function collect(array, groupKey, result) {
    array.forEach(function (el) {
        if (el[groupKey]) {
            collect(el[groupKey], groupKey, result);
        } else {
            result.push(el);
        }
    });
};
