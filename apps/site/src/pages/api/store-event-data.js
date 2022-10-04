import { Web3Storage, File } from "web3.storage";

// create a json file that includes the metadata passed from req.body object
async function storeEventData(req , res) {
  // If unsuccessful, return an error
  const body = req.body
  // Store the data in web3 storage and return the cid that points to the IPFS directory of the file
  try {
    const files = await makeFilesObjects(body)
    const cid = await storeFiles(files)
    return res.status(200).json({ success: true, cid: cid })
  } catch (error) {
    return res.status(500).json({ error: "Error creating event", success: false })
  }

}

/**
 * 
 * @param body Create a buffer from the stringified body
 * 
 */
async function makeFilesObjects(body) {
  const buffer = Buffer.from(JSON.stringify(body));

  // searc 
  const imageDirectory = resolve(process.cwd(), `public/images/${body.image}`);
  const files = await getFilesFromPath(imageDirectory);
  files.push(new File([buffer], "data.json"));
  return files;
}

function makeStorageClient() {
  return new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN });
}

async function storeFiles(files) {
  const client = makeStorageClient();
  const cid = await client.put(files);
  return cid;
}

// create a json file that includes the metadata passed from req.body object
const handler = async (req , res) => {
  if (req.method === "POST") {
    // If unsuccessful, return an error
    const body = req.body
    console.log(body)
    // Store the data in web3 storage and return the cid that points to the IPFS directory of the file
    try {
      const buffer = Buffer.from(JSON.stringify(body));
      // const imageDirectory = resolve(process.cwd(), `public/images/${body.image}`);
      // const files = await getFilesFromPath(imageDirectory);
      const metadataFile = new File([buffer], "data.json", { type: "application/json" });
      const files = [body.image]
      console.log('files:', files)
      files.push(metadataFile);
      const cid = await client.put(files);
      return res.status(200).json({ success: true, cid: cid })
    } catch (error) {
      return res.status(500).json({ error: "Error creating event", success: false })
    }
  }
  return res.status(405).json({ error: "Method not allowed" });
}

export default handler