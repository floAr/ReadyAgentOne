import { GraphQLClient, gql } from 'graphql-request';
import { getAccountOutflowQuery } from './queries';
import { BASE_GRAPH_ENDPOINT, BASE_SEPOLIA_GRAPH_ENDPOINT } from './endpoints';
import { SuperfluidAccountResponse } from './types'

const client = new GraphQLClient(BASE_SEPOLIA_GRAPH_ENDPOINT);

export async function getAccountOutflow(userId: string): Promise<SuperfluidAccountResponse | undefined> {
    try {
        const variables = { id: userId.toLowerCase() };
        console.log('got id: ' + userId)
        const data = await client.request<SuperfluidAccountResponse>(getAccountOutflowQuery, variables);
        console.log('got data: ')
        console.log(data)
        return data;
    } catch (error) {
        console.error('Error fetching account data:', error);
        return undefined;
    }
}