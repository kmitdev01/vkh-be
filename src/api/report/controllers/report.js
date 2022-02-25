'use strict';

/**
 *  report controller
 */

//const { createCoreController } = require('@strapi/strapi').factories;

//module.exports = createCoreController('api::report.report');

const schema = require("../content-types/report/schema.json");
const createPopulatedController = require("../../../helpers/populate");

module.exports = createPopulatedController("api::report.report", schema);
