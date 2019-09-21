const {ccclass, property} = cc._decorator;

import * as test from './tests/Test_import'
import * as UITool from '@Debuger/UITool'
import * as ImgTool from '@Debuger/ImgTool'
import * as EffTool from '@Debuger/EffTool'

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


        // UITool.showDBAnimations('dragonbones/eff', false);
        // UITool.showImg('hello/HelloWorld');
        EffTool.playFrameEff("plist/effect_rule", (node:cc.Node)=>node.destroy()).parent = this.node;
    }

}
