import { SOAP_API_KEY, SOAP_URL } from "../config";

const soap = require('strong-soap').soap;

export enum SOAPServices {
    GET_ALL_LOGGINGS = 'logging@getAllLoggings',
    CREATE_SUBSCRIPTION_REQUEST = 'subscription@createSubscriptionRequest',
    GET_ALL_SUBSCRIPTION_REQUESTS = 'subscription@getAllSubscriptionRequests',
    GET_USER_SUBSCRIPTION_STATUS = 'subscription@getUserSubscriptionStatus',
    ACCEPT_SUBSCRIPTION_REQUEST = 'subscription@acceptSubscriptionRequest',
    REJECT_SUBSCRIPTION_REQUEST = 'subscription@rejectSubscriptionRequest',
}

export class SOAPClient {
    private response: any;

    constructor() {
        this.response = null;
    }

    public getResponse = () => {
        return this.response;
    }

    public fetch = async (service: SOAPServices, args: any = {}) => {
        const [serviceClass, method] = service.split('@');
        const url = `${SOAP_URL}/${serviceClass}?wsdl`;

        this.response = await new Promise(async (resolve, reject) => {
            await soap.createClient(url, async (err: any, client: any) => {
                if (err) {
                    console.log(err);
                    return;
                }

                await client[method](args, function(err: any, result: any, envelope: any) {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    resolve(result);
                }, null, { 'api-key': SOAP_API_KEY });
            });
        });

        console.log(this.response);
        return;
    }
}
