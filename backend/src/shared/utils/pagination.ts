import type { Model, ModelStatic, FindAndCountOptions } from "sequelize";
import { paginationConfig } from "@src/config/pagination";
import type { SchemaValidatePaginationFilters } from "../@types/pagination";

class Pagination<T extends Model> {
  constructor(private model: ModelStatic<T>) {}

  public async paginate(
    filters?: Partial<SchemaValidatePaginationFilters>,
    options?: Omit<FindAndCountOptions, "limit" | "offset">,
  ) {
    const page = filters?.page || paginationConfig.start;
    const pageSize = filters?.pageSize || paginationConfig.limit;
    const offset = (page - 1) * pageSize;

    const { rows, count } = await this.model.findAndCountAll({
      ...options,
      limit: pageSize,
      offset,
    });

    return {
      data: rows,
      page,
      pageSize,
      pageCount: Math.ceil(count / pageSize),
      total: count,
    };
  }
}

export { Pagination };
