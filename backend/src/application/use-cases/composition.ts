import { SequelizeBisnoRepository } from "@src/infrastructure/sequelize/repositories/bisno.repository.impl.js";
import { CreateBisnoUseCase } from "./bisno/create-bisno.use-case.js";
import { SequelizeMixeiroRepository } from "@src/infrastructure/sequelize/repositories/mixeiro.repository.impl.js";
import { CreateMixeiroUseCase } from "./mixeiro/create-mixeiro.use-case.js";
import { ListMixeirosUseCase } from "./mixeiro/list-mixeiros.use-case.js";
import { GetNextEligibleMixeiroUseCase } from "./mixeiro/get-next-eligible-mixeiro.use-case.js";
import { GetBisnoUseCase } from "./bisno/get-bisno.use-case.js";
import { SequelizeMixeiroHasSubscriptionRepository } from "@src/infrastructure/sequelize/repositories/mixeiro-has-subscription.repository.impl.js";
import { CreateMixeiroSubscriptionUseCase } from "./mixeiro-subscriptions/create-mixeiro-subscription.use-case.js";
import { SequelizeServiceRepository } from "@src/infrastructure/sequelize/repositories/service.repository.impl.js";
import { SequelizeLeadRepository } from "@src/infrastructure/sequelize/repositories/lead.repository.impl.js";
import { CreateLeadUseCase } from "./lead/create-lead.use-case.js";
import { GetServiceUseCase } from "./service/get-service.use-case.js";
import { GetLeadByIdUseCase } from "./lead/get-lead.use-case.js";
import { ListExpiredLeadUseCase } from "./lead/list-expired-lead.use-case.js";
import { GetLeadByBisnoIdUseCase } from "./lead/get-lead-by-bisno-id.use-case.js";
import { GetMixeiroByIdUseCase } from "./mixeiro/get-mixeiro-by-id.use-case.js";
import { GetSubscriptionByMixeiroIdUseCase } from "./mixeiro-subscriptions/get-subscription-by-mixeiro-id.use-case.js";
import { DecrementSubscriptionPointUseCase } from "./mixeiro-subscriptions/decrement-subscription-point.use-case.js";
import { GetMixeiroByUseCase } from "./mixeiro/get-mixeiro-by.use-case.js";
import { ListServicesUseCase } from "./service/list-service.use-case.js";
import { ListLeadPaginatedUseCase } from "./lead/list-lead-paginated.use-case.js";
import { ListBisnoPaginatedUseCase } from "./bisno/list-bisno-paginated.use-case.js";
import { ListMixeiroPaginatedUseCase } from "./mixeiro/list-mixeiro-paginated.use-case.js";
import { ListServicePaginatedUseCase } from "./service/list-services-paginated.use-case.js";
import { GetCategoryServiceUseCase } from "./category-service/get-category-service.use-case.js";
import { SequelizeCategoryServiceRepository } from "@src/infrastructure/sequelize/repositories/category-service.repository.impl.js";
import { ListCategoryServicesUseCase } from "./category-service/list-category-service.use-case.js";
import { ListCategoryServicesPaginatedUseCase } from "./category-service/list-category-services-paginated.use-case.js";
import { SequelizeZoneRepository } from "@src/infrastructure/sequelize/repositories/zone.repository.impl.js";
import { GetZoneUseCase } from "./zones/get-zone.use-case.js";
import { ListZoneUseCase } from "./zones/list-zone.use-case.js";
import { ListZonePaginatedUseCase } from "./zones/list-zone-paginated.use-case.js";
import { SequelizeVerificationCodeRepository } from "@src/infrastructure/sequelize/repositories/verification-code.repository.impl.js";
import { ValidateVerificationCodeUseCase } from "./verification-code/validate-verification-code.use-case.js";
import { GenerateVerificationCodeUseCase } from "./verification-code/generate-verification-code.use-case.js";
import { IncrementSubscriptionPointUseCase } from "./mixeiro-subscriptions/increment-subscription-point.use-case.js";

const bisnoRepository = new SequelizeBisnoRepository();
const mixeiroRepository = new SequelizeMixeiroRepository();
const mixeiroHasSubscriptionRepository =
  new SequelizeMixeiroHasSubscriptionRepository();
const serviceRepository = new SequelizeServiceRepository();
const leadRepository = new SequelizeLeadRepository();
const categoryServiceRepository = new SequelizeCategoryServiceRepository();
const zoneRepository = new SequelizeZoneRepository();
const verificationCodeRepository = new SequelizeVerificationCodeRepository();

