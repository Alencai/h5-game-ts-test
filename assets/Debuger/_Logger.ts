var oldSysErr:Function = null;
var oldLog:Function = null;
var oldErr:Function = null;
var oldWarn:Function = null;
var logIdx:number = 0;
var logList:string[] = [];
const MAX_LOG = 2000;

function addLine(msg:string) {
    var arr:string[] = msg.split('\n');
    for (var i in arr) {
        ++ logIdx;
        logList.push(logIdx + " - " + arr[i]);
    }
    (logList.length > MAX_LOG) && logList.splice(0, logList.length - MAX_LOG);
};

function addDump(obj, idt, dth) {
    if (dth > 0) {
        return;
    }
    for (var idx in obj) {
        if(typeof(idx) == 'string') {
            if(idx.indexOf('__') == 0 || idx.indexOf('$') == 0) {
                continue;
            }
        }
        var item = obj[idx];
        var tpe = typeof(item);
        var pre = idt + idx + ": ";
        // if (Object.prototype.toString.call(obj) == '[object Array]') {
        //     pre += idx + ": ";
        // }
        if(tpe == 'string' || tpe == 'number' || tpe == 'boolean') {
            addLine(pre + item);
            continue;
        }
        if(tpe == 'function') {
            addLine(pre + '[function]');
            continue;
        }
        var info = Object.prototype.toString.call(item);
        addLine(pre + info);
        if (info == '[object Object]') {
            addDump(item, idt + " -- ", dth + 1);
            continue;
        }
        if(info == '[object Array]') {
            addDump(item, idt + " -- ", 0);
            continue;
        }
    }
};

function dealLog(args:any, func:Function) {
    if(args && args.length > 0){
        addDump(args, "", 0);
        func && func.apply(null, args);
    }
}

function debugLog() {
    dealLog(arguments, oldLog);
};

function debugError() {
    dealLog(arguments, oldErr);
};

function debugWarn() {
    dealLog(arguments, oldWarn);
};

function debugSysErr(msg:string, url:string, line:number) {
    addLine("[Error] (" + line + ") " + url);
    addLine("[Error] " + msg);
    oldSysErr && oldSysErr(msg, url, line);
}

//--------------------------------------------------------------------

export function initial() {
    if (oldSysErr == window.onerror) {
        return;
    }
    oldSysErr = window.onerror; 
    oldLog = cc.log.bind(cc);
    oldErr = cc.error.bind(cc);
    oldWarn = cc.warn.bind(cc);
    cc.log = debugLog;
    cc.error = debugError;
    cc.warn = debugWarn;
    //拦截错误信息， 无视这里的警告
    window.onerror = debugSysErr;
};

export function getLogIndex() {
    return logIdx;
}

export function getLogList() {
    return logList;
}
