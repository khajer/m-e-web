use anchor_lang::prelude::*;

declare_id!("GLTLDPkRb1ycFexozV1KbAR8hFPxUQ4K2rRWhC4AuweF");

#[program]
pub mod xxx {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
