const { ccclass, property } = cc._decorator;

import DebugUIScroll from './_UIComScroll'
import DebugUIItem from './_UICompItem'
import * as ImgTool from './_ImgTool'


const COLOR_BG = new cc.Color(230, 240, 240, 210);
const COLOR_MASK = new cc.Color(0, 0, 0, 200);
const COLOR_FONT = new cc.Color(0, 0, 0);
const COLOR_BTN = new cc.Color(175, 175, 210);
const COLOR_RED = new cc.Color(255, 0, 0, 100);
const COLOR_GREEN = new cc.Color(0, 255, 0, 100);

function fillColor(graphics: cc.Graphics, colorFill:cc.Color, colorEdge:cc.Color) {
    // 描绘边界
    if (colorEdge) {
        graphics.lineWidth = 2;
        graphics.strokeColor = colorEdge;
        graphics.stroke();
    }
    // 填充颜色
    if (colorFill) {
        graphics.fillColor = colorFill;
        graphics.fill();
    }
}

function getCanvas():cc.Canvas {
    return cc.Canvas.instance;
};

function drawCircle(node:cc.Node, radius:number, colorFill:cc.Color, colorEdge:cc.Color = null) {
    var graphics = node.addComponent(cc.Graphics);
    graphics.circle(0, 0, radius);
    fillColor(graphics, colorFill, colorEdge);
};

function drawRect(node:cc.Node, width:number, height:number, colorFill:cc.Color, colorEdge:cc.Color = null) {
    var graphics = node.addComponent(cc.Graphics);
    graphics.rect(-width / 2, -height / 2, width, height);
    fillColor(graphics, colorFill, colorEdge);
};

// 为node添加按钮事件
function addBtnEvt(evtNode:cc.Node, scale:number, extData:any = null, callback:Function = null) {
    if (evtNode && callback) {
        evtNode.off(cc.Node.EventType.TOUCH_START);
        evtNode.off(cc.Node.EventType.TOUCH_MOVE);
        evtNode.off(cc.Node.EventType.TOUCH_END);
        evtNode.off(cc.Node.EventType.TOUCH_CANCEL);
        evtNode.on(cc.Node.EventType.TOUCH_START,  () => { evtNode.scale = scale; });
        evtNode.on(cc.Node.EventType.TOUCH_MOVE,   () => { evtNode.scale = 1; });
        evtNode.on(cc.Node.EventType.TOUCH_END,    () => { evtNode.scale = 1; callback(extData); });
        evtNode.on(cc.Node.EventType.TOUCH_CANCEL, () => { evtNode.scale = 1; });
    }
};

// 为node添加移动事件
function addMoveEvt(evtNode:cc.Node, moveNode:cc.Node = null, moveEvt:Function = null, moveEndEvt:Function = null) {
    if (evtNode) {
        moveNode = moveNode || evtNode;
        evtNode.off(cc.Node.EventType.TOUCH_MOVE);
        evtNode.on(cc.Node.EventType.TOUCH_MOVE, (evt:cc.Event.EventTouch) => {
            moveNode.x += evt.getDeltaX();
            moveNode.y += evt.getDeltaY();
            moveEvt && moveEvt();
        });
        evtNode.off(cc.Node.EventType.TOUCH_END);
        evtNode.on(cc.Node.EventType.TOUCH_END, () => { moveEndEvt && moveEndEvt(); });
    }
};

