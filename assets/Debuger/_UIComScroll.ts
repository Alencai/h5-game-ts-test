const { ccclass, property } = cc._decorator;

import DebugUIItem from './_UICompItem'

@ccclass
export default class DebugUIScroll extends cc.Component {
    @property(DebugUIItem) itemTemplate = null
    @property(cc.Node)     scrollRect = null
    @property(cc.Node)     scrollContent = null
    @property({displayName: '刷新间隔' }) updateInterval = 0.1
    @property({displayName: '行数'     }) rowCount = 14
    @property({displayName: '列数'     }) colCount = 1
    @property({displayName: '行间距'   }) itemScpaceY = 2
    @property({displayName: '列间距'   }) itemScpaceX = 2
    @property() _aListItems = [];
    @property() _astItemDatas = [];
    @property() _fUpdateDelta = 0;    // 距上次刷新时的累计时间
    @property() _fLastContentY = 0;   // 上一次刷新时的位置
    @property() _iItemCachePosY = 0;  // item被缓冲到next可见区的滚动位移
    @property() _iZoneBuffer = 0;     // item缓冲范围
    @property() _iItemHeight = 10;    // item高度
    @property() _iItemWidth = 10;     // item宽度
    @property() _iRectHeight = 100;   // 裁剪框大小

    onLoad() {
        this._iItemHeight = this.itemTemplate.height;
        this._iItemWidth = this.itemTemplate.width;
        this._iZoneBuffer = (this._iItemHeight + this.node.height) / 2;
        this._iItemCachePosY = (this._iItemHeight + this.itemScpaceY) * this.rowCount;
        this._iRectHeight = this.node.height;
        this.itemTemplate.active = false;
        this.scrollRect.height = this._iRectHeight;
    }

    start() {
        // test
        // var list = []; for (var i = 0; i < 200; list.push(++i));
        // this.updateListData(list, -1);
    }

    _setListItem(itemIdx, delayIdx, posX, posY, data) {
        var item = this._aListItems[itemIdx];
        if (item) {
            this._initListItem(item, itemIdx, posX, posY, data);
            return;
        }
        this._pushListItem(itemIdx, delayIdx, posX, posY, data);
    }

    // item必须包含更新方法： updateItem （注意： 如果有注册事件，需要先清理原事件，因为此item是重复利用的）
    // 且scroll会在node节点上增加 scrollItemIdx 字段
    _initListItem(item, idx, posX, posY, data) {
        if (item) {
            item.active = true;
            item.x = posX;
            item.y = posY;
            item.scrollItemIdx = idx;
            var comp = item.getComponent(DebugUIItem);
            if (comp) {
                comp.updateItem(data, idx);
            }
            // test
            // item.getChildByName('label').getComponent(cc.Label).string = '' + idx;
        }
    }

    _pushListItem(itemIdx, delayIdx, posX, posY, data) {
        var delayTime = delayIdx * this.updateInterval + 0.01;
        this.node.runAction(cc.sequence(
            cc.delayTime(delayTime),
            cc.callFunc(function () {
                var item = cc.instantiate(this.itemTemplate);
                this.scrollContent.addChild(item);
                this._aListItems.push(item);
                this._initListItem(item, itemIdx, posX, posY, data);
            }, this)
        ));
    }

    _getPositionInView (item) {
        var worldPos = item.parent.convertToWorldSpaceAR(item.position);
        var viewPos = this.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    }

    refreshCurrentItems(data) {
        var items = this._aListItems;
        for (var i in items) {
            var comp = items[i].getComponent(DebugUIItem);
            if (comp) {
                comp.refreshItem(data);
            }
        }
    }

