use anchor_lang::prelude::*;

declare_id!("8QYJS7akSyHJEoAg6LZ5oVCMxSGr6Dz9qFciwLz2mQRC");

#[program]
pub mod money_expense {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
