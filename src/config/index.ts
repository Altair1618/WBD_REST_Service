import dotenv from 'dotenv';

dotenv.config();

export const ITEMS_PER_PAGE = 10;

export const JWT_KEY = process.env.JWT_PRIVATE_KEY || 'secret';
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '1h';
export const SOAP_API_KEY = process.env.SOAP_SERVICE_API_KEY;

export const PHP_URL = process.env.PHP_APP || 'http://wbd-php-app:80';
export const SOAP_URL = process.env.SOAP_SERVICE || 'http://wbd-soap-service:9000'
