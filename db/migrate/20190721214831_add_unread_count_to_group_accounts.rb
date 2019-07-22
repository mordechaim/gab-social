class AddUnreadCountToGroupAccounts < ActiveRecord::Migration[5.2]
  def up
    add_column :group_accounts, :unread_count, :integer
    change_column_default :group_accounts, :unread_count, 0
  end

  def down
    remove_column :group_accounts, :unread_count
  end
end
