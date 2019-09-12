
declare module msgpack {
    class Bufferish {
        // ... 不展开了，直接log看数据 
    }
    class CodeC {
        constuctor(options: any | null);
        init();
        install(props: object): void;
        add(a: Function, b: Function): void;
        join(filters: Array): void;
        filter(filters: Array | any): void;
    }
    class Preset {
        preset: CodeC;
    }
    export function encode(input: any, options?: any): Uint8Array;
    export function decode(input: Uint8Array, options?: any): any;
    export function codec(): Preset;
    export function createCodec(options?: any): CodeC;
    export class Encoder {
        maxBufferSize: number;
        minBufferSize: number;
        start: number;
        offset: number;
        bufferish: Bufferish;
        codec: CodeC;
        constuctor(options?: any);
        pull(): any;
        push(chunk: any): void;
        read(): any;
        reserve(length:number): number;
        send(buffer: any): void;
        write(chunk: any): void;
        fetch(): void;
        flush(): void;
        encode(input: any): any;
    }
    export class Decoder {
        offset: number;
        bufferish: Bufferish;
        codec: CodeC;
        constuctor(options?: any);
        pull(): any;
        push(chunk: any): void;
        read(): any;
        reserve(length:number): number;
        send(buffer: any): void;
        write(chunk: any): void;
        fetch(): void;
        flush(): void;
        end(): void;
        decode(input: any): any;
    }
}



