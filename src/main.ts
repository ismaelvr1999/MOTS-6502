class Memory {
    MAX_MEM: number = 1026 * 64;
    data: Uint8Array = new Uint8Array(this.MAX_MEM);
    writeWord(value:number,address:number) {
        // Split the 16 - bits address to save it.
        // 11111111 0xFF
        // 1111111111111110 0xFFFE
        // 11111110         0xFFFE & 0xFF -> 0xFE
        // 11111111         0xFFFE >> 8 ->   0xFF
        this.data[address] = value & 0xFF;
        this.data[address + 1] = (value >> 8);
    }
}

class CPU {
    memory: Memory;
    cycles: number = 0;

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
    static INS_JSR = 0x20; // Jumb to Subroutine

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
        this.cycles --;
        this.PC++;
        return data;
    }

    readByte(zeroPageAddress: number) {
        const data = this.memory.data[zeroPageAddress];
        this.cycles--;
        return data;
    }
    // Combines the two bytes into a 16-bit word 
    // for absolute or indirect addressing mode
    fetchWord() {
        // exampĺe
        // 01000010        0x42
        // 100001000000000 0x4200  0x42 << 8
        // 100001001000010 0x4242 (0x42 | (0x42 << 8))
        let data = this.memory.data[this.PC];
        this.PC++;
        data |= (this.memory.data[this.PC] << 8);
        this.PC++;
        this.cycles -= 2; 
        return data

    }

    LDASetStatus (){
        this.Z = this.A === 0 ? 1 : 0;
        this.N = (this.A & 0x80) > 0 ? 1 : 0
    }

    execute(cycles: number) {
        this.cycles = cycles;
        while (this.cycles > 0) {
            const instruction = this.fetchByte();
            switch (instruction) {
                case CPU.INS_LDA_IM:
                    {
                        const value = this.fetchByte();
                        this.A = value;
                        this.LDASetStatus();
                    }
                    break;

                case CPU.INS_LDA_ZP:
                    {
                        const zeroPageAddress = this.fetchByte();
                        this.A = this.readByte(zeroPageAddress);
                        this.LDASetStatus();
                    }
                    break;

                case CPU.INS_LDA_ZPX:
                    {
                        let zeroPageAddress = this.fetchByte();
                        zeroPageAddress += this.X;
                        this.cycles--;
                        this.A = this.readByte(zeroPageAddress);
                        this.LDASetStatus();
                    }
                    break;
                
                case CPU.INS_JSR:
                    {
                        let subAddr = this.fetchWord(); // Fetch the 16-bit subroutine address from the next two bytes.
                        // Push the return address (address of the last byte of JSR instruction) onto the stack.
                        // This allows RTS to return to the instruction *after* the JSR.
                        this.memory.writeWord(this.PC -1, this.SP); 
                        this.cycles -=2;
                        this.SP ++;
                        this.PC = subAddr; // Point counter to the Subroutine to execute.
                        this.cycles --;
                    }break;

                default:
                    console.log(`Instruction not handled ${instruction}`)
                break;
            }

        }
    }
}

const mem = new Memory();
/* mem.data[0xFFFC] = CPU.INS_JSR;
mem.data[0xFFFD] = 0x42;
mem.data[0xFFFE] = 0x42;
mem.data[0x4242] = CPU.INS_LDA_IM;
mem.data[0x4243] = 0x84;  */
const cpu = new CPU(mem);
cpu.reset();
cpu.execute(8);