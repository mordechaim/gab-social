class Settings::Billing::TransactionsController < Settings::BaseController
	include Authorization

	layout 'admin'
	before_action :authenticate_user!

	def index
		transaction = Transaction.new
		transaction.account_id = current_account.id
		transaction.amount = 5000
		transaction.payment_type = :pro_3_months
		transaction.provider_type = :btcpay
		#transaction.save

		@transactions = Transaction.where(account: current_account)
	end
end
