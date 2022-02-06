# 一篇文章让你搞懂js里的Reflect和Reflect metadata

引言
-

Javascript 里经常看到 Reflect 的使用,但一直搞不明白他和 Object 的区别, 加上在工作中也没有经常用到, 一直处于懵懵懂懂的状态。所以下定决心, 用这篇文章彻彻底底把它搞明白

本文主要涵盖以下4个板块:

- Reflect
  - 什么是 Reflect APIs(Reflect与Object的区别)
  - 简单的例子: Object vs Reflect
  - Reflect简单总结
- Reflect Metadata(npm package)
  - 出现背景
  - 如何安装
  - Reflect Metadata 的用法
- 结语
- 参考文献

Reflect
-

### 什么是 Reflect APIs
> Reflect是一个内建的对象，用来提供方法去拦截JavaScript的操作。Reflect的所有属性和方法都是静态的。

这个解释是相当抽象的, 用人话来讲就是: **Reflect提供了一系列静态方法来对JS对象进行操作**

在ES6之前, Javascript一直没有统一的namespace来管理对其他object的操作 比如我们可能使用`Object.keys(car)`获取`car`这个对象的所有属性 
但我们会用`property in car`这种形式判断某个属性是否存在于`car`. 相信你能看得出来, 这导致了代码上的割裂, 我们为什么不能有一个新的一系列APIs, 支持所有这些对于对象的操作呢？所以这个时候 Javascript推出了`Reflect`, 你可以用`Reflect.has(car, property)`去判断某个属性存在于`car` 同时可以用 `Reflect.ownKeys(car)`去获取`car`的所有属性. 并且所有都是通过调用Reflect里的静态function, 是不是方便和统一很多呢?

以下是Reflect下面的13个static functions以及其对应的JS其他方式的实现:
- Reflect.apply(target, thisArgument, argumentsList)
  + 类似于`Function.prototype.apply()`
- Reflect.construct(target, argumentsList[, newTarget])
  + 类似于`new target(...argumentsList)`
- Reflect.defineProperty(target, propertyKey, attributes)
  + 类似于`Object.defineProperty()`
- Reflect.deleteProperty(target, propertyKey)
  + 类似于`delete target[propertyKey]`
- Reflect.get(target, propertyKey[, receiver])
  + 类似于`target[propertyKey]`
- Reflect.getOwnPropertyDescriptor(target, propertyKey)
  + 类似于`Object.getOwnPropertyDescriptor()`
- Reflect.getPrototypeOf(target)
  + 类似于`Object.getPrototypeOf()`
- Reflect.has(target, propertyKey)
  + 类似于`property in target`
- Reflect.isExtensible(target)
  + 类似于`Object.isExtensible(target)`
- Reflect.ownKeys(target)
  + 类似于`Object.keys(target)`
- Reflect.preventExtensions(target)
  + 类似于`Object.preventExtensions(target)`
- Reflect.set(target, propertyKey, value[, receiver])
  + 类似于`target[property] = value`
- Reflect.setPrototypeOf(target, prototype)
  + 类似于`Object.setPrototypeOf(target, prototype)`

通过上面的function, 你可以发现, `Reflect`里面的所有function在目前JS都能找到对应的实现(`Object`, `Function`)，而现在你不需要去记忆那些复杂的语法，全部都可以用Reflect搞定。JS官方也建议developer能够转而开始使用Reflect 未来关于对象操作的新特性都会添加到Reflect而不是Object。但是为了backwards-compatibility, Object里面已经存在的function也不会被移除

延伸阅读: [Comparing Reflect and Object methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/Comparing_Reflect_and_Object_methods)

### 简单的例子: Object vs Reflect
如果去给car对象定义一个新的property, 在Object里面我们需要用到`try...catch`去捕捉错误
而`Reflect.defineProperty()`则会直接`return true or false`代表成功与否

```ts
// Object实现
try {
  Object.defineProperty(car, name, desc);
  // property defined successfully
} catch (e) {
  // possible failure (and might accidentally catch the wrong exception)
}

// Reflect实现
if (Reflect.defineProperty(car, name, desc)) {
  // success
} else {
  // failure
}
```

### Reflect简单总结
Reflect提供了一系列的静态方法(static functions)来操作其他Javascript对象, 其优势在于:
1. 函数化所有对象操作
1. 更丰富的返回值
1. 更统一的命名
1. 对于`function apply`更可靠的的支持 - `Reflect.apply(f, obj, args)`
    + ```ts
      const car = () => {}
      car.apply = (v) => {console.log('car.apply() runs with', v)}
      
      car.apply(void 0, [1]); // car本身的apply()会覆盖Function.prototype.apply
      Reflect.apply(car.apply, car, [1]) // Reflect则可以避免这个问题
      ```
1. 更好的控制this-binding 
    + `Reflect.set()`
    + `Reflect.get()`
1. 与`Proxy`里的操作一一对应

