import axios from "axios";
import { Contracts, RuntimeArgs, CLValueBuilder, CLPublicKey, DeployUtil, Signer } from "casper-js-sdk";

function Register(props) {
	return (
		<div>
			<button onClick={() => register(props.publicKey)}>Register</button>
		</div>
	);
}

async function register(publicKey) {
	if (publicKey == null) {
		alert("No public key found, please connect to the signer");
		return;
	}
	const contract = new Contracts.Contract();
	contract.setContractHash("hash-0352d232a811c0d4c30f2395b19ffd13dd27549601bbcb31add9a19c8100f4e4");

	const args = RuntimeArgs.fromMap({
		token_owner: CLValueBuilder.key(CLPublicKey.fromHex(publicKey)),
	});

	const deploy = contract.callEntrypoint(
		"register_owner",
		args,
		CLPublicKey.fromHex(publicKey),
		"casper-test",
		"5000000000" // 5 CSPR
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

export default Register;