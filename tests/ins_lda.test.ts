//http://www.6502.org/users/obelisk/6502/reference.html#LDA
const assert = require("node:assert");
import { test, describe } from "./testUtils";
import { CPU } from "../src/CPU";
import { Memory } from "../src/Memory";
import opcodes from "../src/opcodes";

const VerifyUnmodifiedFlagsFromLDA = (cpu: CPU) => {
    assert.equal(cpu.C, 0)
    assert.equal(cpu.I, 0)
    assert.equal(cpu.D, 0)
    assert.equal(cpu.B, 0)
}

export default describe("Instruction LDA test", () => {

    test("Immediate Address Mode can load value into the A register", () => {
        const mem = new Memory();
        mem.data[0xFFFC] = opcodes.INS_LDA_IM;
        mem.data[0xFFFD] = 0x6;
        let cpu = new CPU(mem);
        cpu.execute(2);

        assert.equal(cpu.A, 0x6);
        assert.equal(cpu.Z, 0);
        assert.equal(cpu.N, 0);
        VerifyUnmodifiedFlagsFromLDA(cpu);
        assert.equal(cpu.cycles, 0);
    });

    test("Absolute Address Mode can load value into the A register", () => {
        //given
        const mem = new Memory();
        mem.data[0xFFFC] = opcodes.INS_LDA_ABS;
        mem.data[0xFFFD] = 0x80;
        mem.data[0xFFFE] = 0x44;
        mem.data[0x4480] = 0x6
        let cpu = new CPU(mem);
        //when
        cpu.execute(4);
        //then
        assert.equal(cpu.A, 0x6);
        assert.equal(cpu.Z, 0);
        assert.equal(cpu.N, 0);
        VerifyUnmodifiedFlagsFromLDA(cpu);
        assert.equal(cpu.cycles, 0);
    });

    test("Absolute X Address Mode can load value into the A register", () => {
        //given
        const mem = new Memory();
        const X = 0x01;
        mem.data[0xFFFC] = opcodes.INS_LDA_ABSX;
        mem.data[0xFFFD] = 0x80;
        mem.data[0xFFFE] = 0x44;
        mem.data[0x4480 + X] = 0x6
        let cpu = new CPU(mem);
        cpu.X = X;
        //when
        cpu.execute(4);
        //then
        assert.equal(cpu.A, 0x6);
        assert.equal(cpu.Z, 0);
        assert.equal(cpu.N, 0);
        VerifyUnmodifiedFlagsFromLDA(cpu);
        assert.equal(cpu.cycles, 0);
    });

    test("Absolute X Address Mode can load value into the A register when it crosses a page boundary", () => {
        //given
        const mem = new Memory();
        const X = 0xFF;
        mem.data[0xFFFC] = opcodes.INS_LDA_ABSX;
        mem.data[0xFFFD] = 0x02;
        mem.data[0xFFFE] = 0x44;
        mem.data[0x4501] = 0x6 // 0x4402 + crosses page boundary
        let cpu = new CPU(mem);
        cpu.X = X;
        //when
        cpu.execute(5);
        //then
        assert.equal(cpu.A, 0x6);
        assert.equal(cpu.Z, 0);
        assert.equal(cpu.N, 0);
        VerifyUnmodifiedFlagsFromLDA(cpu);
        assert.equal(cpu.cycles, 0);
    });

    test("Absolute Y Address Mode can load value into the A register", () => {
        //given
        const mem = new Memory();
        const Y = 0x01;
        mem.data[0xFFFC] = opcodes.INS_LDA_ABSY;
        mem.data[0xFFFD] = 0x80;
        mem.data[0xFFFE] = 0x44;
        mem.data[0x4480 + Y] = 0x6
        let cpu = new CPU(mem);
        cpu.Y = Y;
        //when
        cpu.execute(4);
        //then
        assert.equal(cpu.A, 0x6);
        assert.equal(cpu.Z, 0);
        assert.equal(cpu.N, 0);
        VerifyUnmodifiedFlagsFromLDA(cpu);
        assert.equal(cpu.cycles, 0);
    });

    test("Absolute Y Address Mode can load value into the A register when it crosses a page boundary", () => {
        //given
        const mem = new Memory();
        const Y = 0xFF;
        mem.data[0xFFFC] = opcodes.INS_LDA_ABSY;
        mem.data[0xFFFD] = 0x02;
        mem.data[0xFFFE] = 0x44;
        mem.data[0x4501] = 0x6 // 0x4402 + crosses page boundary
        let cpu = new CPU(mem);
        cpu.Y = Y;
        //when
        cpu.execute(5);
        //then
        assert.equal(cpu.A, 0x6);
        assert.equal(cpu.Z, 0);
        assert.equal(cpu.N, 0);
        VerifyUnmodifiedFlagsFromLDA(cpu);
        assert.equal(cpu.cycles, 0);
    });

    test("LDA Zero Page Address Mode can load value into the A register", () => {
        const mem = new Memory();
        let zeroPageAddress = 0xFE;
        mem.data[0xFFFC] = opcodes.INS_LDA_ZP;
        mem.data[0xFFFD] = zeroPageAddress;
        mem.data[zeroPageAddress] = 0x6;
        let cpu = new CPU(mem);
        cpu.execute(3);

        assert.equal(cpu.A, 0x6);
        assert.equal(cpu.Z, 0);
        assert.equal(cpu.N, 0);
        VerifyUnmodifiedFlagsFromLDA(cpu);
        assert.equal(cpu.cycles, 0);
    });

    test("LDA Zero Page X can load value into the A register ", () => {
        const mem = new Memory();
        const zeroPageAddress = 0x42;
        const X = 1;
        mem.data[0xFFFC] = opcodes.INS_LDA_ZPX;
        mem.data[0xFFFD] = zeroPageAddress;
        mem.data[zeroPageAddress + X] = 0x6; 
        let cpu = new CPU(mem);
        cpu.X = X;
        cpu.execute(4);

        assert.equal(cpu.A, 0x6);
        assert.equal(cpu.Z, 0);
        assert.equal(cpu.N, 0);
        VerifyUnmodifiedFlagsFromLDA(cpu);
        assert.equal(cpu.cycles, 0);
    });

    test("LDA Zero Page X can load value into the A register when it wraps ", () => {
        const mem = new Memory();
        const zeroPageAddress = 0x80;
        const X = 0xFF; 
        mem.data[0xFFFC] = opcodes.INS_LDA_ZPX;
        mem.data[0xFFFD] = zeroPageAddress;
        // 0x80 +  0xFF = 0x017F; 0x017F & 0x00FF = 0x007f;   
        mem.data[0x7F] = 0x37;
        let cpu = new CPU(mem);
        cpu.X = X;
        cpu.execute(4);

        assert.equal(cpu.A, 0x37);
        assert.equal(cpu.Z, 0);
        assert.equal(cpu.N, 0);
        VerifyUnmodifiedFlagsFromLDA(cpu);
        assert.equal(cpu.cycles, 0);
    });

    test("Indirect X Address Mode can load value into the A register", () => {
        //given
        const mem = new Memory();
        const X = 0x04;
        mem.data[0xFFFC] = opcodes.INS_LDA_INDX;
        mem.data[0xFFFD] = 0x02;
        mem.data[0x0006] = 0x00;
        mem.data[0x0007] = 0x80;
        mem.data[0x8000] = 0x37; 
        let cpu = new CPU(mem);
        cpu.X = X;
        //when
        cpu.execute(6);
        //then
        assert.equal(cpu.A, 0x37);
        assert.equal(cpu.Z, 0);
        assert.equal(cpu.N, 0);
        VerifyUnmodifiedFlagsFromLDA(cpu);
        assert.equal(cpu.cycles, 0);
    });

    test("Indirect Y Address Mode can load value into the A register", () => {
        //given
        const mem = new Memory();
        const Y = 0x04;
        mem.data[0xFFFC] = opcodes.INS_LDA_INDY;
        mem.data[0xFFFD] = 0x02;
        mem.data[0x0002] = 0x00;
        mem.data[0x0003] = 0x80;
        mem.data[0x8004] = 0x37; //0x8000 + 0x4 
        let cpu = new CPU(mem);
        cpu.Y = Y;
        //when
        cpu.execute(5);
        //then
        assert.equal(cpu.A, 0x37);
        assert.equal(cpu.Z, 0);
        assert.equal(cpu.N, 0);
        VerifyUnmodifiedFlagsFromLDA(cpu);
        assert.equal(cpu.cycles, 0);
    });

    test("Indirect Y Address Mode can load value into the A register when it crosses a page boundary", () => {
        //given
        const mem = new Memory();
        const Y = 0xFF;
        mem.data[0xFFFC] = opcodes.INS_LDA_INDY;
        mem.data[0xFFFD] = 0x02;
        mem.data[0x0002] = 0x02;
        mem.data[0x0003] = 0x80;
        mem.data[0x8101] = 0x37; //0x8002 + 0xFF 
        let cpu = new CPU(mem);
        cpu.Y = Y;
        //when
        cpu.execute(6);
        //then
        assert.equal(cpu.A, 0x37);
        assert.equal(cpu.Z, 0);
        assert.equal(cpu.N, 0);
        VerifyUnmodifiedFlagsFromLDA(cpu);
        assert.equal(cpu.cycles, 0);
    });
});