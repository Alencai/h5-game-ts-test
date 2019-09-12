

enum Color1 {
    Green, 
    Red
}

enum Color2 {
    Green = '#aabbcc', 
    Red = '#eeeeff', 
}


// 1. typeof类型保护，只有两种形式能被识别：
//     typeof v === "typename"
//     typeof v !== "typename"，
// "typename" 必须是 "number"， "string"， "boolean" 或 "symbol"


// 2. instanceof类型保护：
// if (padder instanceof StringPadder) {
//     // ...
// }


// 3. 类型别名
// type Name = string;
// type NameResolver = () => string;
// type NameOrResolver = Name | NameResolver;
// type Container<T> = { value: T };  // 泛型 
// type Tree<T> = { value: T; left: Tree<T>; right: Tree<T>; } // 引用自己
// type LinkedList<T> = T & { next: LinkedList<T> }; // 交叉引用
// type Easing = "ease-in" | "ease-out" | "ease-in-out"; // 字符串字面量类型




