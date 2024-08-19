use anchor_lang::prelude::*;

declare_id!("8QYJS7akSyHJEoAg6LZ5oVCMxSGr6Dz9qFciwLz2mQRC");

#[program]
pub mod money_expense {
    use super::*;

    pub fn initialize(ctx: Context<Data>, name: String) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        ctx.accounts.new_account.name = name;
        Ok(())
    }

    pub fn add(ctx: Context<Data>, order_name: String, price: u32) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        let ex = Expense { order_name, price };
        ctx.accounts.new_account.orders.push(ex);
        ctx.accounts.new_account.name = "guest1".to_string();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Data<'info> {
    #[account(init, payer = signer, space = 8 + 56)] // payer = 8, new_account = 56
    pub new_account: Account<'info, MyAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct MyAccount {
    name: String,
    orders: Vec<Expense>,
}

#[account]
pub struct Expense {
    order_name: String,
    price: u32,
}
