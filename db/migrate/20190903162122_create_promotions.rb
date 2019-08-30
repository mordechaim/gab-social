class CreatePromotions < ActiveRecord::Migration[5.2]
  def change
    create_table :promotions do |t|
      t.timestamps
      t.datetime :expires_at, null: true
      t.bigint :status_id, null: false
      t.string :timeline_id, null: true
      t.integer :position, default: 10
    end
  end
end
