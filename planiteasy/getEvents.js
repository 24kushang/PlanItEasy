exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "The first Lambda is up and running",
    }),
  };
};
