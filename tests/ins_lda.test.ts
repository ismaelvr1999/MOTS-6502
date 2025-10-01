//http://www.6502.org/users/obelisk/6502/reference.html#LDA
const assert = require("node:assert");
import runTest from "./testUtils";
import { CPU } from "../src/CPU";
import { Memory } from "../src/Memory";
import opcodes from "../src/opcodes";


export const LDAImmediateTest = runTest("Immediate Address Mode should set Z flag to 0 if A = 0 ", () => {
    const mem = new Memory();
    mem.data[0xFFFC] = opcodes.INS_LDA_IM;
    mem.data[0xFFFD] = 0x00;
    let cpu = new CPU(mem);
    cpu.execute(2);
    assert.equal(cpu.A, 0x00);
    assert.equal(cpu.Z, 1);
    assert.equal(cpu.cycles, 0);
});

export const LDAZeroPageTest = runTest("LDA Zero Page Address Mode should set Z flag to 0 if A = 0 ", () => {
    const mem = new Memory();
    let zeroPageAddress = 0xFFFE; 
    mem.data[0xFFFC] = opcodes.INS_LDA_ZP;
    mem.data[0xFFFD] = zeroPageAddress;
    mem.data[zeroPageAddress] = 0x00;
    let cpu = new CPU(mem);
    cpu.execute(3);
    assert.equal(cpu.A, 0x00);
    assert.equal(cpu.Z, 1);
    assert.equal(cpu.cycles, 0);
});

export const LDAZeroPageXTest = runTest("LDA Zero Page X Address Mode should set Z flag to 0 if A = 0 ", () => {
    const mem = new Memory();
    let zeroPageAddress = 0xFFFE; 
    mem.data[0xFFFC] = opcodes.INS_LDA_ZPX;
    mem.data[0xFFFD] = zeroPageAddress;
    mem.data[zeroPageAddress] = 0x00; // X = 0 
    let cpu = new CPU(mem); 
    cpu.execute(4);
    assert.equal(cpu.A, 0x00);
    assert.equal(cpu.Z, 1);
    assert.equal(cpu.cycles, 0);
});