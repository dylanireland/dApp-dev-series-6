const express = require("express");
const app = express();
const cors = require("cors");
const port = 3001;
const {
	CasperClient,
	Contracts,
	CLPublicKey,
	DeployUtil,
} = require("casper-js-sdk");

app.use(express.json());
app.use(cors());

const client = new CasperClient("http://188.40.47.161:7777/rpc");
const contract = new Contracts.Contract(client);
contract.setContractHash("hash-0352d232a811c0d4c30f2395b19ffd13dd27549601bbcb31add9a19c8100f4e4");

app.get("/metadata", async (req, res) => {
	try {
		const result = (
			await contract.queryContractDictionary(
				"metadata_raw",
				req.query.tokenId
			)
		).data

		res.send(result);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

app.get("/ownedNFTs", async (req, res) => {
	const accountHash = CLPublicKey.fromHex(req.query.publicKey).toAccountHashStr().substring(13);
	var owned = [];
	try {
		const pages = (await contract.queryContractDictionary("page_table", accountHash)).data; // Get list of pages
		for (var i = 0; i < pages.length; i++) { // Iterate pages containing NFTs
			if (pages[i].data == true) { // Account has NFTs in this page
				const page = (await contract.queryContractDictionary("page_" + i.toString(), accountHash)).data;
				for (var j = 0; j < page.length; j++) {
					if (page[j].data == true) { // Account owns this NFT
						owned.push(i * page.length + j) // Page Table Index * Page Size + Page Index = Ordinal Token ID
					}
				}
			}
		}
		res.send(owned);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

app.post("/deploy", async (req, res) => {
	try {
		const deploy = DeployUtil.deployFromJson(req.body).unwrap();
		const deployHash = await client.putDeploy(deploy);
		res.send(deployHash);
	} catch (error) {
		res.status(400).send(error.message);
	}
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
