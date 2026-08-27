import { Router } from "express";
import { generateVerificationCodeHandler } from "./handlers/generate-verification-code-handler";
import { validateVerificationCodeHandler } from "./handlers/validate-verification-code-handler";

const verificationCodeRoutes = Router();

verificationCodeRoutes.get("/validate", validateVerificationCodeHandler);
verificationCodeRoutes.post("/generate", generateVerificationCodeHandler);

export { verificationCodeRoutes };
