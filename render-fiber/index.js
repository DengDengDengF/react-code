//创建虚拟dom元素
import {createElement, render} from './ldf';

const data = {
    item1: 'find',
    item2: 'job'
};

//创建可以传递参数的虚拟dom
const jsx = createElement("ul", {
    className: "list"
}, createElement("li", {
    className: "item",
    style: {
        background: 'blue',
        color: 'pink'
    },
    onClick: () => alert(2)
}, "aa"), createElement("li", {
    className: "item"
}, data.item1, createElement("i", null, "xxx")), createElement("li", {
    className: "item"
}, data.item2));
// console.log(jsx)

//把jsx挂载到根节点

render(jsx, document.getElementById("root"));
