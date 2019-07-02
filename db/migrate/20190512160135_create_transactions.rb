class CreateTransactions < ActiveRecord::Migration[5.2]
  def change
    create_table :transactions do |t|
      t.timestamps
    	t.integer :account_id, null: false
    	t.column :payment_type, :string
    	t.string :provider_type, null: true
    	t.text :provider_response
    	t.integer :amount, null: false
    	t.boolean :success, null: false, default: false
    end
  end
end
