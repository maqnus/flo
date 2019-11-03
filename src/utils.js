export const getCookie = name => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        const c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
export const eraseCookie = name => document.cookie = name + '=; Max-Age=-99999999;';
export const getSession = name => sessionStorage.getItem(name);


export class TransitionElem {

    constructor(element) {
        this.element = element;
    }

    // onRun
    // event is fired when a CSS transition has completed.In the
    // case where a transition is removed before completion, such as
    // if the transition - property is removed or display is set to none,
    // then the event will not be generated.
    onRun(...props) {
        if (this.element) {
            this.element.addEventListener('transitionrun', event => {
                if (props.length) {
                    return props.forEach(prop => {
                        if (event.propertyName == prop) {
                            console.log('transitionstart: ', event);
                        }
                    });
                }
                console.log('transitionstart: ', event);
                return event;
            });
        }
    }

    // onCancel
    // event is fired when a CSS transition has completed.In the
    // case where a transition is removed before completion, such as
    // if the transition - property is removed or display is set to none,
    // then the event will not be generated.
    onCansel(...props) {
        if (this.element) {
            this.element.addEventListener('transitioncansel', event => {
                if (props.length) {
                    return props.forEach(prop => {
                        if (event.propertyName == prop) {
                            console.log('transitionstart: ', event);
                        }
                    });
                }
                console.log('transitionstart: ', event);
                return event;
            });
        }
    }

    // onStart
    // event is fired when a CSS transition has completed.In the
    // case where a transition is removed before completion, such as
    // if the transition - property is removed or display is set to none,
    // then the event will not be generated.
    async onStart(...props) {
        if (this.element) {
            return await new Promise(resolve => {
                this.element.addEventListener('transitionstart', event => {
                    if (props.length) {
                        props.map(prop => {
                            if (event.propertyName == prop) {
                                resolve(event);
                            }
                        })
                    }
                    resolve(event);
                });
            });
        }
    }

    // onEnd
    // event is fired when a CSS transition has completed.In the
    // case where a transition is removed before completion, such as
    // if the transition - property is removed or display is set to none,
    // then the event will not be generated.
    onEnd(...props) {
        if (this.element) {
            return this.element.addEventListener('transitionend', event => {
                if (props.length) {
                    return props.forEach(prop => {
                        if (event.propertyName == prop) {
                            console.log('transitionstart: ', event);
                        }
                    });
                }
                console.log('transitionstart: ', event);
                return event;
            });
        }
    }
}
// new TransitionElem(document.querySelector('.countdown-animation-background'))
//     .onStart('width').then(event => {
//         console.log(event);
//     });