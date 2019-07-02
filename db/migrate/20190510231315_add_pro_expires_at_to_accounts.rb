class AddProExpiresAtToAccounts < ActiveRecord::Migration[5.2]
  def change
  	add_column :accounts, :pro_expires_at, :datetime
  end
end