function addTopTitle(title:string, node:cc.Node, parent:cc.Node, width:number, height:number, closeEvt:Function = null, moveEvt:Function = null, moveEndEvt:Function = null) {
    var nodeTop = new cc.Node();
    nodeTop.width = width;
    nodeTop.height = 30;
    nodeTop.x = 0;
    nodeTop.y = (height + nodeTop.height) / 2;
    nodeTop.parent = parent;
    drawRect(nodeTop, nodeTop.width, nodeTop.height, COLOR_BG);
    var txtTitle = newComText(16, nodeTop.width, nodeTop.height, COLOR_FONT);
    txtTitle.string = title;
    txtTitle.node.parent = nodeTop;
    addMoveEvt(nodeTop, parent, moveEvt, moveEndEvt);
    var nodeClose = new cc.Node();
    nodeClose.width = 24;
    nodeClose.height = 18;
    nodeClose.x = (width - nodeClose.width - 8) / 2;
    nodeClose.parent = nodeTop;
    drawRect(nodeClose, nodeClose.width, nodeClose.height, COLOR_BTN);
    var txtClose = newComText(16, nodeClose.width, nodeClose.height, COLOR_FONT);
    txtClose.string = 'X';
    txtClose.node.parent = nodeClose;
    addBtnEvt(nodeClose, 1.05, null, () => {
        closeEvt && closeEvt();
        cc.isValid(node) && node.destroy();
    });
};

function addBottomClose(node:cc.Node, parent:cc.Node, width:number, height:number, closeEvt:Function = null, moveEvt:Function = null, moveEndEvt:Function = null) {
    var nodeBottom = new cc.Node();
    nodeBottom.width = width;
    nodeBottom.height = 20;
    nodeBottom.x = 0;
    nodeBottom.y = -(height + nodeBottom.height) / 2;
    nodeBottom.parent = parent;
    drawRect(nodeBottom, nodeBottom.width, nodeBottom.height, COLOR_BG);
    var nodeClose = new cc.Node();
    nodeClose.width = 20;
    nodeClose.height = 14;
    nodeClose.parent = nodeBottom;
    drawRect(nodeClose, nodeClose.width, nodeClose.height, COLOR_BTN);
    var txtClose = newComText(12, nodeClose.width, nodeClose.height, COLOR_FONT);
    txtClose.string = 'X';
    txtClose.node.parent = nodeClose;
    addBtnEvt(nodeClose, 1.05, null, () => {
        closeEvt && closeEvt();
        cc.isValid(node) && node.destroy();
    });
    addMoveEvt(nodeBottom, parent, moveEvt, moveEndEvt);
};

//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------

export function newComText(fontSize:number, width:number, height:number, color:cc.Color) {
    var txtNode = new cc.Node();
    txtNode.width = 2 * width;
    txtNode.height = 2 * height;
    txtNode.color = color; 
    txtNode.scale = 0.5;
    var txtDesc = txtNode.addComponent(cc.Label);
    txtDesc.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
    txtDesc.verticalAlign = cc.Label.VerticalAlign.CENTER;
    txtDesc.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
    txtDesc.fontSize = 2 * fontSize;
    txtDesc.lignHeight = 2 * height;
    txtDesc.useSystemFont = true;
    return txtDesc;
};

export function newBgMask(isShowMask:boolean = true) {
    var canvas = getCanvas().node;
    var nodeMask = new cc.Node();
    nodeMask.parent = canvas;
    if (isShowMask) {
        nodeMask.width = canvas.width;
        nodeMask.height = canvas.height;
        drawRect(nodeMask, canvas.width, canvas.height, COLOR_MASK);
        addBtnEvt(nodeMask, 1, null, ()=>{});
    }
    return nodeMask;
};

export function newScrollView(nodeItem:cc.Node, width:number, height:number, row:number, column:number) {
    var nodeScroll = new cc.Node();
    nodeScroll.width = width;
    nodeScroll.height = height;
    var nodeMask = new cc.Node();
    nodeMask.width = width;
    nodeMask.height = height;
    nodeMask.parent = nodeScroll;
    var nodeContent = new cc.Node();
    nodeContent.anchorX = 0.5;
    nodeContent.anchorY = 1;
    nodeContent.y = height / 2;
    nodeContent.width = width;
    nodeContent.height = height;
    nodeContent.parent = nodeMask;
    var ccMask = nodeMask.addComponent(cc.Mask);
    // ccMask.type = cc.Mask.Type.RECT;
    // ccMask.inverted = false;
    var ccScroll = nodeScroll.addComponent(cc.ScrollView);
    ccScroll.horizontal = false;
    ccScroll.vertical = true;
    ccScroll.brake = 0.75;
    ccScroll.elastic = true;
    ccScroll.bounceDuration = 0.23;
    ccScroll.inertia = true;
    ccScroll.content = nodeContent;
    var comScroll = nodeScroll.addComponent(DebugUIScroll);
    comScroll.itemTemplate = nodeItem;
    comScroll.scrollRect = nodeMask;
    comScroll.scrollContent = nodeContent;
    comScroll.updateInterval = 0.1;
    comScroll.rowCount = row;
    comScroll.colCount = column;
    comScroll.itemScpaceX = 2;
    comScroll.itemScpaceY = 2;
    return comScroll;
};


