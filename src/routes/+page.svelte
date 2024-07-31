<script>
	// @ts-nocheck

	import { onMount } from "svelte";
	import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

	let provider = null;
	let address = "";
	let errorMessage = "";

	// Function to check if the user is already connected
	async function checkConnection() {
		if ("solana" in window) {
			provider = window.solana;
			if (provider.isPhantom) {
				try {
					// Check if Phantom is already connected
					const resp = await provider.connect({
						onlyIfTrusted: true,
					});
					if (resp.publicKey) {
						address = resp.publicKey.toString();
					}
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
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="money expense" />
</svelte:head>

<section>
	{#if address}
		<p>Logged in as: {address}</p>
		<button on:click={logout}>logout</button>
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
