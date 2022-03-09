'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::report.report', ({ strapi }) => ({
    // Method 2: Wrapping a core service (leaves core logic in place)
    async getFilters(ctx) {
        const results = {};
        const countries = await strapi.db.query('api::country.country').findMany();
        const years = await strapi.db.query('api::year.year').findMany();
        const generationSources = await strapi.db.query('api::generation-source.generation-source').findMany();
        const publishingOrganization = await strapi.db.query('api::publishing-organization.publishing-organization').findMany();
        const region = await strapi.db.query('api::region.region').findMany();
        const segment = await strapi.db.query('api::segment.segment').findMany();
        const documentType = await strapi.db.query('api::document-type.document-type').findMany();
        const coAuthor = await strapi.db.query('api::co-author.co-author').findMany();

        results.countries = countries;
        results.year = years;
        results.generationSources = generationSources;
        results.publishingOrganization = publishingOrganization;
        results.segment = segment;
        results.documentType = documentType;
        results.coAuthor = coAuthor;
        results.region = region;
        return { results }
    }

}));