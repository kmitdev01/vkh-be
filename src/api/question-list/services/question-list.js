'use strict';

/**
 * question-list service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::question-list.question-list');
