const formatResponse = (data, statusCode) => {
    return {
        status: statusCode,
        message: data,
    };
};

module.exports = { formatResponse };
