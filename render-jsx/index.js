function render(vdom, parent) {
    //parent存在就添加child并返回child引用,  不存在就返回自身
    const mount = parent ? (el => parent.appendChild(el)) : (el => el);

    if (isTextVdom(vdom)) {//文本节点
        return mount(document.createTextNode(vdom));
    } else if (isElementVdom(vdom)) {//dom节点
        const dom = mount(document.createElement(vdom.type));
        for (const child of vdom.children) {
            //继续appendChild
            render(child, dom);
        }
        for (const prop in vdom.props) {
            //添加属性
            setAttribute(dom, prop, vdom.props[prop]);
        }
        return dom;
    } else {
        throw new Error(`Invalid VDOM: ${vdom}.`);
    }
}


function isTextVdom(vdom) {
    return typeof vdom == 'string' || typeof vdom == 'number';
}


function isElementVdom(vdom) {
    return typeof vdom == 'object' && typeof vdom.type == 'string';
}


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
}


//转虚拟dom,添加自定义props
function createElement(type, props, ...children) {
    if (props === null) props = {};
    return {
        type,
        props,
        children
    };
}

export {createElement,render}
