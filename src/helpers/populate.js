const { createCoreController } = require('@strapi/strapi').factories;

function populateAttribute({ components }) {
    if (components) {
        const populate = components.reduce((currentValue, current) => {
            return { ...currentValue, [current.split(".").pop()]: { populate: "*" } };
        }, {});
        return { populate };
    }
    return { populate: "*" };
}

const getPopulateFromSchema = function (schema) {
    return Object.keys(schema.attributes).reduce((currentValue, current) => {
        const attribute = schema.attributes[current];
        if (!["dynamiczone", "component"].includes(attribute.type)) {
            return currentValue;
        }
        return {
            ...currentValue,
            [current]: populateAttribute(attribute),
        };
    }, {});
};

function createPopulatedController(uid, schema) {
    return createCoreController(uid, () => {
        // console.log(schema.collectionName, getPopulateFromSchema(schema));
        return {
            async find(ctx) {
                ctx.query = {
                    ...ctx.query,
                    populate: getPopulateFromSchema(schema),
                };
                return await super.find(ctx);
            },
            async findOne(ctx) {
                ctx.query = {
                    ...ctx.query,
                    populate: getPopulateFromSchema(schema),
                };
                return await super.findOne(ctx);
            },
        };
    });
}

module.exports = createPopulatedController;