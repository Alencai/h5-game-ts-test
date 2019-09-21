
function _playSpriteFrameEff(sprite: cc.Sprite, atlas: cc.SpriteAtlas, endFunc: Function) {
    if (atlas && cc.isValid(sprite)) {
        let frames = atlas.getSpriteFrames();
        let idx = 0;
        let showFrame = (dt:number) => {
            sprite.spriteFrame = frames[idx++];
            if (idx >= frames.length) {
                if (endFunc) {
                    sprite.unschedule(showFrame);
                    endFunc(sprite.node);
                }
                idx = 0;
            }
        }
        sprite.schedule(showFrame, 1.0 / 60);
    }
}


//----------------------------------------------------------------------------


/** 播放序列帧动画
 *  @param plist    传入.plist文件地址
 *  @param endFunc  播放结束之后的回调
 *  ```js
 *      EffTool.playFrameEff("plist/effect_rule", (node:cc.Node)=>node.destroy()).parent = this.node;
 *  ```
 */
export function playFrameEff(plist: string, endFunc: Function = null): cc.Node {
    let node = new cc.Node();
    let sprite = node.addComponent(cc.Sprite);
    cc.loader.loadRes(plist, cc.SpriteAtlas, (eff, atlas) => {
        if (eff) { endFunc && cc.isValid(sprite) && endFunc(sprite.node); return; }
        _playSpriteFrameEff(sprite, atlas, endFunc)
    });
    return node;
}



