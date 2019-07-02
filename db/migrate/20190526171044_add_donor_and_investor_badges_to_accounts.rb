class AddDonorAndInvestorBadgesToAccounts < ActiveRecord::Migration[5.2]
  def up
    safety_assured { 
      add_column :accounts, :is_donor, :bool, default: false, null: false 
      add_column :accounts, :is_investor, :bool, default: false, null: false 
    }
  end

  def down
    remove_column :accounts, :is_donor
    remove_column :accounts, :is_investor
  end
end
