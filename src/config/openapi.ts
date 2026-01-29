export const openApiSpec = {
    openapi: "3.0.0",
    info: {
        title: "URL Shortener API",
        version: "1.0.0",
        description: "API for creating and resolving short URLs",
    },
    servers: [{ url: "/" }],
    tags: [
        { name: "Short URLs", description: "Create and resolve short URLs" },
        { name: "User", description: "User-related endpoints" },
    ],
    paths: {
        "/{code}": {
            get: {
                tags: ["Short URLs"],
                summary: "Redirect to long URL",
                description: "Resolves a short code and redirects to the original URL",
                parameters: [
                    {
                        name: "code",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "302": { description: "Redirect to the original URL" },
                    "404": {
                        description: "No matching URL found",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: { message: { type: "string" } },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/v1/url": {
            post: {
                tags: ["Short URLs"],
                summary: "Create short URL",
                description: "Creates a short URL and returns the short code",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["url"],
                                properties: {
                                    url: { type: "string", format: "uri" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Short code for the created URL",
                        content: {
                            "text/plain": {
                                schema: { type: "string" },
                            },
                        },
                    },
                    "400": {
                        description: "Invalid request",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: { message: { type: "string" } },
                                },
                            },
                        },
                    },
                },
            },
            get: {
                tags: ["Short URLs"],
                summary: "List current user's short URLs",
                description: "Returns all short URLs created by the authenticated user. Paginated via limit and offset.",
                parameters: [
                    {
                        name: "limit",
                        in: "query",
                        description: "Maximum number of items to return",
                        schema: { type: "integer", minimum: 1, default: 10 },
                    },
                    {
                        name: "offset",
                        in: "query",
                        description: "Number of items to skip",
                        schema: { type: "integer", minimum: 0, default: 0 },
                    },
                ],
                responses: {
                    "200": {
                        description: "List of user's short URLs",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer" },
                                            url: { type: "string" },
                                            shortCode: { type: "string" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    "401": { description: "Unauthenticated" },
                    "400": {
                        description: "Bad request",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: { message: { type: "string" } },
                                },
                            },
                        },
                    },
                },
            },
        },

        "/api/v1/user": {
            post: {
                tags: ["User"],
                summary: "Placeholder",
                description: "Not implemented",
                responses: {
                    "501": { description: "Not implemented" },
                },
            },
        },
    },
} as const;
