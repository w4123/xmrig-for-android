import "text-encoding-polyfill";
import Joi from "joi"
import { RandomXMode } from "../settings/settings.interface";

export const hostnameValidator = Joi.string().min(3).max(30).required();
export const passwordValidator = Joi.string().min(1).max(25).optional();
export const portValidator = Joi.number().integer().min(10).max(65550).required();

export const poolValidator = Joi.object({
    hostname: hostnameValidator,
    password: passwordValidator,
    port: portValidator
});

export const validateWalletAddress = (addr?:string):boolean => addr != null && /[48][0-9AB][1-9A-HJ-NP-Za-km-z]{93}/.test(addr);

export const yieldValidator = Joi.boolean().required();
export const priorityValidator = Joi.number().min(1).max(5).optional();
export const maxThreadsHintValidator = Joi.number().min(1).max(100).required();
export const randomXModedValidator = Joi.string().valid(RandomXMode.AUTO, RandomXMode.FAST, RandomXMode.LIGHT).required()

export const cpuValidator = Joi.object({
    yield: yieldValidator,
    priority: priorityValidator,
    max_threads_hint: maxThreadsHintValidator,
    random_x_mode: randomXModedValidator
});