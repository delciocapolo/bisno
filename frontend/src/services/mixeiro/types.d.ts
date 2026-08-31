import type { ICategoryService } from "../category/types";
import type { IMixeiroHasSubscription } from "../mixeiro-subscription/types";
import type { IZone } from "../zones/types";

export interface IMixeiro {
  id: string;
  mobile: string;
  isActive: boolean;
  customName: string;
  verifiedAt: string;
  categoryService: Pick<ICategoryService, "name">;
  zone: Pick<IZone, "name">;
  subscription: IMixeiroHasSubscription;
}
