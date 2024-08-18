use anchor_lang::prelude::*;

declare_id!("8QYJS7akSyHJEoAg6LZ5oVCMxSGr6Dz9qFciwLz2mQRC");

#[program]
pub mod money_expense {
    use super::*;

    pub fn initialize(ctx: Context<Data>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Data<'info> {
    #[account(init, payer = signer, space = 8 + 8 + 24+24)]
    pub new_account: Account<'info, MyAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct MyAccount {
    data: u64,
    name: String,
    items: Vec<String>,
}
