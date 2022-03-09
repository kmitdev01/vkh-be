'use strict';

module.exports = {
    "routes": [
        {
            "method": "GET",
            "path": "/v1/filters",
            "handler": "filter.getFilters",
            "config": {
                "policies": []
            }
        }
    ]
}