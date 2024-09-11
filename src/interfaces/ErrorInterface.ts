export default interface ErrorInterface {
    statusCode: number;
    status: string;
    message: string;
    stack?: string;
}