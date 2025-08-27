class CustomError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;

    Object.setPrototypeOf(this, CustomError.prototype);

    Object.defineProperty(this, "message", {
      enumerable: true,
    });
  }
}

export default CustomError;
