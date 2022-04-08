'use strict';

module.exports = {
    "routes": [
        {
            "method": "POST",
            "path": "/v1/send-csv",
            "handler": "mailchimp.sendCsv",
            "config": {
                "policies": []
            }
        },
        {
            "method": "POST",
            "path": "/v1/download-csv",
            "handler": "mailchimp.downloadCsv",
            "config": {
                "policies": []
            }
        },
    ]
}