require Rails.root.join('lib', 'gabsocial', 'migration_helpers')

class AddAutofollowToInvites < ActiveRecord::Migration[5.2]
  include GabSocial::MigrationHelpers

  disable_ddl_transaction!

  def change
    safety_assured do
      add_column_with_default :invites, :autofollow, :bool, default: false, allow_null: false
    end
  end

  def down
    remove_column :invites, :autofollow
  end
end
