import axios from "axios";

function Metadata(props) {
	return (
		<div>
			<input id="metadataInput" type="text" placeholder="Token ID" />
			<button onClick={() => getMetadata()}>Get Metadata</button>
		</div>
	);
}

function getMetadata() {
	axios
		.get(
"http://localhost:3001/metadata?tokenId=" +
				document.getElementById("metadataInput").value
			)
			.then(response => {
				alert(response.data);
			})
			.catch(error => {
				alert(error.message);
			});
}

export default Metadata;
