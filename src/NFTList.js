import axios from "axios";

function NFTList(props) {
	return (
		<div>
			<button onClick={() => getOwnedNFTs(props.publicKey)}>
				Get NFTs Owned
			</button>
		</div>
	);
}

function getOwnedNFTs(publicKey) {
	if (publicKey == null) {
		alert("No public key found, please connect to the Signer")
		return
	}
	axios.get("http://localhost:3001/ownedNFTs?publicKey=" + publicKey)
		.then(response => {
			alert(response.data);
		})
		.catch(error => {
			alert(error.message);
		});
}

export default NFTList;
