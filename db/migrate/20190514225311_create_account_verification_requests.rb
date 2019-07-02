class CreateAccountVerificationRequests < ActiveRecord::Migration[5.2]
  def change
    create_table :account_verification_requests do |t|
    	t.references :account
    	t.attachment :image
      
      t.timestamps
    end
  end
end
