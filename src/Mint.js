import axios from "axios";
import { Contracts, RuntimeArgs, CLValueBuilder, CLPublicKey, DeployUtil, Signer } from "casper-js-sdk";

function Mint(props) {
	return (
		<div>
			<input id="mintInput" type="text" placeholder="Metadata" />
			<button onClick={() => mint(props.publicKey)}>Mint</button>
		</div>
	);
}

async function mint(publicKey) {
	if (publicKey == null) {
		alert("No public key found, please connect to the signer");
		return;
	}
	const contract = new Contracts.Contract();
	contract.setContractHash(
		"hash-e50776667c873905817a6305ef7edc99be87c5b1451bad510917927c66b5ab5e"
	);

	const args = RuntimeArgs.fromMap({
		token_owner: CLValueBuilder.key(CLPublicKey.fromHex(publicKey)),
		token_meta_data: CLValueBuilder.string(document.getElementById("mintInput").value),
	});

	const deploy = contract.callEntrypoint(
		"mint",
		args,
		CLPublicKey.fromHex(publicKey),
		"casper-test",
		"40000000000" // 40 CSPR
	);

	const jsonDeploy = DeployUtil.deployToJson(deploy);
	try {
		const signedDeploy = await Signer.sign(jsonDeploy, publicKey);
		const response = await axios.post(
			"http://localhost:3001/deploy",
			signedDeploy,
			{ headers: { "Content-Type": "application/json" } }
		);
		alert(response.data);
	} catch (error) {
		alert(error.message);
	}
}

export default Mint;