// use-cases

// Bisno
const createBisnoUseCase = new CreateBisnoUseCase(bisnoRepository);
const getBisnoUseCase = new GetBisnoUseCase(bisnoRepository);
const listBisnosPaginatedUseCase = new ListBisnoPaginatedUseCase(
  bisnoRepository,
);

// Mixeiro
const createMixeiroUseCase = new CreateMixeiroUseCase(mixeiroRepository);
const getMixeiroByIdUseCase = new GetMixeiroByIdUseCase(mixeiroRepository);
const getMixeiroByUseCase = new GetMixeiroByUseCase(mixeiroRepository);
const listMixeirosUseCase = new ListMixeirosUseCase(mixeiroRepository);
const getNextEligibleMixeiroUseCase = new GetNextEligibleMixeiroUseCase(
  mixeiroRepository,
  serviceRepository,
);
const listMixeirosPaginatedUseCase = new ListMixeiroPaginatedUseCase(
  mixeiroRepository,
);

// Mixeiro-Has-Subscription
const createMixeiroSubscriptionUseCase = new CreateMixeiroSubscriptionUseCase(
  mixeiroHasSubscriptionRepository,
);
const getSubscriptionByMixeiroIdUseCase = new GetSubscriptionByMixeiroIdUseCase(
  mixeiroHasSubscriptionRepository,
);
const decrementSubscriptionPointUseCase = new DecrementSubscriptionPointUseCase(
  mixeiroHasSubscriptionRepository,
);
const incrementSubscriptionPointUseCase = new IncrementSubscriptionPointUseCase(
  mixeiroHasSubscriptionRepository,
);

// Lead
const createLeadUseCase = new CreateLeadUseCase(leadRepository);
const getLeadByIdUseCase = new GetLeadByIdUseCase(leadRepository);
const getLeadByBisnoIdUseCase = new GetLeadByBisnoIdUseCase(leadRepository);
const listExpiredLeadUseCase = new ListExpiredLeadUseCase(leadRepository);
const listLeadPaginatedUseCase = new ListLeadPaginatedUseCase(leadRepository);

// Service
const getServiceUseCase = new GetServiceUseCase(serviceRepository);
const listServicesUseCase = new ListServicesUseCase(serviceRepository);
const listServicesPaginatedUseCase = new ListServicePaginatedUseCase(
  serviceRepository,
);

// Zones
const getZoneUseCase = new GetZoneUseCase(zoneRepository);
const listZonesUseCase = new ListZoneUseCase(zoneRepository);
const listZonesPaginatedUseCase = new ListZonePaginatedUseCase(zoneRepository);

// Category Service
const getCategoryServiceUseCase = new GetCategoryServiceUseCase(
  categoryServiceRepository,
);
const listCategoryServicesUseCase = new ListCategoryServicesUseCase(
  categoryServiceRepository,
);
const listCategoryServicesPaginatedUseCase =
  new ListCategoryServicesPaginatedUseCase(categoryServiceRepository);

// Verification Code
const validateVerificationCodeUseCase = new ValidateVerificationCodeUseCase(
  verificationCodeRepository,
);
const generateVerificationCodeUseCase = new GenerateVerificationCodeUseCase(
  verificationCodeRepository,
);

export {
  createBisnoUseCase,
  getBisnoUseCase,
  createMixeiroUseCase,
  listMixeirosUseCase,
  getNextEligibleMixeiroUseCase,
  createMixeiroSubscriptionUseCase,
  createLeadUseCase,
  getServiceUseCase,
  listServicesUseCase,
  getLeadByIdUseCase,
  getLeadByBisnoIdUseCase,
  listExpiredLeadUseCase,
  getMixeiroByIdUseCase,
  getSubscriptionByMixeiroIdUseCase,
  decrementSubscriptionPointUseCase,
  getMixeiroByUseCase,
  listLeadPaginatedUseCase,
  listBisnosPaginatedUseCase,
  listMixeirosPaginatedUseCase,
  listServicesPaginatedUseCase,
  getCategoryServiceUseCase,
  listCategoryServicesUseCase,
  listCategoryServicesPaginatedUseCase,
  getZoneUseCase,
  listZonesUseCase,
  listZonesPaginatedUseCase,
  validateVerificationCodeUseCase,
  generateVerificationCodeUseCase,
  incrementSubscriptionPointUseCase,
};
