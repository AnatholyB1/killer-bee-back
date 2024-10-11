class Response {
    constructor(statusCode, httpStatus, message, data){
      this.timeStamp = new Date().toLocaleString();
      this.statusCode = statusCode;
      this.httpStatus = httpStatus;
      this.message = message;
      this.data = data;
      this.total = data?.length;
    }
  }
  
  export default Response;