'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const nodemailer = require("nodemailer");
const { convertArrayToCSV } = require('convert-array-to-csv');
const fs = require('fs');

module.exports = createCoreController('api::newsletter.newsletter', ({ strapi }) => ({
    /// Function for sending CSV on email
    async sendCsv(ctx) {
        // try {
        //     const mailChimpResponse = await axios({
        //         method: 'POST',
        //         url: "https://mandrillapp.com/api/1.0/messages/send-template",
        //         data: {
        //             "key": "ovIMd3hGxCH6kEYeCaGTKw1",
        //             "template_name": "Demo2",
        //             "template_content": {
        //                 "name": "",
        //                 "content": ""
        //             },
        //             "message": {
        //                 "from_email": "shiven@keymouseit.com",
        //                 "from_name": "Shiven Juneja",
        //                 "subject": "Test Email",
        //                 "text": "Hello Juneja, this is just a test email to check the working",
        //                 "to": [
        //                     {
        //                         "email": ctx.request.body.data.Email,
        //                         "name": ctx.request.body.data.Name
        //                     }
        //                 ]
        //             }
        //         }
        //     });
        //     return mailChimpResponse.data
        // } catch (error) {
        //     return
        //     // return error.response;
        //     //return error.response.setErrorMessage(e.getMessage());

        //     //Which one
        //     //this one 5xx
        //     //error.response.setStatusCode(500);
        //     //Or this one 4xx
        //     // error.response.setStatusCode(409);
        // }


        const finalReports = await strapi.db.query('api::report.report').findMany({
            where: {
                id: {
                    $in: ctx.request.body.data.reports,
                },
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
        const finalReports = await strapi.db.query('api::report.report').findMany({
            where: {
                id: {
                    $in: ctx.request.body.data.reports,
                },
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

        // const req = {
        //     countries: [3, 8, 19,],
        //     years: [4, 5, 9]
        // }
        // const filteredReports = finalReports.filter(report => {
        //     let result = false;
        //     const { AddFilters } = report;
        //     const filtersToMatch = Object.keys(req);
        //     for (let i = 0; i < filtersToMatch.length; i++) {
        //         console.log(filtersToMatch, filtersToMatch[i], AddFilters[filtersToMatch[i]]);
        //         const reportFilterIds = AddFilters[filtersToMatch[i]].map(filter => filter.id);
        //         const isEqual = reportFilterIds.sort().toString() == req[filtersToMatch[i]].sort().toString();
        //         if (isEqual) {
        //             result = true;
        //         }
        //     }
        //     return result;
        // })
        // return filteredReports;

        // console.log(filterData);

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