// 弹出选项列表
interface BtnItemData{ title: string, callback: Function }
@ccclass class BtnItemNode extends DebugUIItem {
    _txtdesc:cc.Label
    onLoad() {
        drawRect(this.node, this.node.width, this.node.height, COLOR_BTN);
        this._txtdesc = newComText(16, this.node.width, this.node.height, COLOR_FONT);
        this._txtdesc.node.parent = this.node;
    }
    updateItem (data:BtnItemData, idx:number) {
        addBtnEvt(this.node, 1.05, data, data && data.callback);
        this._txtdesc.string = data && data.title || ('none_' + idx);
    }
}
// var list = [];
// list.push({title: 'hello 1', callback: function() {cc.log('111322');}, });
// list.push({title: 'hello 2', callback: function() {cc.log('111322');}, });
// DEBUG.newListBtn("title", list);
export function newListBtn(title:string, list:BtnItemData[], isShowMask:boolean = true, width:number = 150, height:number = 155, closeEvt:Function = null) {
    var nodeItem = new cc.Node();
    nodeItem.width = width - 10;
    nodeItem.height = 20;
    nodeItem.addComponent(BtnItemNode);
    var nodeMask = newBgMask(isShowMask);
    var scroll = newScrollView(nodeItem, width, height, Math.floor(height / (nodeItem.height + 2)) + 2, 1);
    scroll.node.parent = nodeMask;
    scroll.updateListData(list);
    drawRect(scroll.node, width, height + 6, COLOR_BG);
    addTopTitle(title, nodeMask, scroll.node, width, height + 4, closeEvt);
    // addBottomClose(nodeMask, scroll.node, width, height + 4, closeEvt);
    return scroll;
};

// 创建按钮
export function newBtn(str:string, fontSize:number, width:number, height:number, colorBg:cc.Color, colorFont:cc.Color, clickEvt:Function = null) {
    var nodeItem = new cc.Node();
    nodeItem.width = width;
    nodeItem.height = height;
    if (str) {
        var txtDesc = newComText(fontSize, width, height, colorFont);
        txtDesc.node.parent = nodeItem;
        txtDesc.string = str || '';
    }
    drawRect(nodeItem, width, height, colorBg);
    addBtnEvt(nodeItem, 1.05, nodeItem, clickEvt);
    return nodeItem;
};

// 进度条
export function newSlider(width:number, height:number, sliderEvt:Function) {
    var nodeItem = new cc.Node();
    nodeItem.width = width;
    nodeItem.height = height;
    nodeItem.on('slide', sliderEvt);
    drawRect(nodeItem, width, height, COLOR_GREEN);
    var nodeCir = new cc.Node();
    nodeCir.width = height;
    nodeCir.height = height;
    nodeCir.parent = nodeItem;
    drawCircle(nodeCir, height / 2, COLOR_BTN);
    var btnCir = nodeCir.addComponent(cc.Button);
    btnCir.interactable = true;
    btnCir.duration = 0.1;
    btnCir.zoomScale = 1.2;
    btnCir.transition = cc.Button.Transition.SCALE;
    var sliderItem = nodeItem.addComponent(cc.Slider);
    sliderItem.handle = btnCir;
    sliderItem.progress = 1;
    sliderItem.direction = cc.Slider.Direction.Horizontal;
    return nodeItem;
};


