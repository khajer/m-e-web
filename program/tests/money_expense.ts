import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MoneyExpense } from "../target/types/money_expense";
import { expect } from "chai";

const provider = anchor.AnchorProvider.local();

describe("money_expense", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const myAccount = anchor.web3.Keypair.generate();

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
  it("should found data when I add name to data vector", async () => {

    const tx = await program.methods.addName("testman6").accounts({
      otherAcc: myAccount.publicKey,
    }).rpc();
    console.log("Your transaction signature", tx);

    const myAcc = await program.account.myAccount.fetch(myAccount.publicKey);
    console.log((myAcc));
  });

  it("should error when programs doesn't call initize", async () => {
    const newAcc1 = anchor.web3.Keypair.generate();

    try {
      const tx = await program.methods.addName("testman7").accounts({
        otherAcc: newAcc1.publicKey,
      }).rpc();
    } catch (e) {
      expect(e.error.errorCode.number).equal(3012);
    }

  });

  it("should not found data when I change myAccount", async () => {
    const newAcc = anchor.web3.Keypair.generate();
    // must be initial
    await program.methods.initialize("kha1").accounts({
      newAccount: newAcc.publicKey,
      signer: provider.wallet.publicKey
    }).signers([newAcc]).rpc();

    const tx = await program.methods.addName("testman7").accounts({
      otherAcc: newAcc.publicKey,
    }).rpc();
    console.log("Your transaction signature", tx);

    const acc = await program.account.myAccount.fetch(newAcc.publicKey);
    console.log((acc));
  });

  it("should found data global state when I setup global state", async () => {

  });

  it.skip("should found data when I add 2 account to one group t", async () => {
    const acc1 = anchor.web3.Keypair.generate();
    // const acc2 = anchor.web3.Keypair.generate();
    const group = [acc1];
    await program.methods.initialize("kha1").accounts({
      newAccount: acc1.publicKey,
      signer: provider.wallet.publicKey
    }).signers(group).rpc();

    const tx = await program.methods.addName("testman7").accounts({
      otherAcc: acc1.publicKey,
    }).rpc();
    console.log("Your transaction signature", tx);

    const acc = await program.account.myAccount.fetch(acc1.publicKey);
    console.log((acc));
  });
});
