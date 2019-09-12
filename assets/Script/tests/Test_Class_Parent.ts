const {ccclass, property} = cc._decorator;

@ccclass
export default class TestParent extends cc.Component {
    @property
    number = 1;

    start() {
        cc.log('parent start', this.number);
    }
}
