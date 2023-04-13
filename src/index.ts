import { Client } from './driver/postgres'

export default {
  async fetch(request: Request, env, ctx: ExecutionContext) {
    try {
      const client = new Client({
        user: 'public_readonly',
        password: 'nearprotocol',
        database: 'mainnet_explorer',
        hostname: 'mainnet.db.explorer.indexer.near.dev',
        port: '5432',
      })
      console.log('connect')
      await client.connect()
      console.log('connected')

      const result = await client.queryObject<string>`
        select receipt_receiver_account_id as account_id from public.action_receipt_actions
        where receipt_predecessor_account_id = 'marior.near'
        and args::json->>'method_name' = 'storage_deposit'
        offset 10
        limit 10;
      `

      return new Response(JSON.stringify(result))
    } catch (e) {
      return new Response((e as Error).message)
    }
  },
}
