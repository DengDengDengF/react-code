function isTextVdom(vdom) {
    return typeof vdom == 'string' || typeof vdom == 'number';
}

function isElementVdom(vdom) {
    return typeof vdom == 'object' && typeof vdom.type == 'string';
}

function isComponentVdom(vdom) {
    return typeof vdom.type == 'function';
}

const render = (vdom, parent = null) => {
    const mount = parent ? el => parent.appendChild(el) : el => el;

    if (isTextVdom(vdom)) {
        return mount(document.createTextNode(vdom));
    } else if (isElementVdom(vdom)) {
        const dom = mount(document.createElement(vdom.type));

        for (const child of [].concat(...vdom.children)) {
            render(child, dom);
        }

        for (const prop in vdom.props) {
            setAttribute(dom, prop, vdom.props[prop]);
        }

        return dom;
    } else if (isComponentVdom(vdom)) {
        const props = Object.assign({}, vdom.props, {
            children: vdom.children
        });

        if (Component.isPrototypeOf(vdom.type)) {
            //Component的子组件中传递props
            const instance = new vdom.type(props);
            instance.componentWillMount();
            //Component的子组件render--->利用createElement转化成虚拟dom
            const componentVdom = instance.render();
            instance.dom = render(componentVdom, parent);
            instance.componentDidMount();
            return instance.dom;
        } else {
            const componentVdom = vdom.type(props);
            return render(componentVdom, parent);
        }
    } else {
        throw new Error(`Invalid VDOM: ${vdom}.`);
    }
};

function isEventListenerAttr(key, value) {
    return typeof value == 'function' && key.startsWith('on');
}

function isStyleAttr(key, value) {
    return key == 'style' && typeof value == 'object';
}

function isPlainAttr(key, value) {
    return typeof value != 'object' && typeof value != 'function';
}

const setAttribute = (dom, key, value) => {
    if (isEventListenerAttr(key, value)) {
        const eventType = key.slice(2).toLowerCase();
        dom.addEventListener(eventType, value);
    } else if (isStyleAttr(key, value)) {
        Object.assign(dom.style, value);
    } else if (isPlainAttr(key, value)) {
        dom.setAttribute(key, value);
    }
};

const createElement = (type, props, ...children) => {
    if (props === null) props = {};
    return {
        type,
        props,
        children
    };
};

class Component {
    constructor(props) {
        this.props = props || {};
        this.state = null;
    }

    setState(nextState) {
        this.state = nextState;
    }

    componentWillMount() {
        return undefined;
    }

    componentDidMount() {
        return undefined;
    }

}

export {createElement, render, Component}
