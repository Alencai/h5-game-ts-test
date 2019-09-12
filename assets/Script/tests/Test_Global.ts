

// 长娘enum， 正常来说
// 在其它文件可以直接 EStatus.Alive 使用，不需要import
// 但是creator编译后，其它文件未定义： EStatus.Alive 
const enum EStatus {
    Alive,
    Die,
}
// 正常来说
// 编译后会替换为常量，下面编译后应为： export var expvalue = 0
// 但是在creator中，没有被替换
export var expvalue = EStatus.Alive


// 常量其它类型，只能在本文件使用，其它文件无法使用
const EStatus_Alive = 3

