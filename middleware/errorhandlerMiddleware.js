import { ErrorClass } from "../errorClass.js";
export const errorHandler = (API) => {
    return (req, res, next) => {
        API(req, res, next)?.catch((err) => {
            console.log("Error in API: ", err);

            next(new ErrorClass(500, "Internal Server error"));
        });
    };
};

export const globalResponse = (err, req, res, next, ) => {

    if (err) {
        res.status(err.status || 500).json({
            message: "Fail response",
            err_msg: err.message,
            err_location: err.location,
            err_data: err.data,
        });
    }
};