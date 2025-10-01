import { LDAImmediateTest, LDAZeroPageTest, LDAZeroPageXTest } from "./ins_lda.test";
import {JSRAbsoluteTest} from "./ins_jsr.test";
import { fetchByteTest, readByteTest, fetchWordTest, writeWordTest } from "./memory_io.test";

LDAImmediateTest();
LDAZeroPageTest();
LDAZeroPageXTest();
JSRAbsoluteTest();

fetchByteTest();
readByteTest();
fetchWordTest();
writeWordTest();
