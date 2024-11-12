import paypal from '@paypal/checkout-server-sdk';
import { PaymentService } from '../../domain/interface/paypal'; 
import client from './paypalConfig';

export class PayPalService implements PaymentService {
    async createOrder(amount: string): Promise<string> {
        const request = new paypal.orders.OrdersCreateRequest();
        request.requestBody({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD', 
                value: amount,
              },
            },
          ],
        });
        const order = await client.execute(request);
        return order.result.id;
      }
    
      async captureOrder(orderID: string): Promise<any> {
        const request = new paypal.orders.OrdersCaptureRequest(orderID);
        const capture = await client.execute(request);
        return capture.result;
      }
}
