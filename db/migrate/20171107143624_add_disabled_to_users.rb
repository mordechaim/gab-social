require Rails.root.join('lib', 'gabsocial', 'migration_helpers')

class AddDisabledToUsers < ActiveRecord::Migration[5.1]
  include GabSocial::MigrationHelpers

  disable_ddl_transaction!

  def up
    safety_assured { add_column_with_default :users, :disabled, :bool, default: false }
  end

  def down
    remove_column :users, :disabled
  end
end
