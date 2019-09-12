const {ccclass, property} = cc._decorator;

import * as test from './tests/Test_import'

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
        // encode from JS Object to MessagePack (Buffer)
        // var buffer = encode.encodeAny({"foo": "bar"});
        // // decode from MessagePack (Buffer) to JS Object
        // var data = msgpack.decode(buffer); // => {"foo": "bar"}
    }

}