//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------

// debug弹窗
export function showMsg(str:string, width:number = 150, height:number = 70, closeEvt = null) {
    var nodeMask = newBgMask();
    var nodeItem = new cc.Node();
    nodeItem.width = width;
    nodeItem.height = height;
    nodeItem.parent = nodeMask;
    drawRect(nodeItem, width, height, COLOR_BG);
    var txtDesc = newComText(16, width, height, COLOR_FONT);
    txtDesc.node.parent = nodeItem;
    txtDesc.string = str || 'null';
    addBottomClose(nodeMask, nodeItem, width, height, closeEvt);
};


// 查看dragonbones特效，传入文件地址即可
// DEBUG.showDBAnimations('dragonbones/eff', false);
export function showDBAnimations(path: string, isMoveEffect: boolean = true, width: number = 300, height: number = 300) {
    var nodeMask = newBgMask();
    var nodeEffect = new cc.Node();
    nodeEffect.width = width;
    nodeEffect.height = height;
    nodeEffect.parent = nodeMask;
    drawRect(nodeEffect, width, height, COLOR_MASK, COLOR_BTN);
    if (isMoveEffect) { addMoveEvt(nodeEffect, nodeMask); }
    var nodeDB = new cc.Node();
    var comDB = nodeDB.addComponent(dragonBones.ArmatureDisplay);
    nodeDB.parent = nodeEffect;
    // drawRect(nodeDB, 100, 100, COLOR_RED, COLOR_GREEN);
    var txtDesc = newComText(18, width, 20, COLOR_BTN);
    txtDesc.node.y = (txtDesc.node.height - height) / 2;
    txtDesc.node.parent = nodeEffect;
    function removeMask() { cc.isValid(nodeMask) && nodeMask.destroy(); }
    cc.loader.loadRes(path + "/skeleton", dragonBones.DragonBonesAsset, (error: Error, skeleton: any) => {
        if (!error) cc.loader.loadRes(path + "/texture", dragonBones.DragonBonesAtlasAsset, (error: Error, texture: any) => {
            if (!error) showDBArmatureList(comDB, skeleton, texture, removeMask);
        });
    });
};
function playDBAnimation(data:any) {
    let comDB: dragonBones.ArmatureDisplay = data.comDB;
    if (cc.isValid(comDB)) {
        comDB.playTimes = -1;
        comDB.animationName = data.title;
        comDB.armatureName = data.armature;
        let txtDesc: cc.Label = data.txt;
        if (cc.isValid(txtDesc)) {
            var ret = comDB.armatureName + '  ' + data.title;
            var cfg = comDB.armature().animation.animations[data.title];
            if (cfg) ret += '  ' + cfg.frameCount;
            txtDesc.string = ret;
        }
    }
}
function showDBAnimationList(data:any) {
    let comDB: dragonBones.ArmatureDisplay = data.comDB;
    if (cc.isValid(comDB)) {
        var listNames = comDB.getAnimationNames(data.title);
        var listEvts = [];
        for (var idx in listNames) { listEvts.push({ title: listNames[idx], armature: data.title, callback: playDBAnimation }); }
        listEvts.length > 0 && playDBAnimation(listEvts[0]);
        var listBtn = newListBtn("动作列表", [], false);
        listBtn.node.x += 2 + listBtn.node.width / 2;
        return;
    }
}
function showDBArmatureList(comDB: dragonBones.ArmatureDisplay, skeleton: dragonBones.DragonBonesAsset, texture: dragonBones.DragonBonesAtlasAsset, removeMask:Function) {
    if (cc.isValid(comDB)) {
        comDB.dragonAsset = null;
        comDB.dragonAtlasAsset = texture;
        comDB.dragonAsset = skeleton;
        comDB.playTimes = -1;
        comDB.armatureName = "default"; // 源码中，在_buildArmature中如果name为空，会直接return导致不进一步解析
        var listNames = comDB.getArmatureNames();
        var listEvts = [];
        for (var idx in listNames) { listEvts.push({ title: listNames[idx], comDB:comDB, callback: showDBAnimationList }); }
        listEvts.length > 0 && showDBAnimationList(listEvts[0]);
        var listBtn = newListBtn("龙骨列表", [], false, 150, 155, removeMask);
        listBtn.node.x -= 2 + listBtn.node.width / 2;
        return;
    }
    removeMask();
}

