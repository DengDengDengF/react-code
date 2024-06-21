import {createElement, render} from "./index";

const data = {
    item1: 'bbb',
    item2: 'ddd'
};
//用createElement可以添加自定义属性,转虚拟dom 深度优先递归
const jsx = createElement("ul", {
    className: "list"
}, createElement("li", {
    className: "item",
    style: {
        background: 'blue',
        color: 'pink'
    },
    onClick: () => alert(2)
}, "aaa"), createElement("li", {
    className: "item"
}, data.item1, createElement("i", null, "aaa")), createElement("li", {
    className: "item"
}, data.item2));


render(jsx, document.getElementById('root'));
