'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const nodemailer = require("nodemailer");
const { convertArrayToCSV } = require('convert-array-to-csv');
const fs = require('fs');

module.exports = createCoreController('api::newsletter.newsletter', ({ strapi }) => ({
    /// Function for sending CSV on email
    async sendCsv(ctx) {

        const filterIds = ctx.request.body.data.filters;
        const reportIds = ctx.request.body.data.reports;
        const searchQuery = ctx.request.body.data.searchTerm;
        const filtersKey = Object.keys(filterIds);
        const filtersQuery = {};
        filtersKey.map((item) => {
            if (filterIds[item].length) {
                filtersQuery[item] = {
                    id: {
                        $in: Number(filterIds[item])
                    },
                }
            }
        });

        let reportIdsQuery = {}

        if (reportIds.length) {
            reportIdsQuery = {
                id: {
                    $in: reportIds,
                },
            }
        }

        const finalReports = await strapi.db.query('api::report.report').findMany({
            where: {
                AddFilters: filtersQuery,
                ReportName: {
                    $containsi: searchQuery
                },
                ...reportIdsQuery
            },

            populate: {
                AddFilters: {
                    populate: {
                        countries: true,
                        publishing_organizations: true,
                        years: true
                    }
                }
            }
        });


        const data = finalReports.map((item) => {
            const countries = item?.AddFilters?.countries[0]?.CountryName;
            const publishing_organizations = item?.AddFilters?.publishing_organizations[0]?.PublishingOrganization;
            const years = item?.AddFilters?.years[0]?.Year;
            return {
                'Report Name': item?.ReportName,
                "Source": item?.URL,
                "Countries": countries || "-",
                'Publishing Organization(s)': publishing_organizations || "-",
                "Year": years || "-",
            };
        });

        const htmlTemplate = fs.readFileSync(__dirname + '/KnowledgeHub.html', 'utf-8');

        const csvData = convertArrayToCSV(data);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAILPASSWORD
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: ctx.request.body.data.Email,
            subject: 'CSV From VKH',
            html: htmlTemplate,
            attachments: [
                {
                    filename: "reports.csv",
                    content: csvData,
                },
            ],
        };
        const result = { status: "success", "msg": "Email sent successfully" }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }

        });
        return { result }
    },



    /////// //////// Download CSV Function ///////////////////////////

    async downloadCsv(ctx) {

        const filterIds = ctx.request.body.data.filters;
        const reportIds = ctx.request.body.data.reports;
        const searchQuery = ctx.request.body.data.searchTerm;
        const filtersKey = Object.keys(filterIds);
        const filtersQuery = {};
        filtersKey.map((item) => {
            if (filterIds[item].length) {
                filtersQuery[item] = {
                    id: {
                        $in: Number(filterIds[item])
                    },
                }
            }
        });

        let reportIdsQuery = {}
        if (reportIds.length) {
            reportIdsQuery = {
                id: {
                    $in: reportIds,
                },
            }
        }

        const finalReports = await strapi.db.query('api::report.report').findMany({
            where: {
                AddFilters: filtersQuery,
                ReportName: {
                    $containsi: searchQuery
                },
                ...reportIdsQuery
            },

            populate: {
                AddFilters: {
                    populate: {
                        countries: true,
                        publishing_organizations: true,
                        years: true
                    }
                }
            }
        });

        const data = finalReports.map((item) => {
            const countries = item?.AddFilters?.countries[0]?.CountryName;
            const publishing_organizations = item?.AddFilters?.publishing_organizations[0]?.PublishingOrganization;
            const years = item?.AddFilters?.years[0]?.Year;
            return {
                'Report Name': item?.ReportName,
                "Source": item?.URL,
                "Countries": countries || "-",
                'Publishing Organization(s)': publishing_organizations || "-",
                "Year": years || "-",
            };
        });

        const csvData = convertArrayToCSV(data);
        const result = {
            status: "success",
            csv: csvData
        }
        return { result }

    },

}));