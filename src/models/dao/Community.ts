/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import {
  Model, ModelOptions, Pojo, QueryContext,
} from 'objection';
import slugify from 'slugify';
import File from './File';
import Generic from './Generic';
// import User from './User';
import Topic from './Topic';
import Location from './Location';
import CommunityMember from './CommunityMember';
// import Event from './Event';

class Community extends Generic {
  name!: string;

  slug: string;

  description: string;

  locationId: number;

  imageId: number;

  bannerImageId: number;

  static get tableName() {
    return 'communities';
  }

  static relationMappings = {
    hasTags: {
      relation: Model.ManyToManyRelation,
      modelClass: Topic,
      join: {
        from: 'communities.id',
        through: {
          from: 'community_topics.community_id',
          to: 'community_topics.topic_id',
        },
        to: 'topics.id',
      },
    },
    locatedOn: {
      relation: Model.BelongsToOneRelation,
      modelClass: Location,
      join: {
        from: 'communities.location_id',
        to: 'locations.id',
      },
    },
    hasImage: {
      relation: Model.HasOneRelation,
      modelClass: File,
      join: {
        from: 'communities.image_id',
        to: 'files.id',
      },
    },
    hasBanner: {
      relation: Model.HasOneRelation,
      modelClass: File,
      join: {
        from: 'communities.banner_image_id',
        to: 'files.id',
      },
    },
    hasMembers: {
      relation: Model.ManyToManyRelation,
      modelClass: `${__dirname}/User`,
      join: {
        from: 'communities.id',
        through: {
          from: 'community_members.community_id',
          to: 'community_members.user_id',
          extra: {
            isAdmin: 'community_members.is_admin',
          },
        },
        to: 'users.id',
      },
    },
    hasMembersId: {
      relation: Model.HasManyRelation,
      modelClass: CommunityMember,
      join: {
        from: 'communities.id',
        to: 'community_members.community_id',
      },
    },
    events: {
      relation: Model.HasManyRelation,
      modelClass: `${__dirname}/Event`,
      join: {
        from: 'communities.id',
        to: 'events.community_id',
      },
    },
  };

  static get jsonSchema() {
    // TODO: add input DTO schema here
    // User.fromJson will call this
    return {
      type: 'object',
      properties: {
        name: {
          description: 'name of the community',
          type: 'string',
        },
        slug: {
          description: 'slug of the community',
          type: 'string',
        },
        description: {
          description: 'description of the community',
          type: 'string',
        },
        locationId: {
          description: 'location id of the community',
          type: 'number',
        },
        imageId: {
          description: 'image id of the community',
          type: 'number',
        },
        bannerImageId: {
          description: 'image id of the community\'s banner',
          type: 'number',
        },
      },
      required: ['name'],
    };
  }

  $parseJson(json: Pojo, opt?: ModelOptions): Pojo {
    const _json = super.$parseJson(json, opt);
    const final = new Community();
    final.name = _json.name;
    final.slug = _json.slug;
    final.description = _json.description;
    final.locationId = _json.locationId;
    final.imageId = _json.imageId;
    final.bannerImageId = _json.bannerImageId;
    return final;
  }

  $beforeInsert(): void | Promise<any> {
    this.slug = slugify(this.name);
  }

  $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): void | Promise<any> {
    super.$beforeUpdate(opt, queryContext);
    if (!opt.patch || (opt.patch && this.name)) { this.slug = slugify(this.name); }
    this.updatedAt = new Date();
  }

  $formatJson(json: Pojo): Pojo {
    // TODO: add output DTO here
    const _json = super.$formatJson(json);
    if (_json.locatedOn) {
      delete _json.locatedOn.id;
      delete _json.locatedOn.createdAt;
      delete _json.locatedOn.updatedAt;
    }
    if (_json.hasImage) {
      delete _json.hasImage.id;
      delete _json.hasImage.createdAt;
      delete _json.hasImage.updatedAt;
    }
    if (_json.hasBanner) {
      delete _json.hasBanner.id;
      delete _json.hasBanner.createdAt;
      delete _json.hasBanner.updatedAt;
    }
    for (const tags in _json.hasTags) {
      delete _json.hasTags[tags].id;
      delete _json.hasTags[tags].createdAt;
      delete _json.hasTags[tags].updatedAt;
      delete _json.hasTags[tags].imageId;
    }
    delete _json.imageId;
    delete _json.bannerImageId;
    delete _json.locationId;
    return _json;
  }
}

export default Community;