    // toIdx： 表示要跳转的目标索引，如果为负数，则跳到最底下
    updateListData(list, toIdx = 0) {
        var items = this._aListItems;
        for (var i in items) {
            items[i].active = false;
        }
        if (!list || list.length == 0) {
            this._astItemDatas = [];
            return;
        }
        var iItemHeight = this._iItemHeight;
        var iItemWidth = this._iItemWidth;
        var iItemSpaceX = this.itemScpaceX;
        var iItemSpaceY = this.itemScpaceY;
        var iRowCount = this.rowCount;
        var iColCount = this.colCount;
        var iItemsCount = list.length;
        var iOriginPosX = -iItemWidth * iColCount / 2 - iItemSpaceX * (1 + iColCount) / 2;
        var iRowStartShow = 0;
        var iRowStartReal = 0;
        var fromIdx = 0;
        if (iRowCount > 0 && toIdx != 0) {
            if (0 < toIdx && toIdx < iItemsCount) {
                iRowStartShow = Math.floor(toIdx / iColCount);
                toIdx = iRowStartShow * iColCount;
            }
            else {
                iRowStartShow = Math.floor(iItemsCount / iColCount);
            }
            var tempIdx = iItemsCount - (iRowCount - 1) * iColCount - 1;
            if (tempIdx > 0) {
                fromIdx = toIdx < 0 ? tempIdx : Math.min(toIdx, tempIdx);
                iRowStartReal = Math.floor(fromIdx / iColCount);
            }
        }
        var iRealRowCount = Math.floor((iItemsCount + iColCount - 1) / iColCount);
        var fContentY = this._iRectHeight / 2;
        var fContentHeight = iRealRowCount * (this.itemTemplate.height + iItemSpaceY) + iItemSpaceY;
        if (iRowStartShow > 0) {
            fContentY = Math.min(fContentY + iRowStartShow * (this.itemTemplate.height + iItemSpaceY) + iItemSpaceY, fContentHeight - fContentY);
        }
        for (var row = 0, idx = 0; row < iRowCount && fromIdx < iItemsCount; ++row) {
            var posY = -iItemHeight * (0.5 + row + iRowStartReal) - iItemSpaceY * (1 + row + iRowStartReal);
            for (var col = 0; col < iColCount && fromIdx < iItemsCount; ++col, ++fromIdx, ++idx) {
                var posX = iOriginPosX + iItemWidth * (0.5 + col) + iItemSpaceX * (col + 1);
                this._setListItem(fromIdx, idx, posX, posY, list[fromIdx]);
            }
        }
        this._fLastContentY = fContentY;
        this.scrollContent.y = fContentY;
        this.scrollContent.height = fContentHeight;
        this._astItemDatas = list;
    }

    updateScroll(dt) {
        this._fUpdateDelta += dt;
        if (this._fUpdateDelta < this.updateInterval) {
            return;
        }
        this._fUpdateDelta = 0;
        var list = this._astItemDatas;
        if (!list || list.length == 0) {
            return;
        }
        var isDown = this.scrollContent.y <= this._fLastContentY;
        var buffer = this._iZoneBuffer;
        var itemsList = this._aListItems;
        var itemsSize = (isDown ? this.rowCount : -this.rowCount) * this.colCount;
        var offset = isDown ? this._iItemCachePosY : -this._iItemCachePosY;
        for (var i in itemsList) {
            var itemIdx = itemsList[i].scrollItemIdx;
            if (itemIdx || itemIdx == 0) {
                var nextIdx = itemIdx - itemsSize;
                if (nextIdx >= 0 && list[nextIdx]) {
                    var viewPos = this._getPositionInView(itemsList[i]);
                    if (isDown ? (viewPos.y < -buffer) : (viewPos.y > buffer)) {
                        this._initListItem(itemsList[i], nextIdx, itemsList[i].x, itemsList[i].y + offset, list[nextIdx]);
                    }
                }
            }
        }
        this._fLastContentY = this.scrollContent.y;
    }

    updateIitem(data){
        var items = this._aListItems;
        for(var i = 0;i < items.length;i++){
            var item = items[i];
            var comp = item.getComponent(DebugUIItem);
            if (comp) {
                comp.updateItem(data, null);
            }
        }
    }

    update(dt) {
        this.updateScroll(dt);
    }
}

