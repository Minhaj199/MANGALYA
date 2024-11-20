import { PaymentService } from "../domain/interface/paypal"; 

export class ProcessPayment {
  constructor(private paymentService: PaymentService) {}

  async execute(amount: string) {
    const orderId = await this.paymentService.createOrder(amount);
    return orderId;
  }
}