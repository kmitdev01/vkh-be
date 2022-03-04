'use strict';

/**
 *  filter controller
 */

//const { createCoreController } = require('@strapi/strapi').factories;

//module.exports = createCoreController('api::filter.filter');

const schema = require("../content-types/filter/schema.json");
const createPopulatedController = require("../../../helpers/populate");

module.exports = createPopulatedController("api::filter.filter", schema);

