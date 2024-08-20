import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MoneyExpense } from "../target/types/money_expense";

const provider = anchor.AnchorProvider.local();

describe("money_expense", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const myAccount = anchor.web3.Keypair.generate();
  // const accAddData = anchor.web3.Keypair.generate();

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
      acc: myAccount.publicKey,
    }).rpc();

    console.log("Your transaction signature", tx);
    const myAcc = await program.account.myAccount.fetch(myAccount.publicKey);
    console.log((myAcc));
  });
  it("add another expense data", async () => {

    const tx = await program.methods.add("party", 10300).accounts({
      acc: myAccount.publicKey,
    }).rpc();
    console.log("Your transaction signature", tx);

    const myAcc = await program.account.myAccount.fetch(myAccount.publicKey);
    console.log((myAcc));
  });
});
