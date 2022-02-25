'use strict';

/**
 * segment router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::segment.segment');
