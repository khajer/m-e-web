import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MoneyExpense } from "../target/types/money_expense";

const provider = anchor.AnchorProvider.local();

describe("money_expense", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const myAccount = anchor.web3.Keypair.generate();
  const accAddData = anchor.web3.Keypair.generate();

  const program = anchor.workspace.MoneyExpense as Program<MoneyExpense>;

  it("Is initialized!", async () => {

    const tx = await program.methods.initialize("kha").accounts({
      newAccount: myAccount.publicKey,
      signer: provider.wallet.publicKey
    }).signers([myAccount]).rpc();
    console.log("Your transaction signature", tx);
  });
  it("test add expense data", async () => {

    const tx = await program.methods.add("dinner", 2300).accounts({
      newAccount: accAddData.publicKey,
      signer: provider.wallet.publicKey
    }).signers([accAddData]).rpc();

    console.log("Your transaction signature", tx);
  });
  it("check expense data after add ", async () => {
    const myAcc = await program.account.myAccount.fetch(accAddData.publicKey);
    console.log((myAcc));
  });
});
