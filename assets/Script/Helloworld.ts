const {ccclass, property} = cc._decorator;

import * as test from './tests/Test_import'
import * as DEBUG from '@Debuger/UITool'

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    start () {
        // init logic
        this.label.string = this.text;
        test.test_import();
        test.test_msgpack();


        // DEBUG.showDBAnimations('dragonbones/eff', false);
        // DEBUG.showImg('hello/HelloWorld');
    }

}
