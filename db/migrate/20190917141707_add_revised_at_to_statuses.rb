class AddRevisedAtToStatuses < ActiveRecord::Migration[5.2]
  def change
    add_column :statuses, :revised_at, :datetime
  end
end
