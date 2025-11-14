const assert = require("node:assert");
import { test, describe } from "./testUtils";
import { CPU } from "../src/CPU";
import { Memory } from "../src/Memory";
import opcodes from "../src/opcodes";


export default describe("CPU internals", ()=>{
    test("CPU does nothing when we execute zero cycles",()=>{
        const cycles = 0;
        const mem = new Memory();
        const cpu = new CPU(mem);

        cpu.execute(cycles);
        assert.equal(cycles,0);
    });

    test("CPU can execute more cycles than requested if required by the instruction", () => {
        const mem = new Memory();
        const reqCycles = 1;
        mem.data[0xFFFC] = opcodes.INS_LDA_IM;
        mem.data[0xFFFD] = 0x6;
        let cpu = new CPU(mem);
        cpu.execute(reqCycles);
        let cyclesUsed = Math.abs(cpu.cycles - reqCycles);
        assert.equal(cyclesUsed, 2);
    });
});  