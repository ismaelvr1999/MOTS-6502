//http://www.6502.org/users/obelisk/6502/reference.html#LDA
const assert = require("node:assert");
import runTest from "./testUtils";
import { CPU } from "../src/CPU";
import { Memory } from "../src/Memory";
import opcodes from "../src/opcodes";


export const LDAImmediateTest = runTest("Immediate Address Mode can load value into the A register", () => {
    const mem = new Memory();
    mem.data[0xFFFC] = opcodes.INS_LDA_IM;
    mem.data[0xFFFD] = 0x6;
    let cpu = new CPU(mem);
    cpu.execute(2);
    assert.equal(cpu.A, 0x6);
    assert.equal(cpu.Z, 0);
    assert.equal(cpu.N, 0);
    assert.equal(cpu.cycles, 0);
});

export const LDAZeroPageTest = runTest("LDA Zero Page Address Mode can load value into the A register", () => {
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
    assert.equal(cpu.cycles, 0);
});

export const LDAZeroPageXTest = runTest("LDA Zero Page X can load value into the A register ", () => {
    const mem = new Memory();
    let zeroPageAddress = 0x42; 
    mem.data[0xFFFC] = opcodes.INS_LDA_ZPX;
    mem.data[0xFFFD] = zeroPageAddress;
    mem.data[zeroPageAddress] = 0x6; // X = 0 
    let cpu = new CPU(mem); 
    cpu.execute(4);
    assert.equal(cpu.A, 0x6);
    assert.equal(cpu.Z, 0);
    assert.equal(cpu.N, 0);
    assert.equal(cpu.cycles, 0);
});

export const LDAZeroPageXWrapTest = runTest("LDA Zero Page X can load value into the A register when it wraps ", () => {
    const mem = new Memory();
    let zeroPageAddress = 0x80; 
    mem.data[0xFFFC] = opcodes.INS_LDA_ZPX;
    mem.data[0xFFFD] = zeroPageAddress; 
    // 0x80 +  0xFF = 0x017F; 0x017F & 0x00FF = 0x007f;   
    mem.data[0x7F] = 0x37;  
    let cpu = new CPU(mem); 
    cpu.X = 0xFF;

    cpu.execute(4);
    assert.equal(cpu.A, 0x37);
    assert.equal(cpu.Z, 0);
    assert.equal(cpu.N, 0);
    assert.equal(cpu.cycles, 0);
});