<script>
	import { onMount } from "svelte";
	// @ts-ignore
	import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
	// @ts-ignore
	let provider = null;
	let address = "";
	let errorMessage = "";

	onMount(async () => {
		// Check if Phantom wallet extension is installed
		if ("solana" in window) {
			provider = window.solana;
			// @ts-ignore
			if (provider.isPhantom) {
				try {
					// Connect to the wallet
					// @ts-ignore
					const resp = await provider.connect();
					address = resp.publicKey.toString();
				} catch (error) {
					// @ts-ignore
					errorMessage = `Failed to connect: ${error.message}`;
				}
			} else {
				errorMessage = "Please install Phantom wallet!";
			}
		} else {
			errorMessage = "Please install Phantom wallet!";
		}
	});

	function login() {
		// @ts-ignore
		if (provider && address) {
			// Logic to handle the login state
			console.log("User address:", address);
		} else {
			console.error("Provider or address is not available");
		}
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="money expense" />
</svelte:head>

<section>
	{#if address}
		<p>Logged in as: {address}</p>
		<button on:click={login}>Check Login</button>
	{:else}
		<p>{errorMessage}</p>
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

	h1 {
		width: 100%;
	}
</style>
