export class Memory {
    private MAX_MEM: number = 1026 * 64;
    data: Uint8Array = new Uint8Array(this.MAX_MEM);

    writeWord(value: number, address: number) {
        // Split the 16 - bits address to save it.
        // 11111111 0xFF
        // 1111111111111110 0xFFFE
        // 11111110         0xFFFE & 0xFF -> 0xFE
        // 11111111         0xFFFE >> 8 ->   0xFF
        this.data[address] = value & 0xFF;
        this.data[address + 1] = (value >> 8);
    }
};