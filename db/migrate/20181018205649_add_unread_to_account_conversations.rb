require Rails.root.join('lib', 'gabsocial', 'migration_helpers')

class AddUnreadToAccountConversations < ActiveRecord::Migration[5.2]
  include GabSocial::MigrationHelpers

  disable_ddl_transaction!

  def up
    safety_assured do
      add_column_with_default(
        :account_conversations,
        :unread,
        :boolean,
        allow_null: false,
        default: false
      )
    end
  end

  def down
    remove_column :account_conversations, :unread, :boolean
  end
end
