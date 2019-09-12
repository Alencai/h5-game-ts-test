

import {import_log, import_get} from './Test_export_js'
import import1 from './Test_export_js'
import * as import2 from './Test_export_js'


export function test_import():void {
    import_log();         // 选取需要使用的模块
    cc.log(import1);      // 直接引用默认模块 
    import2.import_log(); // 将所有模块放到import3下面
}

export function test_msgpack(): void {
    var buffer = msgpack.encode({"foo": "bar"});
    var data = msgpack.decode(buffer);
    cc.log(msgpack, new msgpack.Encoder, new msgpack.Decoder);
    cc.log(buffer, data);
}

export default "hello world";
