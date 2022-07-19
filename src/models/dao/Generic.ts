import Objection, { Model } from 'objection';

/**
 * Generic Model that is a template for every other model.
 */
class Generic extends Model {
  // Default attributes on every table.
  id!: number;

  createdAt!: Date;

  updatedAt!: Date;

  // Map database table into snake cases.
  static columnNameMappers = Objection.snakeCaseMappers();
}

export default Generic;
