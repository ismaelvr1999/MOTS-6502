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
    static INS_LDA_IM = 0xA9; //Load Accumulator Immediate
    static INS_LDA_ZP = 0xA5; //Load Accumulator Zero page
    static INS_LDA_ZPX = 0xB5; //Load Accumulator Zero page x

    constructor(memory: Memory) {
        this.memory = memory;
    }

    reset() {
        this.PC = 0xFFFC;
        this.SP = 0x0100;
        this.D = 0x0100;
        this.C, this.Z, this.I, this.D, this.B, this.O, this.N = 0;
        this.A, this.X, this.Y = 0;
    }

    fetchByte() {
        const data = this.memory.data[this.PC];
        this.PC++;
        return data;
    }

    readByte(zeroPageAddress: number) {
        const data = this.memory.data[zeroPageAddress];
        return data;
    }

    LDASetStatus (){
        this.Z = this.A === 0 ? 1 : 0;
        this.N = (this.A & 0x80) > 0 ? 1 : 0
    }

    execute(cycles: number) {
        while (cycles > 0) {
            const instruction = this.fetchByte();
            cycles--;
            switch (instruction) {
                case CPU.INS_LDA_IM:
                    {
                        const value = this.fetchByte();
                        cycles--;
                        this.A = value;
                        this.LDASetStatus();
                    }
                    break;

                case CPU.INS_LDA_ZP:
                    {
                        const zeroPageAddress = this.fetchByte();
                        cycles--;
                        this.A = this.readByte(zeroPageAddress);
                        cycles--;
                        this.LDASetStatus();
                    }
                    break;

                case CPU.INS_LDA_ZPX:
                    {
                        let zeroPageAddress = this.fetchByte();
                        cycles--;
                        zeroPageAddress += this.X;
                        cycles--;
                        this.A = this.readByte(zeroPageAddress);
                        cycles--;
                        this.LDASetStatus();
                    }
                    break;

                default:
                    console.log(`Instruction not handled ${instruction}`)
                break;
            }

        }
    }
}

const mem = new Memory();
const cpu = new CPU(mem);
cpu.reset();
//cpu.execute(4);