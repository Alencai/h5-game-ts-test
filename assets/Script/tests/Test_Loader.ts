
// 目前的此类手动资源加载还有一些限制，对用户影响比较大的是：
// 1. 原生平台远程加载不支持图片文件以外类型的资源
// 2. 这种加载方式只支持图片、声音、文本等原生资源类型，不支持 SpriteFrame、SpriteAtlas、Tilemap 等资源的直接加载和解析（需要后续版本中的 AssetBundle 支持）
// 3. Web 端的}远程加载受到浏览器的 CORS 跨域策略限制，如果对方服务器禁止跨域访问，那么会加载失败，而且由于 WebGL 安全策略的限制，即便对方服务器允许 http 请求成功之后也无法渲染    

function test_load() {

    cc.loader.load(
        [ "", "", ],
        (completedCount: number, totalCount: number, item: any):void => { },
        (error: Error, results: any[]):void => { },
    );
    
    // 远程 url 带图片后缀名
    var remoteUrl = "http://unknown.org/someres.png";
    cc.loader.load(remoteUrl, function (err, texture) {
        // Use texture to create sprite frame
    });

    // 远程 url 不带图片后缀名，此时必须指定远程图片文件的类型
    remoteUrl = "http://unknown.org/emoji?id=124982374";
    cc.loader.load({url: remoteUrl, type: 'png'}, function () {
        // Use texture to create sprite frame
    });

    // 用绝对路径加载设备存储内的资源，比如相册
    var absolutePath = "/dara/data/some/path/to/image.png"
    cc.loader.load(absolutePath, function () {
        // Use texture to create sprite frame
    });

    // 动态创建 TiledMap
    cc.loader.loadRes(
        "terr/terr_1/amap_1_1",
        cc.TiledMapAsset,
        (error: Error, resource: any) => {
            let node = new cc.Node();
            let map = node.addComponent(cc.TiledMap);
            map.tmxAsset = resource;
            node.scale = 0.2;
            node.parent = this.node;
            let shade = map.getLayer('shade');
            if (shade) {
                shade.node.active = false;
            }
        },
    );
}

function test_loadRes() {

    cc.loader.loadRes(
        "", cc.Asset,
        (completedCount: number, totalCount: number, item: any):void => { },
        (error: Error, resource: any):void => { },
    );

    cc.loader.loadResArray(
        ["", ""],
        (completedCount: number, totalCount: number, item: any):void =>  { },
        (error: Error, resource: any[]):void => { },
    );

    // 加载 test assets 目录下所有资源
    cc.loader.loadResDir("test assets", function (err, assets) { });

    // 加载 test assets 目录下所有 SpriteFrame，并且获取它们的路径
    cc.loader.loadResDir("test assets", cc.SpriteFrame, function (err, assets, urls) { });

    cc.loader.addDownloadHandlers([])

    // .pist 图集资源
    cc.loader.loadRes("plist/effect_rule", cc.SpriteAtlas, function (err: Error, atlas: cc.SpriteAtlas) {
        cc.log(atlas.getSpriteFrames());
        // sprite.spriteFrame = atlas.getSpriteFrame('effect_rule_0001');
    });
}




