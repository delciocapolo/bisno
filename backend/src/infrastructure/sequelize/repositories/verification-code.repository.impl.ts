import { Op, type FindOptions } from "sequelize";
import { VerificationCode } from "../models/verification-code.model.js";
import type { VerificationCodeAttributes } from "../models/verification-code.model.js";
import type { VerificationCodeTypes } from "@src/domain/entities/verification-code.entity.js";
import type { VerificationCodeRepository } from "@src/domain/repositories/verification-code.repository.js";
import {
  generateOTP,
  getExpirationTime,
} from "../utils/verification-code-utils.js";
import { isDefined } from "@src/shared/utils/index.js";
import type { IValidateVerificationCodePayload } from "@src/shared/events/verification-code-events.js";
import { isFuture } from "date-fns";

const VERIFICATION_CODE_ATTRIBUTES = [
  "id",
  "code",
  "type",
  "mobile",
  "usedAt",
  "expiresAt",
  "createdAt",
  "updatedAt",
];

export class SequelizeVerificationCodeRepository implements VerificationCodeRepository {
  async list(
    params?: FindOptions<VerificationCodeAttributes>,
  ): Promise<VerificationCode[]> {
    return await VerificationCode.findAll({
      where: params?.where,
      include: params?.include,
      order: params?.order,
      limit: params?.limit,
      offset: params?.offset,
      attributes: VERIFICATION_CODE_ATTRIBUTES,
    });
  }

  async verify(payload: IValidateVerificationCodePayload): Promise<boolean> {
    const verificationCode = await VerificationCode.findOne({
      order: [["createdAt", "DESC"]],
      attributes: VERIFICATION_CODE_ATTRIBUTES,
      where: {
        code: { [Op.like]: `%${payload.code}%` },
        mobile: { [Op.like]: `%${payload.mobile}%` },
      },
    });

    if (!isDefined(verificationCode)) {
      return false;
    }

    return isFuture(verificationCode.expiresAt);
  }

  async getVerificationCodeById(id: string): Promise<VerificationCode | null> {
    return await VerificationCode.findByPk(id, {
      attributes: VERIFICATION_CODE_ATTRIBUTES,
    });
  }

  async getVerificationCodeByMobile(
    mobile: string,
  ): Promise<VerificationCode | null> {
    return await VerificationCode.findOne({
      where: { mobile: mobile },
    });
  }

  async save(
    mobile: string,
    type?: VerificationCodeTypes,
  ): Promise<VerificationCode | null> {
    return await VerificationCode.create({
      code: generateOTP(),
      mobile: mobile,
      expiresAt: getExpirationTime(),
      type: type || "identity_verification",
    });
  }
}
