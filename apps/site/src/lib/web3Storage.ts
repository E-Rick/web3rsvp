import { Web3Storage } from "web3.storage";

export function makeStorageClient() {
  return new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN as string })
}

export async function storeFiles(files) {
  try {
    const client = makeStorageClient()
    const cid = await client.put(files)
    return cid
  }
  catch (e) {
    console.error(e)
  }
}