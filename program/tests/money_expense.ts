import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MoneyExpense } from "../target/types/money_expense";
import { expect } from "chai";
import { PublicKey } from '@solana/web3.js'

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
    const acc1 = anchor.web3.Keypair.generate();
    await program.methods.initialize("kha").accounts({
      newAccount: acc1.publicKey,
      signer: provider.wallet.publicKey
    }).signers([acc1]).rpc();
  });

  it("should found success & one record when I create user stats", async () => {

    let tx = await program.methods
      .createUserStats('brian')
      .accounts({
        user: provider.wallet.publicKey,
      })
      .rpc();
    const [userStatsPDA, _] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode('user-stats'),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    )

    console.log(userStatsPDA);
    const acc = await program.account.userStats.fetch(userStatsPDA);
    expect(acc.name).equal('brian');


  });
  it("should found success when I try to check again", async () => {

    const [userStatsPDA, _] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode('user-stats'),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    )
    const acc1 = anchor.web3.Keypair.generate();
    const acc = await program.account.userStats.fetch(userStatsPDA);
    console.log(">>", acc);
    expect(acc.name).equal('brian');
  });

  it("should found change name when I change name to 'itsara' ", async () => {

    let tx = await program.methods
      .changeUserName('itsara', 16)
      .accounts({
        user: provider.wallet.publicKey,
      })
      .rpc();


    const [userStatsPDA, _] = PublicKey.findProgramAddressSync(
      [
        anchor.utils.bytes.utf8.encode('user-stats'),
        provider.wallet.publicKey.toBuffer(),
      ],
      program.programId
    )
    const acc1 = anchor.web3.Keypair.generate();
    const acc = await program.account.userStats.fetch(userStatsPDA);
    console.log(">>", acc);
    expect(acc.name).equal('itsara');
    expect(acc.level).equal(16);
  });


  it("should found all publickey then i get from program", async () => {

    let allAcount = await provider.connection.getProgramAccounts(program.programId);
    console.log(allAcount.length);
    expect(allAcount.length).equal(4);
    allAcount.forEach(acc => {
      console.log(acc.pubkey);
    })
  });

});