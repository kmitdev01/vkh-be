'use strict';

/**
 *  question-list controller
 */

//const { createCoreController } = require('@strapi/strapi').factories;

//module.exports = createCoreController('api::question-list.question-list');

const schema = require("../content-types/question-list/schema.json");
const createPopulatedController = require("../../../helpers/populate");

module.exports = createPopulatedController("api::question-list.question-list", schema);
