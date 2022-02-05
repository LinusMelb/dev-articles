引言
-
在写typescript经常看到Reflect的使用 但一直搞不明白到底什么意思 加上在工作中也没有用到 所以下定决心花时间把这个彻底搞懂

本文主要涵盖2个方面
- 
+ Reflect的基本使用
+ Reflect metadata使用
  - Typescript提案背景
  - 如何配置
  - 使用方法

Reflect
- 


Reflect Metadata
- 
> Reflect Metadata 是一个广泛使用的第三方library，同时该library的作者于2015年提交了将metadata纳入Typescript官方的提案(ES7)，但目前为止官方并没有明确表示会吸纳该建议，给出的理由是decorator的其他部分还有太多工作没有完成。感兴趣的朋友可以去以下链接查看具体信息:
+ Metadata Proposal - ECMAScript: https://rbuckton.github.io/reflect-metadata/
+ Typescript开发者在github的回应: https://github.com/rbuckton/reflect-metadata/issues/9

Reflect metadata主要用来**在声明的时候添加和读取元数据**，在TypeScript使用, 你只需要：
- `npm i reflect-metadata --save`
- 在 `tsconfig.json` 里配置 `emitDecoratorMetadata` 选项
- 在使用的文件引入`import 'reflect-metadata'` 或者在`index.d.ts`全局引入

Reflect Metadata 的 API 可以用于类或者类的属性上，如：