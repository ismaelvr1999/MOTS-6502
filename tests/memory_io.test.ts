const assert = require("node:assert");
import runTest from "./testUtils";
import { CPU } from "../src/CPU";
import { Memory } from "../src/Memory";
import opcodes from "../src/opcodes";

export const fetchByteTest = runTest("fetchByte should fetch a byte, increment PC and decrement Cycles one unit", () => {
    const mem = new Memory();
    mem.data[0xFFFC] = opcodes.INS_JSR;
    const cpu = new CPU(mem);
    cpu.cycles = 1;
    assert.equal(cpu.fetchByte(),opcodes.INS_JSR);
    assert.equal(cpu.PC,0xFFFC + 1);
    assert.equal(cpu.cycles,0);
});

export const readByteTest = runTest("readByte should read a byte, decrement Cycles one unit", () => {
    let address = 0xFFFC; 
    const mem = new Memory();
    mem.data[0xFFFC] = opcodes.INS_JSR;
    const cpu = new CPU(mem);
    cpu.cycles = 1;
    assert.equal(cpu.readByte(address),opcodes.INS_JSR);
    assert.equal(cpu.cycles,0);
});

export const fetchWordTest = runTest("fetchWord should fetch a word (16-bits ), decrement Cycles two units and increment PC two units ", () => {
    const mem = new Memory();
    mem.data[0xFFFC] = 0x22;
    mem.data[0xFFFD] = 0x22;
    const cpu = new CPU(mem);
    cpu.cycles = 2;
    assert.equal(cpu.fetchWord(),0x2222);
    assert.equal(cpu.PC,0xFFFE);
    assert.equal(cpu.cycles,0);
});

export const writeWordTest = runTest("writeWord should write a word (16-bits ) into memory", () => {
    const mem = new Memory();
    mem.writeWord(0x2222,0xFFFC)
    mem.data[0xFFFC] 
    mem.data[0xFFFD] 
    assert.equal(mem.data[0xFFFC],0x22);
    assert.equal(mem.data[0xFFFD],0x22);
});