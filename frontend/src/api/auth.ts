/*
This file holds my API logic for logging in and registering users
*/
import api from "./axios"


//*********LOGIN****************/
//Define the shape of the expected input
interface LoginInput {
    email: string
    password: string
}

// Define the shape of the expected response
interface LoginResponse {
    accessToken: string
}

// Make the request to your NestJS backend
export async function loginUser (data: LoginInput): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data)
    return response.data
}

/******REGISTER USER************ */
// Define the shape of the expected input
interface RegisterInput {
    email: string
    password: string
    name?: string
}

// Define the shape of expected response
interface RegisterResponse {
    accessToken: string
}

// Make the request 
export async function registerUser (data: RegisterInput): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', data)
    return response.data
}