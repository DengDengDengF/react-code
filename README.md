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

