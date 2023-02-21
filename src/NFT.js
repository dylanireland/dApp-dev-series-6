import React from "react";
import axios from "axios";
import { Placeholder } from "react-bootstrap";

function Metadata(props) {
	return (
		<div>
			<input type="text" placeholder="Token ID" />
			<button onClick={() => getMetadata()}>Get Metadata</button>
		</div>
	);

	function getMetadata() {
		axios
			.get(
				"http://localhost:3001/metadata?tokenId=" +
					document.querySelector("input[type=text]").value
			)
			.then(response => {
				alert(response.data);
			})
			.catch(error => {
				alert(error.message);
			});
	}
}

export default Metadata;
