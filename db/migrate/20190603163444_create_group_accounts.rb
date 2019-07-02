class CreateGroupAccounts < ActiveRecord::Migration[5.2]
  def change
    create_table :group_accounts do |t|
      t.belongs_to :group, foreign_key: { on_delete: :cascade }, null: false
      t.belongs_to :account, foreign_key: { on_delete: :cascade }, null: false
      t.boolean :write_permissions, default: false, null: false
      t.string :role, null: true
      t.timestamps
    end

    add_index :group_accounts, [:account_id, :group_id], unique: true
    add_index :group_accounts, [:group_id, :account_id]
  end
end
