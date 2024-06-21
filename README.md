### 1.fiber

```js
reconcile:vdom转fiber，从上到下，从左到右,把父子关系、兄弟关系给串起来。利用fiber链表、requestIdleCallback做空闲调度

commit:fiber转换完毕，一次性渲染，从上到下，从左到右去渲染
```

<img src="https://s2.loli.net/2024/06/20/1B8cr5Z2nbQXeoE.png" alt="image.png" style="zoom:50%;" />

### 2.vdom

```js
虚拟dom的渲染过程用了深度优先算法，从上到下，从左到右
parent.appendChild(child)//返回child节点引用
```

### 3.jsx

```js
creatElemnt方法用深度优先递归，添加自定义props和children,转虚拟dom
有了虚拟dom,根vdom渲染一样了
```

### 4.component

```js
函数组件返回jsx,jsx底层调用createElement,
    
类组件继承封装好的Component，可以继承state、props、setState、生命周期等
类组件的render函数返回jsx，甚至可以嵌套函数组件，底层调用cretateElement

createElement函数实现逻辑同上，返回{type,props,children},调用的时候用了深度优先递归算法

render函数也是个深度优先算法，要校验虚拟dom类型是文本、dom、function,以及在父dom中添加子。
如果是function就是组件类型，然后区分函数组件、类组件。通过原型链可以判断类组件，因为类组件继承了我封装的Component.

```

