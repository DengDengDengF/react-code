import {createElement, render, Component} from "./ldf";

//这是个函数组件，返回jsx的子组件
function Item(props) {
    return createElement("li", {
        className: "item",
        style: props.style,
        onClick: props.onClick
    }, props.children);
}

//继承自Component的父组件
class List extends Component {
    constructor(props) {
        super();//继承Component的所有方法,state、props、setState、生命周期等方法·
        this.state = {//初始化state
            list: [{
                text: 'aaa',
                color: 'blue'
            }, {
                text: 'bbb',
                color: 'orange'
            }, {
                text: 'ccc',
                color: 'red'
            }],
            textColor: props.textColor//利用传递的props
        };
    }

    render() {//返回jsx
        return createElement("ul", {
            className: "list"
        }, this.state.list.map((item, index) => {
            return createElement(Item, {
                style: {
                    background: item.color,
                    color: this.state.textColor
                },
                onClick: () => alert(item.text)
            }, item.text);
        }));
    }

}
// console.log(typeof List==='function' ) //true
render(createElement(List, {
    textColor: 'pink'
}), document.getElementById('root'));
