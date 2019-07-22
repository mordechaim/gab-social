class BackfillAddMemberCountToGroups < ActiveRecord::Migration[5.2]
  disable_ddl_transaction!

  def change
    Group.in_batches do |relation|
      relation.update_all member_count: 0
      sleep(0.1)
    end
  end
end
