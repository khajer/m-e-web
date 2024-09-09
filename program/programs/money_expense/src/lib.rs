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

    pub fn add(ctx: Context<DataItem>, order_name: String, price: u32) -> Result<()> {
        let acc = &mut ctx.accounts.acc;
        let ex = Expense { order_name, price };
        acc.orders.push(ex);

        Ok(())
    }
    pub fn add_name(ctx: Context<Dataname>, name: String) -> Result<()> {
        let acc = &mut ctx.accounts.other_acc;
        let ex = Expense {
            order_name: name,
            price: 0,
        };
        acc.orders.push(ex);

        Ok(())
    }

    pub fn create_user_stats(ctx: Context<CreateUserStats>, name: String) -> Result<()> {
        let user_stats = &mut ctx.accounts.user_stats;
        user_stats.level = 0;
        if name.as_bytes().len() > 200 {
            // proper error handling omitted for brevity
            panic!();
        }
        user_stats.name = name;
        user_stats.bump = ctx.bumps.user_stats;
        Ok(())
    }

    pub fn change_user_name(
        ctx: Context<ChangeUserName>,
        new_name: String,
        lvl: u16,
    ) -> Result<()> {
        if new_name.as_bytes().len() > 200 {
            // proper error handling omitted for brevity
            panic!();
        }
        ctx.accounts.user_stats.name = new_name;
        ctx.accounts.user_stats.level = lvl;
        Ok(())
    }
}

#[account]
pub struct UserStats {
    level: u16,
    name: String,
    bump: u8,
}
#[derive(Accounts)]
pub struct CreateUserStats<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    // space: 8 discriminator + 2 level + 4 name length + 200 name + 1 bump
    #[account(
        init,
        payer = user,
        space = 8 + 2 + 4 + 200 + 1, seeds = [b"user-stats", user.key().as_ref()], bump
    )]
    pub user_stats: Account<'info, UserStats>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ChangeUserName<'info> {
    pub user: Signer<'info>,
    #[account(mut, seeds = [b"user-stats", user.key().as_ref()], bump = user_stats.bump)]
    pub user_stats: Account<'info, UserStats>,
}

#[derive(Accounts)]
pub struct Data<'info> {
    #[account(init, payer = signer, space = 8 + 56)] // payer = 8, new_account = 56
    pub new_account: Account<'info, MyAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DataItem<'info> {
    #[account(mut)]
    pub acc: Account<'info, MyAccount>,
}

#[derive(Accounts)]
pub struct Dataname<'info> {
    #[account(mut)]
    pub other_acc: Account<'info, MyAccount>,
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
