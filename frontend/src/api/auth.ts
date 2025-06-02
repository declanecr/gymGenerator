/*
This file holds my API logic for logging in and registering users
*/

import api from "./axios"
//Define the shape of the expected input
interface LoginInput {
    email: string
    password: string
}

// Define the shape of the expected response
interface LoginResponse {
    accessToken: string
}

//Make the request to your NestJS backend
export async function loginUser (data: LoginInput): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', data)
    return response.data
}