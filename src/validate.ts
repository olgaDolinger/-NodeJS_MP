import Joi from "joi";

export enum STATUS{
    OK = 200,
    CONNECTION_REJECTED = 500,
    VALIDATON_ERROR = 400,
}

const MIN_AGE: number = 4;
const MAX_AGE: number = 130;


// Validation schema for User
export const userSchema: Joi.ObjectSchema<User> = Joi.object().keys({
    id: Joi.string().required(),
    login: Joi.string().required(),
    password: Joi.string().regex(/^[\w.-]+$/).required(),
    age: Joi.number().greater(MIN_AGE).less(MAX_AGE).required(),
    isDeleted: Joi.boolean().required(),
})