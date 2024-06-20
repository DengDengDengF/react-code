let wipRoot = null; //根节点
let nextFiberReconcileWork = null;//临时尾节点

//创建虚拟dom元素
function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child => typeof child === "object" ? child : createTextElement(child))
        }
    };
}//虚拟dom节点的文本属性
//创建虚拟dom元素的文本节点
function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: []
        }
    };
}

//使用requestIdleCallback,在空闲时间调度，把vdom转换成fiber链表
function workLoop(deadline) {
    // debugger
    let shouldYield = false;
    //vdom转换成fiber链表
    while (nextFiberReconcileWork && !shouldYield) {
        nextFiberReconcileWork = performNextWork(nextFiberReconcileWork);
        shouldYield = deadline.timeRemaining() < 1;
    }
    //fiber链表生成完毕，一次性渲染
    if (!nextFiberReconcileWork && wipRoot) {
        commitRoot();
    }

    requestIdleCallback(workLoop);
}


//fiber链表转换，从上至下进行，从左至右进行
function performNextWork(fiber) {
    reconcile(fiber);
    //先检查子节点
    if (fiber.child) {
        return fiber.child;
    }

    let nextFiber = fiber;

    while (nextFiber) {
        //再检查兄弟关系
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        //没有子节点、兄弟节点，就返回父节点...
        nextFiber = nextFiber.return;
    }
}

//提前创建对应的dom节点，以及做diff确定增删改
function reconcile(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber);
    }
    //搞定子节点的父、子节点的兄弟
    reconcileChildren(fiber, fiber.props.children);
}

//创建dom节点、设置属性
function createDom(fiber) {
    const dom = fiber.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type);

    for (const prop in fiber.props) {
        setAttribute(dom, prop, fiber.props[prop]);
    }

    return dom;
}

//事件/function 格式判断
function isEventListenerAttr(key, value) {
    return typeof value == 'function' && key.startsWith('on');
}

//样式格式判断
function isStyleAttr(key, value) {
    return key == 'style' && typeof value == 'object';
}

//简单赋值 格式判断
function isPlainAttr(key, value) {
    return typeof value != 'object' && typeof value != 'function';
}

//设置属性
const setAttribute = (dom, key, value) => {
    if (key === 'children') {
        return;
    }

    if (key === 'nodeValue') {
        dom.textContent = value;
    } else if (isEventListenerAttr(key, value)) {
        const eventType = key.slice(2).toLowerCase();
        dom.addEventListener(eventType, value);
    } else if (isStyleAttr(key, value)) {
        Object.assign(dom.style, value);
    } else if (isPlainAttr(key, value)) {
        dom.setAttribute(key, value);
    }
};

//连接子根的child,以及child的sibling，以及确定新增还是删除...
function reconcileChildren(wipFiber, elements) {
    let index = 0;
    let prevSibling = null;

    while (index < elements.length) {
        const element = elements[index];
        let newFiber = {
            type: element.type,
            props: element.props,
            dom: null,
            return: wipFiber, //核心
            effectTag: "PLACEMENT" //新增元素
        };

        if (index === 0) {
            wipFiber.child = newFiber;
        } else if (element) {
            prevSibling.sibling = newFiber;
        }

        prevSibling = newFiber;
        index++;
    }
}

//fiber链表生成完毕，一次性渲染
function commitRoot() {
    //根节点的child
    commitWork(wipRoot.child);
    wipRoot = null;
}

//通过递归，渲染子节点、兄弟节点
function commitWork(fiber) {
    if (!fiber) {
        return;
    }

    let domParentFiber = fiber.return;

    while (!domParentFiber.dom) {
        domParentFiber = domParentFiber.return;
    }

    const domParent = domParentFiber.dom;

    if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
        domParent.appendChild(fiber.dom);
    }

    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

//初始化节点
function render(element, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [element]
        }
    };
    nextFiberReconcileWork = wipRoot;
    requestIdleCallback(workLoop);
}

export {createElement, render}
