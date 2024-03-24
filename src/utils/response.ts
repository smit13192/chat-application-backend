export interface ISuccess<T = any> {
    statusCode: number;
    message?: string;
    data?: T;
    token?: string;
}

export class SuccessResponse<T = any> {
    success: boolean;
    statusCode: number;
    message?: string;
    data?: T;
    token?: string;

    constructor(data: ISuccess) {
        this.statusCode = data.statusCode;
        this.success = true;
        this.message = data.message;
        this.data = data.data;
        this.token = data.token;
    }
}

export interface IError<T = any> {
    statusCode: number;
    message?: string;
    data?: T;
}

export class ErrorResponse<T = any> {
    success: boolean;
    statusCode: number;
    message?: string;
    data?: T;

    constructor(data: IError) {
        this.statusCode = data.statusCode;
        this.success = false;
        this.message = data.message;
        this.data = data.data;
    }
}