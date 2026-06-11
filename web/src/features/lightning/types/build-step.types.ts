import { BUILD_STEPS } from "../constants";

export type BuildStep = (typeof BUILD_STEPS)[number];
