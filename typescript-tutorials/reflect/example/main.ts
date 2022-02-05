import moment from "moment-timezone";

// Reflect
const duck = {
  name: 'Maurice',
  color: 'white',
  greeting: function() {
    console.log(`Quaaaack! My name is ${this.name}`);
  }
}

// 
Reflect.set(duck, 'run', function(speed: number) {console.log(`I can run very fast at speed ${speed}!`)});
Reflect.set(duck, 'age', 10);

console.log(Reflect.has(duck, 'color'));
console.log(Reflect.has(duck, 'haircut'));
console.log(Reflect.get(duck, 'age'));
Reflect.apply(Reflect.get(duck, 'run'), duck, [100]);

console.log((duck as any).run(1000))

// @Reflect.metadata('key', 'value')
// class Duck {

// }

const onChange = (object: any) => {
  const handler = {
    get(target: any, property: string, receiver: any): any {
      try {
        console.log('we are getting', property);
        return new Proxy(target[property], handler);
      } catch (err) {
        return Reflect.get(target, property, receiver);
      }
    },
    defineProperty(target: any, property: string, descriptor: any) {
      console.log('we are updating', property);
      return Reflect.defineProperty(target, property, descriptor);
    },
    deleteProperty(target: any, property: string) {
      console.log('we are deleting', property);
      return Reflect.deleteProperty(target, property);
    }
  };
  return new Proxy(object, handler);
};

const car = {
  name: 'Toyota',
  speed: 10
}
const monitoredCar = onChange(car);

monitoredCar.name;
monitoredCar.speed = 100;
monitoredCar.speedX = 1000;
delete monitoredCar.speed;
console.log(monitoredCar.speedX);

const versionSuffix = moment().tz('Australia/Brisbane').format('YYYYMMDDHHmm');
console.log(versionSuffix);