// 可旋转和移动的图片
// DEBUG.showImg('hello/HelloWorld');
export function showImg(path:string, width:number = 300, height:number = 300) {
    var canvas = getCanvas().node;
    var nodeItem = new cc.Node();
    nodeItem.width = width;
    nodeItem.height = height;
    nodeItem.parent = canvas;
    drawRect(nodeItem, width, height, null, COLOR_BTN);
    var nodeImge = new cc.Node();
    nodeImge.parent = nodeItem;
    ImgTool.setResImage(nodeImge, path);
    var txtDesc = newComText(16, width, 20, COLOR_BTN);
    txtDesc.node.y = (txtDesc.node.height - height) / 2;
    txtDesc.node.parent = nodeItem;
    function moveEvt() { txtDesc.string = '(' + nodeItem.x.toFixed(1) + ', ' + nodeItem.y.toFixed(1) + ') -> ' + nodeImge.rotation.toFixed(1)};
    function touchEnd() { moveEvt(); cc.log(txtDesc.string); };
    var oriCirWidth = 30;
    var oriCirDis = height / 2 - 50;
    var nodeCir = new cc.Node();
    nodeCir.width = oriCirWidth;
    nodeCir.height = oriCirWidth;
    nodeCir.parent = nodeItem;
    nodeCir.y = oriCirDis;
    nodeCir.on(cc.Node.EventType.TOUCH_START, function (evt) {
        evt.stopPropagation();
    });
    nodeCir.on(cc.Node.EventType.TOUCH_MOVE, function (evt) {
        evt.stopPropagation();
        var oriCirPosX = 0;
        var oriCirPosY = 0;
        var parent = nodeCir.parent;
        do {
            oriCirPosX += parent.x;
            oriCirPosY += parent.y;
            parent = parent.parent;
        } while (parent);
        var disX = evt.getLocationX() - oriCirPosX;
        var disY = evt.getLocationY() - oriCirPosY;
        var angle = (disY == 0) ? (disX < 0 ? -90 : 90) : ((disY < 0 ? 180 : 0) + Math.atan(disX / disY) * 180 / Math.PI);
        var rat = angle * Math.PI / 180;
        nodeCir.x = oriCirDis * Math.sin(rat);
        nodeCir.y = oriCirDis * Math.cos(rat);
        nodeImge.rotation = angle;
        moveEvt();
    });
    nodeCir.on(cc.Node.EventType.TOUCH_END, touchEnd);
    var nodeSliderOpacity = newSlider(width, 20, function (evt) { nodeImge.opacity = 255 * evt.progress; });
    nodeSliderOpacity.y = (height + nodeSliderOpacity.height) / 2 + 2;
    nodeSliderOpacity.parent = nodeItem;
    var nodeSliderScale = newSlider(width, 20, function (evt) { nodeImge.scale = evt.progress; });
    nodeSliderScale.y = (nodeSliderOpacity.height + nodeSliderScale.height) / 2 + nodeSliderOpacity.y + 2;
    nodeSliderScale.parent = nodeItem;
    var nodeCenter = new cc.Node();
    nodeCenter.parent = nodeItem;
    drawCircle(nodeCenter, 10, COLOR_GREEN);
    drawCircle(nodeCir, nodeCir.width, COLOR_RED);
    addBottomClose(nodeItem, nodeItem, width, height, moveEvt, touchEnd);
    addMoveEvt(nodeItem, nodeItem, moveEvt, touchEnd);
}
    

