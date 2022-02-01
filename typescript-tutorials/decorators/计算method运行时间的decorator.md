> 本文将编写一个计算同步和异步method执行时间的方法装饰器


### 🥑 在typescript下启用装饰器

如果要在typescript下使用decorator, 首先需要在tsconfig.json 添加如下options:

```json
"compilerOptions": {
    "emitDecoratorMetadata": true, // optional, 使Reflect类可以添加或读取metadata
    "experimentalDecorators": true, // required
}
```

### 🥑 方法装饰器(Method decorator)的参数定义
方法装饰器在执行时会获得三个参数：target, propertyKey和descriptor

1. target: 当前对象的原型，假设 TestClass 是对象，那么 target 就是 TestClass.prototype
2. propertyKey: 方法的名称
3. descriptor: 方法的属性描述符，即 Object.getOwnPropertyDescriptor(TestClass.prototype, propertyKey)

```typescript
// typescript定义
type MethodDecorator = <T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void
```

### 🥑 编写一个计算执行时间的装饰器 - 同步方法(sync method)
首先我们先定义用于计算同步method的装饰器

```typescript
export const logExecutionTimeSync = () => {
  return function (
    target : Object,
    propertyKey : string | symbol,
    propertyDescriptor : PropertyDescriptor,
  ) {
    const originalFunc = propertyDescriptor.value;

    // 修改原有function的定义
    propertyDescriptor.value = function (...args : any[]) {
      const startTime = new Date().getTime();
      const results = originalFunc.apply(this, args);
      const endTime = new Date().getTime();
      console.log(
        `*** ${propertyKey} took ${
          endTime - startTime
        } msec to run ***`,
      );
      return results;
    };
    return propertyDescriptor;
  };
};
```

接着定义一个测试用的method, 可以直接引入decorator使用
```typescript
class TestClass {
  // 没有参数时 可以省略括号
  @logExecutionTimeSync
  function testFunctionSync() {
      console.log('logExecutionTimeSync() runs immediately');
  }
}
```

输出结果
```bash
logExecutionTimeSync() runs immediately
*** logExecutionTimeSync took 0 msec to run ***
```

### 🥑 编写一个计算执行时间的装饰器 - 异步方法(async method)

对于异步的method, 只需要在执行原有function时使用await即可

```typescript
export const logExecutionTimeAsync = () => {
  return function (
    target : Object,
    propertyKey : string | symbol,
    propertyDescriptor : PropertyDescriptor,
  ) {
    const originalFunc = propertyDescriptor.value;

    // 修改原有function的定义
    propertyDescriptor.value = async function (...args : any[]) {
      const startTime = new Date().getTime();
      const results = await originalFunc.apply(this, args);
      const endTime = new Date().getTime();
      console.log(
        `*** ${propertyKey} took ${
          endTime - startTime
        } msec to run ***`,
      );
      return results;
    };
    return propertyDescriptor;
  };
};
```

接着定义一个测试的异步method, 可以直接引入decorator使用

```typescript
class TestClass {
  @logExecutionTimeAsync()
  async function testFunctionAsync() {
      // 定义一个timeout方法 可以让程序等待一段时间后继续执行
      const timeout = new Promise((resolve) => setTimeout(resolve, ms));
      await timeout(2000);
      console.log('testFunction() runs after 2s');
  }
}
```

输出结果
```bash
testFunctionAsync() runs after 2s
*** testFunctionAsync took 2003 msec to run ***
```

### 🥑 方法装饰器接收参数

我们之前定义的装饰器也可以接受参数, 不过参数是静态的 将会在编译时就传入装饰器

```typescript
// 参数是静态的 将会在编译时就传入装饰器
@logExecutionTimeAsync('param1', 'param2')

const logExecutionTimeAsync = (param1, param2) => {
}
```
