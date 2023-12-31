import { Request, Response } from "express";
import { SOAPClient, SOAPServices } from "../utils/soap";
import { PHP_URL } from "../config";

export class SubscriptionController {
  public async getPendingSubscriptions(req: Request, res: Response): Promise<void> {
    const client = new SOAPClient();
    await client.fetch(SOAPServices.GET_ALL_SUBSCRIPTION_REQUESTS);
    const response = client.getResponse()['return'];

    if (response['status'] === 'success') {

      response['data']['list'] = response['data']['list'] || [];

      if (!Array.isArray(response['data']['list'])) {
        response['data']['list'] = [response['data']['list']];
      }

      // console.log(response['data']['list']);

      for (let user of response['data']['list']) {
        const response = await fetch(`${PHP_URL}/api/user?id=${user['userId']}`);
        const data = await response.json();
        user['username'] = data['data']['username'];
      }


      res.status(200).json({
        status: 'success',
        message: 'Berhasil mendapatkan data permintaan langganan',
        data: response['data']
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: response['message'],
        data: null
      });
    }
  }

  public async acceptSubscription(req: Request, res: Response): Promise<void> {
    const client = new SOAPClient();
    await client.fetch(SOAPServices.ACCEPT_SUBSCRIPTION_REQUEST, {
      id: req.params.id
    });
    const response = client.getResponse()['return'];

    if (response['status'] === 'success') {
      res.status(200).json({
        status: 'success',
        message: 'Berhasil menerima permintaan langganan',
        data: null
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: response['message'],
        data: null
      });
    }
  }

  public async rejectSubscription(req: Request, res: Response): Promise<void> {
    const client = new SOAPClient();
    await client.fetch(SOAPServices.REJECT_SUBSCRIPTION_REQUEST, {
      id: req.params.id
    });
    const response = client.getResponse()['return'];

    if (response['status'] === 'success') {
      res.status(200).json({
        status: 'success',
        message: 'Berhasil menolak permintaan langganan',
        data: null
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: response['message'],
        data: null
      });
    }
  }
}
