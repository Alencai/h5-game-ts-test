import TestParent from "tests/Test_Class_Parent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TestChild extends TestParent {
    @property({override: true})
    number = 2;

    start() {
        super.start();
        cc.log('child start', this.number);
    }
}

interface IEventListener {
    onEvent(): void;
}

abstract class Person{
    constructor(name: string) {}
}

class Girl extends Person{

}


class Point {

}

// 把类当做接口使用
interface Point3d extends Point {
    z: number;
}

// 泛型
function identity<T>(arg: T): T {
    return arg;
}
class Card<T>{
    run(speed: T) {}
}








