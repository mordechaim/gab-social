class AddGroupIdToStatuses < ActiveRecord::Migration[5.0]
  def change
    safety_assured { 
        add_reference :statuses, :group, foreign_key: { on_delete: :nullify }
    }
  end
end
