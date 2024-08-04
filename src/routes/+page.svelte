<script>
	// @ts-nocheck

	import { onMount } from "svelte";

	import { connection, PublicKey } from "../solana";

	let provider = null;
	let address = "";
	let errorMessage = "";
	let balance = 0;

	let list = [];

	// Function to check if the user is already connected
	async function checkConnection() {
		if ("solana" in window) {
			provider = window.solana;
			if (provider.isPhantom) {
				try {
					// Check if Phantom is already connected
					const connect = await provider.connect({
						onlyIfTrusted: true,
					});

					if (connect.publicKey) {
						address = connect.publicKey.toString();
					}
					console.log("address:", address);
					// connect
					const key = new PublicKey(address);
					console.log("key", key);
					getBalance(key);
				} catch (error) {
					errorMessage = `Failed to connect: ${error.message}`;
				}
			} else {
				errorMessage = "Please install Phantom wallet!";
			}
		} else {
			errorMessage = "Please install Phantom wallet!";
		}
	}

	async function getBalance(key) {
		const balanceLamports = await connection.getBalance(key);
		console.log("balanceLamports", balanceLamports);
		balance = balanceLamports / 1e9;
		console.log("balance", balance);

		// // Call method_one
		// let instruction = new solanaWeb3.TransactionInstruction({
		// 	keys: [],
		// 	programId,
		// 	data: Buffer.from([0]), // Instruction data for method_one (0)
		// });
		// await sendTransaction(instruction);

		// const other = anchor.web3.Keypair.generate();
		// const tx = await program.methods
		// 	.initialize(new anchor.BN(4343234234))
		// 	.accounts({
		// 		newAccount: other.publicKey,
		// 		signer: provider.wallet.publicKey,
		// 	})
		// 	.signers([other])
		// 	.rpc();

		// const acc = await program.account.myAccount.fetch(other.publicKey);
		// console.log(acc.items);
		// expect(acc.items.length).equals(0);
	}

	onMount(async () => {
		await checkConnection();
	});

	async function login() {
		if (provider) {
			try {
				const resp = await provider.connect();
				address = resp.publicKey.toString();
			} catch (error) {
				errorMessage = `Failed to connect: ${error.message}`;
			}
		} else {
			errorMessage = "Provider is not available";
		}
	}

	function logout() {
		if (provider) {
			try {
				provider.disconnect();
				address = "";
				errorMessage = "Logged out successfully.";
			} catch (error) {
				errorMessage = `Failed to logout: ${error.message}`;
			}
		}
	}
	function saveOrder() {
		console.log("save");
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="money expense" />
</svelte:head>

<section>
	{#if address}
		<p>Logged in as: {address}</p>
		<div>
			detail : <input type="text" id="detail" />
			total : <input type="number" id="total" />
			<button onclick={saveOrder}>save</button>
		</div>

		<p />
		<div class="list">list</div>
		<table>
			<thead> <tr><td>list</td><td>total</td></tr></thead>
			<tbody>
				{#each list as item}
					<tr><td></td></tr>
				{/each}
			</tbody>
		</table>

		<!-- <button on:click={logout}>logout</button> -->
	{:else}
		<p>{errorMessage}</p>
		<button on:click={login}>Login</button>
	{/if}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
