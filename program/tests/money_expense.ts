import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MoneyExpense } from "../target/types/money_expense";

const provider = anchor.AnchorProvider.local();

describe("money_expense", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const myAccount = anchor.web3.Keypair.generate();

  const program = anchor.workspace.MoneyExpense as Program<MoneyExpense>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().accounts({
      newAccount: myAccount.publicKey,
      signer: provider.wallet.publicKey
    }).signers([myAccount]).rpc();
    console.log("Your transaction signature", tx);
  });
});
