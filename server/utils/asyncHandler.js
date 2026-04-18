const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      return await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default asyncHandler;

//async handler function is an utility function that is used to return async  function and for not writing try catch block again and again

//for normal middelware error (next) then we have to  make all the controller middelware so any function using try catch block
