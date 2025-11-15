import opcodes from "./opcodes";
import { Memory } from "./Memory";

export class CPU {
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

    constructor(memory: Memory) {
        this.memory = memory;
        this.reset();
    }

    reset() {
        this.PC = 0xFFFC;
        this.SP = 0x0100;
        this.D = 0x0100;
        this.C = 0; this.Z = 0; this.I = 0; this.D = 0; this.B = 0; this.O = 0; this.N = 0;
        this.A = 0; this.X = 0; this.Y = 0;
    }

    fetchByte() {
        const data = this.memory.data[this.PC];
        this.cycles--;
        this.PC++;
        return data;
    }

    readByte(zeroPageAddress: number) {
        const data = this.memory.data[zeroPageAddress];
        this.cycles--;
        return data;
    }

    readWord(zeroPageAddress: number) {
        let lowByte = this.readByte(zeroPageAddress);
        let HighByte = this.readByte(zeroPageAddress + 1);
        return lowByte | (HighByte << 8);
    }
    // Combines the two bytes into a 16-bit word 
    // for absolute or indirect addressing mode
    fetchWord() {
        // exampĺe
        // 000000001000010 0x0042
        // 100001000000000 0x4200  0x42 << 8
        // 100001001000010 0x4242 (0x42 | (0x0042 << 8))
        let data = this.memory.data[this.PC];
        this.PC++;
        data |= (this.memory.data[this.PC] << 8);
        this.PC++;
        this.cycles -= 2;
        return data

    }

    LDASetStatus() {
        this.Z = this.A === 0 ? 1 : 0;
        //0x80 10000000
        //0x37 00110111
        this.N = (this.A & 0x80) > 0 ? 1 : 0;
    }

    execute(cycles: number) {
        this.cycles = cycles;
        while (this.cycles > 0) {
            const instruction = this.fetchByte();
            switch (instruction) {
                case opcodes.INS_LDA_IM:
                    {
                        const value = this.fetchByte();
                        this.A = value;
                        this.LDASetStatus();
                    }
                    break;

                case opcodes.INS_LDA_ABS:
                    {
                        const address = this.fetchWord();
                        const value = this.readByte(address);
                        this.A = value;
                        this.LDASetStatus();
                    }
                    break;

                case opcodes.INS_LDA_ABSX:
                    {
                        let absAddress = this.fetchWord();
                        let absAddressX = absAddress + this.X;
                        const value = this.readByte(absAddressX);
                        this.A = value;
                        if (absAddressX - absAddress >= 0xFF) {
                            this.cycles--;
                        }
                        this.LDASetStatus();
                    }
                    break;

                case opcodes.INS_LDA_ABSY:
                    {
                        let absAddress = this.fetchWord();
                        let absAddressY = absAddress + this.Y;
                        const value = this.readByte(absAddressY);
                        this.A = value;
                        if (absAddressY - absAddress >= 0xFF) {
                            this.cycles--;
                        }
                        this.LDASetStatus();
                    }
                    break;

                case opcodes.INS_LDA_ZP:
                    {
                        const zeroPageAddress = this.fetchByte();
                        this.A = this.readByte(zeroPageAddress);
                        this.LDASetStatus();
                    }
                    break;

                case opcodes.INS_LDA_ZPX:
                    {
                        let zeroPageAddress = this.fetchByte();
                        zeroPageAddress += this.X;
                        zeroPageAddress =
                            zeroPageAddress > 0xFF
                                ? zeroPageAddress & 0xFF
                                : zeroPageAddress;

                        this.cycles--;
                        this.A = this.readByte(zeroPageAddress);
                        this.LDASetStatus();
                    }
                    break;
                case opcodes.INS_LDA_INDX:
                    {
                        let zpAddress = this.fetchByte();
                        zpAddress += this.X;
                        this.cycles--;
                        let effectiveAddress = this.readWord(zpAddress);
                        this.A = this.readByte(effectiveAddress);
                        this.LDASetStatus();
                    } break;
                case opcodes.INS_LDA_INDY: {
                    let zpAddress = this.fetchByte();
                    let effectiveAddress = this.readWord(zpAddress);
                    let effectiveAddressY = effectiveAddress + this.Y;
                    this.A = this.readByte(effectiveAddressY);
                    if (effectiveAddressY - effectiveAddress >= 0xFF) {
                        this.cycles--;
                    }
                    this.LDASetStatus();
                } break;

                case opcodes.INS_JSR:
                    {
                        let subAddr = this.fetchWord();
                        // Fetch the 16-bit subroutine address from the next two bytes.
                        // Push the return address (address of the last byte of JSR instruction) onto the stack.
                        // This allows RTS to return to the instruction *after* the JSR.
                        this.memory.writeWord(this.PC - 1, this.SP);
                        this.cycles -= 2;
                        this.SP += 2;
                        this.PC = subAddr; // Point counter to the Subroutine to execute.
                        this.cycles--;
                    } break;

                default:
                    throw new Error(`Instruction not handled 0x${instruction.toString(16)}`);
                    break;
            }

        }
    }
}

