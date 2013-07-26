angular.module('ramlConsoleApp')
    .directive('preventDefault', function () {
        return function (scope, element, attrs) {
            var preventDefaultHandler = function (event) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            };
            element[0].addEventListener('click', preventDefaultHandler, false);
        };
    })
    .directive('scrollToIf', function () {
        return function (scope, element, attrs) {
            var scrollToHandler = function (event) {
                var elem = event.target,
                    targetOffset = elem.offsetTop,
                    currentOffset = window.scrollY,
                    scrollLeap = 80,
                    partialOffset, sign;

                if (!scope.$eval(attrs.scrollToIf)) {
                    return;
                }

                while (elem) {
                    elem = elem.offsetParent;
                    if (elem && elem.attributes['scroll-to-if']) {
                        targetOffset = 0;
                    }
                    targetOffset = targetOffset + (elem ? elem.offsetTop : 0);
                }

                targetOffset = targetOffset - 10;

                if (targetOffset === currentOffset) {
                    return;
                }

                partialOffset = currentOffset;

                function smoothScroll() {
                    if (partialOffset === -1) {
                        return;
                    }

                    if (targetOffset > currentOffset) {
                        partialOffset = partialOffset + scrollLeap;
                        partialOffset = (partialOffset > targetOffset) ? targetOffset : partialOffset;
                    }

                    if (currentOffset > targetOffset) {
                        partialOffset = partialOffset - scrollLeap;
                        partialOffset = (partialOffset < targetOffset) ? targetOffset : partialOffset;
                    }

                    window.scrollTo(0, partialOffset);
                    partialOffset = (partialOffset === targetOffset) ? -1 : partialOffset;

                    if (window.requestAnimationFrame) {
                        window.requestAnimationFrame(smoothScroll);
                    }
                }

                if (window.requestAnimationFrame) {
                    window.requestAnimationFrame(smoothScroll);
                }
            };
            element[0].addEventListener('click', scrollToHandler, false);
        };
    });