//http://www.6502.org/users/obelisk/6502/reference.html#JSR
const assert = require("node:assert");
import runTest from "./testUtils";
import { CPU } from "../src/CPU";
import { Memory } from "../src/Memory";
import opcodes from "../src/opcodes";


export const JSRAbsoluteTest = runTest("JSR Absolute should set Program Counter to subroutine address ", () => {
    const mem = new Memory();
    mem.data[0xFFFC] = opcodes.INS_JSR;
    // Write 1 word 16-bits
    mem.data[0xFFFD] = 0x42;
    mem.data[0xFFFE] = 0x42;

    let cpu = new CPU(mem);
    cpu.execute(6);
    assert.equal(cpu.PC, 0x4242);
    assert.equal(cpu.cycles, 0);
});