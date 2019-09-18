class CreateStatusRevisions < ActiveRecord::Migration[5.2]
  def change
    create_table :status_revisions do |t|
      t.bigint :status_id
      t.string :text
      t.timestamps
    end
  end
end
