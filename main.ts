class Memory {
    MAX_MEM: number = 1026 * 64;
    data: Uint8Array = new Uint8Array(this.MAX_MEM);

}

class CPU {
    memory: Memory;

    PC: number = 0; // Program Counter
    SP: number = 0; // Stack Pointer
    A: number = 0; // Accumulator
    X: number = 0; // Index Register X
    Y: number = 0; // Index Register Y

    // status flags
    C: number = 1;
    Z: number = 1;
    I: number = 1;
    D: number = 1;
    B: number = 1;
    O: number = 1;
    N: number = 1;

    //opcodes
    INS_LDA_IM = 0xA9; //Load Accumulator

    constructor(memory: Memory){
        this.memory = memory;
    }

    reset(){
        this.PC = 0xFFFC;
        this.SP = 0x0100;
        this.D = 0x0100;
        this.C, this.Z, this.I, this.D, this.B, this.O, this.N = 0;
        this.A, this.X, this.Y  = 0; 
    }

    fetchByte(){
        const data = this.memory.data[this.PC];
        this.PC ++;
        return data;
    }

    execute (cycles: number) {
        while (cycles > 0) {
            const instruction = this.fetchByte();
            cycles--;

            switch (instruction) {
                case this.INS_LDA_IM:
                    const value = this.fetchByte();
                    cycles--;
                    this.A = value;
                    this.Z = this.A === 0? 1: 0;
                    this.N = (this.A & 0x80)>0 ? 1:0 
                break;
            }
        }
    }
}

const mem = new Memory();
const cpu = new CPU(mem);

cpu.reset();