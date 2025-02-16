const STATUS_CODES = require("./StatusCode");

class ResponseHandler {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    sender(code, message, data, error, info) {
        this.res.status(code).json({
            message:
                message,
            data,
            error: info,
        });
        if (error) {
            // HANDLE LOGS AND OTHER STUFF
            console.log('ERROR', error);
        }
    }

    /* 
        ARGUMENTS : Status code, message, data object,  error object
    */
    custom(...args) {
        this.sender(...args);
    }

    /* 
        ARGUMENTS : data o̥̥bject, message, error object
    */

    // 2XX SUCCESS
    success(data, message, info) {
        this.sender(STATUS_CODES.SUCCESS, message, data, info);
    }

    updated(data, message, info) {
        this.sender(STATUS_CODES.SUCCESS, message, data, info);
    }

    created(data, message, info) {
        this.sender(STATUS_CODES.CREATED, message, data, info);
    }

    // 4XX CLIENT ERROR
    badRequest(message, data, info) {
        this.sender(
            STATUS_CODES.BAD_REQUEST,
            message,
            data,
            info
        );
    }

    unauthorized(message, data, info) {
        this.sender(
            STATUS_CODES.UNAUTHORIZED,
            message,
            data,
            info
        );
    }

    forbidden(message, data, info) {
        this.sender(
            STATUS_CODES.FORBIDDEN,
            message,
            data,
            info
        );
    }

    notFound(message, info) {
        this.sender(STATUS_CODES.NOT_FOUND, message, info);
    }

    conflict(message, data, info) {
        this.sender(
            STATUS_CODES.CONFLICT,
            message,
            data,
            info
        );
    }

    notAllowed(message, data, info) {
        this.sender(
            STATUS_CODES.NOT_ALLOWED,
            message,
            data,
            info
        );
    }

    preconditionFailed(message, data, info) {
        this.sender(
            STATUS_CODES.PRECONDITION_FAILED,
            message,
            data,
            info
        );
    }

    validationError(message, error) {
        this.sender(
            STATUS_CODES.VALIDATION_ERROR,
            message,
            null,
            null,
            error
        );
    }

    // 5XX SERVER ERROR
    serverError(error) {
        console.log("--->", error)
        this.sender(
            STATUS_CODES.SERVER_ERROR,
            error || "Internal server error",
            undefined,
            error
        );
    }
}
module.exports = ResponseHandler;