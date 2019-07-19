class AddUnreadCountToGroupAccounts < ActiveRecord::Migration[5.2]
  def change
    add_column :group_accounts, :unread_count, :integer, default: 0
  end
end
