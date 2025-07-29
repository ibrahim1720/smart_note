export class ErrorClass {
    constructor(status, data, location) {
        this.data = data;
        this.status = status;
        this.location = location;
    }
}
