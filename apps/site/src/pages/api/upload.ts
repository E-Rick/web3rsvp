import formidable, { IncomingForm } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { getFilesFromPath, Web3Storage, type CIDString } from "web3.storage";

export const FormidableError = formidable.errors.FormidableError;

type Data = {
  data: {
    success: boolean,
    cid: CIDString | null,
    message?: string,
    imageUrl?: string
  } | null;
  error: string | null;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // Check if the request is a POST request
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({
      data: null,
      error: "Method Not Allowed",
    });
    console.error("Method not allowed");
    return;
  }

  const client = new Web3Storage({
    token: process.env.WEB3STORAGE_TOKEN as string,
  })

  try {
    // parse form with a Promise wrapper
    const data: { fields: formidable.Fields; files: formidable.Files } =
      await new Promise((resolve, reject) => {
        const form = new IncomingForm()
        form.parse(req, (err, fields, files) => {
          if (err) {
            console.log(err)
            return reject(err)
          }
          resolve({ fields, files })
        })
      })

    const files = await getFilesFromPath(
      (data?.files?.media as { filepath: string })?.filepath
    )

    const cid = await client.put(files, {
      wrapWithDirectory: false,
      maxRetries: 3,
    })

    res.status(200).json(
      {
        data: {
          success: true,
          cid: cid,
          message: 'Uploaded to Web3.Storage!',
          imageUrl: `https://${cid}.ipfs.w3s.link`
        },
        error: null
      })
  } catch (e) {

    if (e instanceof FormidableError) {
      res.status(e.httpCode || 400).json({ data: null, error: e.message });
    } else {
      console.error(e);
      res.status(500).json({ data: null, error: "Internal Server Error", });
    }
  }

}
