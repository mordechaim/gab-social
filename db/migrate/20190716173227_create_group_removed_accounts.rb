class CreateGroupRemovedAccounts < ActiveRecord::Migration[5.2]
  def change
    create_table :group_removed_accounts do |t|
      t.belongs_to :group, foreign_key: { on_delete: :cascade }, null: false
      t.belongs_to :account, foreign_key: { on_delete: :cascade }, null: false
      t.timestamps
    end

    add_index :group_removed_accounts, [:account_id, :group_id], unique: true
    add_index :group_removed_accounts, [:group_id, :account_id]
  end
end