延伸阅读: 
- [Harmony-reflect](https://github.com/tvcutsem/harmony-reflect/wiki)
- [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy)


Reflect Metadata
- 
Reflect metadata 主要用于**在代码声明时添加/读取某个对象的元数据(metadata)**

### 出现背景
> Reflect Metadata 是一个广泛使用的第三方npm package，同时该 package 的作者Ron Buckton也是Typescript的核心开发者(core contributor) 他于 2015 年提交了将 metadata 纳入 Typescript 官方的提案(ES7)，但目前为止他手上还有太多其他工作没有完成, 所以并没有提上议程。感兴趣的朋友可以去以下链接查看具体信息:

- Metadata Proposal - ECMAScript: <https://rbuckton.github.io/reflect-metadata/>
- Ron Buckton在 github 的回应: <https://github.com/rbuckton/reflect-metadata/issues/9>

### 如何安装
在 TypeScript 使用, 你只需要：

- `npm i reflect-metadata --save`
- 在  `tsconfig.json`  里配置  `emitDecoratorMetadata`  选项
- 在使用的文件引入`import 'reflect-metadata'` 或者在`index.d.ts`全局引入

### Reflect Metadata 的用法
Reflect Metadata 的 API 可以用作给Object及其属性添加元数据: 

```ts
const car = {
  brand: 'BMW',
  model: 'X6 2012',
  price: 99999,
  getMaxSpeed() {
    console.log(`Max speed is 200km/h`);
  }
}

// 添加一个叫`desc`的元数据到car这个对象
Reflect.defineMetadata('desc', 'This is a good car', car);
// 添加一个叫`desc`的元数据到car的price上(这里的price可以是其他值或car不存在的属性)
Reflect.defineMetadata('desc', 'This is so cheap', car, 'price');
// 添加一个叫`desc`的元数据到car的model上(这里的model可以是其他值或car不存在的属性)
Reflect.defineMetadata('note', 'This model is too old', car, 'model');

// 检查metadata是否存在
console.log(Reflect.hasMetadata('desc', car)); // 输出: true
console.log(Reflect.hasMetadata('desc', car, 'price')); // 输出: true
console.log(Reflect.hasMetadata('note', car, 'model')); // 输出: true
console.log(Reflect.hasMetadata('desc', car, 'brand')); // 输出: false

// 获取元数据
console.log(Reflect.getMetadata('desc', car)); // 输出: 'This is a good car'
console.log(Reflect.getMetadata('desc', car, 'price')); // 输出: 'This is so cheap'
console.log(Reflect.getMetadata('note', car, 'model')); // 输出: 'This model is too old'
console.log(Reflect.getMetadata('desc', car, 'brand')); // 输出: undefined

// 获取对象上所有元数据的keys
console.log(Reflect.getMetadataKeys(car)) // 输出: ['desc']
console.log(Reflect.getMetadataKeys(car, 'price')) // 输出: ['desc']
console.log(Reflect.getMetadataKeys(car, 'model')) // 输出: ['note']
console.log(Reflect.getMetadataKeys(car, 'brand')) // 输出: []
```

也可以用做装饰器(decorator), 作用于类(class)或者类的属性。
我们这里写一个可以在不用new instance的情况下, 计数Class有多少methods和properties的装饰器: 
```ts

// 把metadata都定义到这个全局变量
const globalMeta = Object.create(null);

const propertyCollector = (target: Object,
  propertyKey: string | symbol, descriptor?: any) => {
    // 把property的名字都放进一个叫properties的array
    const properties = Reflect.getMetadata('properties', globalMeta);
    if (properties) {
      Reflect.defineMetadata('properties', [...properties, propertyKey], globalMeta);
    } else {
      Reflect.defineMetadata('properties', [propertyKey], globalMeta);
    }
}

const methodCollector = (target: Object,
  propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    // 把methods的名字都放进一个叫methods的array
    const methodss = Reflect.getMetadata('methods', globalMeta);
    if (methodss) {
      Reflect.defineMetadata('methods', [...methodss, propertyKey], globalMeta);
    } else {
      Reflect.defineMetadata('methods', [propertyKey], globalMeta);
    }
}

const classCollector = (constructor: Function) => {
  // 把class的名字存到globalMeta的className
  Reflect.defineMetadata('className', constructor.name, globalMeta);
}

@classCollector
class Car {
  @propertyCollector
  private speed = 0;
  @propertyCollector
  private brand = 'BMW';
  @propertyCollector
  private model = 'X6 2012';
  @methodCollector
  run() {
    this.speed = 100;
    console.log(`The car is running at 100km/h`)
  }
  @methodCollector
  stop() {
    this.speed = 0;
    console.log(`The car stopped`)
  }
}

const className = Reflect.getMetadata('className', globalMeta);
const properties = Reflect.getMetadata('properties', globalMeta);
const methods = Reflect.getMetadata('methods', globalMeta);

console.log(
`Class [${className}] has ${properties.length} properties: ${properties.join(', ')}\t
Class [${className}] has ${methods.length} methods: ${methods.join(', ')}`,
);

// 输出
// Class [Car] has 3 properties: speed, brand, model
// Class [Car] has 2 methods: run, stop
```

结语
-
希望通过这篇文章, 你能对Reflect有一个新的理解, 未来也将会写当`Reflect`与`Proxy`联动在一起的美妙用法(开启JS里meta programming的新篇章)

参考文献
-
1. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect
1. https://blog.greenroots.info/javascript-why-reflect-apis
1. https://medium.com/jspoint/introduction-to-reflect-metadata-package-and-its-ecmascript-proposal-8798405d7d88
