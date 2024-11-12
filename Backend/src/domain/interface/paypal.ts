export interface PaymentService {
    createOrder(amount: string): Promise<string>;
    captureOrder(orderID: string): Promise<any>;
  }
  