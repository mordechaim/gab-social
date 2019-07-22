class AddMemberCountToGroups < ActiveRecord::Migration[5.2]
  def up
    add_column :groups, :member_count, :integer
    change_column_default :groups, :member_count, 0
  end

  def down
    remove_column :groups, :member_count
  end
end
