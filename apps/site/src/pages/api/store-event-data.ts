import { File } from 'web3.storage'
import { NextApiResponse, NextApiRequest } from 'next'
import { makeStorageClient } from '@/lib/web3Storage'

type Data = {
	data: {
		success: boolean
		message: string
		cid: string
	} | null
	error: string | null
}

// create a json file that includes the metadata passed from req.body object
const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	if (req.method === 'POST') {

		// If unsuccessful, return an error
		const body = req.body
		console.log(body)
		// Store the data in web3 storage and return the cid that points to the IPFS directory of the file
		try {
			const client = makeStorageClient()
			let files = []
			const buffer = Buffer.from(JSON.stringify(body))
			const metadataFile = new File([buffer], 'data.json', {
				type: 'application/json',
			})

			files.push(metadataFile)

			const rootCid = await client.put(files, {
				wrapWithDirectory: false,
				maxRetries: 3,
			})

			console.log(`https://${rootCid}.ipfs.w3s.link`)

			return res.status(200).json({
				data: {
					success: true,
					message: `Uploaded to web3Storage: https://${rootCid}.ipfs.w3s.link`,
					cid: rootCid
				},
				error: null
			})

		} catch (error) {
			console.log(error)
			return res.status(500).json({ data: null, error: 'Error creating event' })
		}
	}
	return res.status(405).json({ data: null, error: 'Method not allowed' })
}

export default handler