<script>
	// @ts-nocheck

	import { onMount } from "svelte";
	import idl from "../../program/target/idl/money_expense.json";
	import * as anchor from "@project-serum/anchor";
	import {
		connection,
		PublicKey,
		callMethod,
		getBalance,
	} from "../solana.ts";
	import { AnchorError } from "@project-serum/anchor";

	let provider = null;
	let address = "";
	let errorMessage = "";
	let balance = 0;

	let list = [];
	let programID = "";

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
					const key = new PublicKey(address);
					console.log("key", key);
					balance = await getBalance(key);
					console.log("balance", balance);

					let anchorProvide = anchor.AnchorProvider(
						conn,
						window.solana,
						{},
					);
					anchor.setProvider(anchorProvide);
					let program = new anchor(idl, programID, anchorProvide);
					// like a test
					const tx = await program.methods.initialize().rpc();
					console.log(tx);
					// callMethod(address, PROGRAM_ID, methodData);
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
