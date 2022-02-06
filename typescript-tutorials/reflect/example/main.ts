import 'reflect-metadata'

// Reflect
const duck = {
  name: "Maurice",
  color: "white",
  greeting: function () {
    console.log(`Quaaaack! My name is ${this.name}`);
  },
};

//
Reflect.set(duck, "run", function (speed: number) {
  console.log(`I can run very fast at speed ${speed}!`);
});
Reflect.set(duck, "age", 10);

console.log(Reflect.has(duck, "color"));
console.log(Reflect.has(duck, "haircut"));
console.log(Reflect.get(duck, "age"));
Reflect.apply(Reflect.get(duck, "run"), duck, [100]);

console.log((duck as any).run(1000));

console.log(Reflect.has(Reflect, 'has'));

const onChange = (object: any) => {
  const handler = {
    get(target: any, property: string, receiver: any): any {
      try {
        console.log("we are getting", property);
        return new Proxy(target[property], handler);
      } catch (err) {
        return Reflect.get(target, property, receiver);
      }
    },
    defineProperty(target: any, property: string, descriptor: any) {
      console.log("we are updating", property);
      return Reflect.defineProperty(target, property, descriptor);
    },
    deleteProperty(target: any, property: string) {
      console.log("we are deleting", property);
      return Reflect.deleteProperty(target, property);
    },
  };
  return new Proxy(object, handler);
};

const car2 = {
  name: "Toyota",
  speed: 10,
};
const monitoredCar = onChange(car2);

monitoredCar.speed = 100;
monitoredCar.speedX = 1000;
delete monitoredCar.speed;
console.log(monitoredCar.speedX);

const car = {
  brand: 'BMW',
  model: 'X6 2012',
  price: 99999,
  getMaxSpeed() {
    console.log(`Max speed is 200km/h`);
  }
}

// 添加元数据到car这个对象
Reflect.defineMetadata('desc', 'This is a good car', car);
// 添加元数据到car的price属性
Reflect.defineMetadata('desc', 'This is so cheap', car, 'price2');
// 添加元数据到car的model属性
Reflect.defineMetadata('note', 'This model is too old', car, 'model');


// 检查metadata是否存在
console.log(Reflect.hasMetadata('desc', car)); // 输出: 'This is a good car'
console.log(Reflect.hasMetadata('desc', car, 'price')); // 输出: 'This is so cheap'
console.log(Reflect.hasMetadata('note', car, 'model')); // 输出: 'This model is too old'
console.log(Reflect.hasMetadata('desc', car, 'brand')); // 输出: undefined

// 获取元数据
console.log(Reflect.getMetadata('desc', car)); // 输出: 'This is a good car'
console.log(Reflect.getMetadata('desc', car, 'price')); // 输出: 'This is so cheap'
console.log(Reflect.getMetadata('note', car, 'model')); // 输出: 'This model is too old'
console.log(Reflect.getMetadata('desc', car, 'brand')); // 输出: undefined

// 获取对象上所有元数据keys
console.log(Reflect.getMetadataKeys(car)) // 输出: ['desc']
console.log(Reflect.getMetadataKeys(car, 'price')) // 输出: ['desc']
console.log(Reflect.getMetadataKeys(car, 'model')) // 输出: ['note']
console.log(Reflect.getMetadataKeys(car, 'brand')) // 输出: []

// 我们写一个可以获取Class有多少function和property的装饰器
const globalMeta = Object.create(null);

const propertyCollector = (target: Object,
  propertyKey: string | symbol, descriptor?: any) => {
    const perperties = Reflect.getMetadata('properties', globalMeta);
    if (perperties) {
      Reflect.defineMetadata('properties', [...perperties, propertyKey], globalMeta);
    } else {
      Reflect.defineMetadata('properties', [propertyKey], globalMeta);
    }
}

const methodCollector = (target: Object,
  propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const methodss = Reflect.getMetadata('methods', globalMeta);
    if (methodss) {
      Reflect.defineMetadata('methods', [...methodss, propertyKey], globalMeta);
    } else {
      Reflect.defineMetadata('methods', [propertyKey], globalMeta);
    }
}

const classCollector = (constructor: Function) => {
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
