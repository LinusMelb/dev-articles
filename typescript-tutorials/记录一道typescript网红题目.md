
### ð¥ é¢ç®è¦æ±
> åé¢å°å: https://github.com/LeetCode-OpenSource/hire/blob/master/typescript_zh.md

è¦æ±æä¸ä¸ª `type Connect = (module: EffectModule) => any` å° `any` æ¿æ¢æé¢ç®çè§£ç­ï¼è®©ç¼è¯è½å¤é¡ºå©éè¿

```typescript
interface Action<T> {
  payload?: T;
  type: string;
}

class EffectModule {
  count = 1;
  message = 'hello!';

  delay(input: Promise<number>) {
    return input.then(i => ({
      payload: `hello ${i}!`,
      type: 'delay',
    }));
  }

  setMessage(action: Action<Date>) {
    return {
      payload: action.payload!.getMilliseconds(),
      type: 'set-message',
    };
  }
}

// ä¿®æ¹è¿éçanyä½¿å¾è½å¤ç¼è¯éè¿
type Connect = (module: EffectModule) => any;

const connect: Connect = m => ({
  delay: (input: number) => ({
    type: 'delay',
    payload: `hello 2`,
  }),
  setMessage: (input: Date) => ({
    type: 'set-message',
    payload: input.getMilliseconds(),
  }),
});
type Connected = {
  delay(input: number): Action<string>;
  setMessage(action: Date): Action<number>;
};

export const connected: Connected = connect(new EffectModule());
```

### ð¥ æä¸ªäººçè§£æ³
```typescript
type FuncReturnTypes<T> = ReturnType<T[keyof T]>;
type UnAction<T> = T extends Action<infer P> ? P : T;
type UnPromise<T> = T extends Promise<infer P> ? P : T;
type UnActionAndUnPromise<T> = UnAction<UnPromise<T>>;
type UnActionAndUnPromiseFunc<T, U> = T extends (
  args: infer P,
) => FuncReturnTypes<U>
  ? UnActionAndUnPromise<P>
  : T;

type FuncName<T> = {
  [P in keyof T]: T[P] extends Function ? P : never;
}[keyof T];

type MapReturnType<T> = T extends infer P
  ? P extends number
    ? string
    : number
  : never;

type ReturnType<T> = T extends (...args: any[]) => infer P ? P : never;

type Connect = (module: EffectModule) => {
  [T in FuncName<EffectModule>]: (
    args: UnActionAndUnPromiseFunc<EffectModule[T], EffectModule>,
  ) => Action<
    MapReturnType<UnActionAndUnPromiseFunc<EffectModule[T], EffectModule>>
  >;
};
```

### ð¥ ç½ä¸æ´å¥½çè§£æ³
https://cloud.tencent.com/developer/article/1662344

```typescript
type FunctionKeys<T> = { [k in keyof T]: T[k] extends Function ? k : never }[keyof T]
type functionKeys = Pick<EffectModule, FunctionKeys<EffectModule>>

type UnPromisify<T> = T extends Promise<infer U> ? U : T
type UnAction<T> = T extends Action<infer U> ? U : T

type MapTypeToUnPromisifyAndUnAction<T extends any[]> = {
  [k in keyof T]: UnAction<UnPromisify<T[k]>>
}

type Connect = (module: EffectModule) => ({
  [functionKey in keyof functionKeys]: (input: MapTypeToUnPromisifyAndUnAction<
    Parameters<functionKeys[functionKey]>
    >[number]) => UnPromisify<ReturnType<functionKeys[functionKey]>>
})
```
