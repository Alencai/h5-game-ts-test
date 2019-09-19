

function updateNodeSize(node, defaultSize) {
    if (defaultSize > 0 && node.height > 0 && node.width > 0){
        if (node.height > node.width) {
            node.width = node.width * defaultSize / node.height;
            node.height = defaultSize;
        }
        else {
            node.height = node.height * defaultSize / node.width;
            node.width = defaultSize;
        }
        //node.setScale(width / node.width);
    }
}

// 更新网络图片
export function setWebImage(node, url, defaultSize = 0, callback = null) {
    if (!cc.isValid(node)) {
        return;
    }
    var sprite = node.getComponent(cc.Sprite);
    if (sprite == null) {
        sprite = node.addComponent(cc.Sprite);
    }
    cc.loader.load({url:url, type:'png'}, function (err, tex) {
        if(err || !tex) {
            callback && callback(1, node, 'error: ' + JSON.stringify(err));
            return;
		}
		if (cc.isValid(sprite)) {
            sprite.spriteFrame = new cc.SpriteFrame(tex);
            updateNodeSize(node, defaultSize);
            callback && callback(0, node, 'success');
            return;
		}
        callback && callback(2, node, 'error: sprite is invalid');
    });
};

// 更新项目图片 (resource目录下的路径，不包含resource)
export function setResImage(node, url, defaultSize = 0, callback = null) {
    if (!cc.isValid(node)) {
        return;
    }
    var sprite = node.getComponent(cc.Sprite);
    if (sprite == null) {
        sprite = node.addComponent(cc.Sprite);
    }
    cc.loader.loadRes(url, cc.SpriteFrame, function(err, ret) {
        if(err || !ret) {
            callback && callback(1, node, 'error: ' + JSON.stringify(err));
            return;
		}
		if (cc.isValid(sprite)) {
            sprite.spriteFrame = ret;
            updateNodeSize(node, defaultSize);
            callback && callback(0, node, 'success');
            return;
        }
        callback && callback(2, node, 'error: sprite is invalid');
    });
}

// 更新图片，不读取缓存（微信同一个用户更换头像后，url不同，因此不需调用这个方法）
export function setWebImageNoCache(node, url, width = 0) {
    url += (/\?/.test(url) ? '&_t=' : '?_t=') + (new Date()).valueOf();
    setWebImage(node, url, width);
};

