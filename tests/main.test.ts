import {
    LDAImmediateTest,
    LDAZeroPageTest,
    LDAZeroPageXTest,
    LDAZeroPageXWrapTest
} from "./ins_lda.test";
import {
    fetchByteTest,
    readByteTest, 
    writeWordTest,
    fetchWordTest,
} from "./memory_io.test";
import { JSRAbsoluteTest } from "./ins_jsr.test";

LDAImmediateTest();
LDAZeroPageTest();
LDAZeroPageXTest();
JSRAbsoluteTest();

fetchByteTest();
readByteTest();
fetchWordTest();
writeWordTest();
LDAZeroPageXWrapTest();