class Settings::Billing::UpgradeController < Settings::BaseController
	include Authorization

	layout 'admin'
	before_action :init_client
	skip_before_action :verify_authenticity_token, only: [:btcpay_notification]

	def init_client
		@client = Btcpay::Client.new(
			api_uri: 'https://btcpay.gab.com',
			legacy_token: ENV['BTCPAY_LEGACY_TOKEN'],
			pub_key: ENV['BTCPAY_PUB_KEY'],
			client_id: ENV['BTCPAY_PUB_KEY'],
			tokens: { "merchant" => ENV['BTCPAY_MERCHANT_TOKEN'] })
	end

	def index
		authenticate_user!
		authorize current_account, :upgrade?

		order_id = SecureRandom.hex
		plan = params[:plan]
		item = get_purchase_item plan
		params = {
			orderId: order_id,
			notificationUrl: settings_billing_btcpay_notification_url,
			itemCode: item[:code],
			itemDesc: item[:desc],
			buyer: {email: current_user.email, name: "Gab Social ##{current_user.id}"}
		}

		# Create invoice
		invoice = @client.create_invoice(facade: 'merchant', price: item[:price], currency: 'USD', params: params)

		# Create BTCPayment record
		BtcPayment.create(account_id: current_account.id, btcpay_invoice_id: invoice['id'], plan: plan)

		# Redirect to BTCPay for payment
		redirect_to invoice['url']
	end

	def btcpay_notification
		id = params[:id]
		invoice = @client.get_invoice(id: id)

		# There are different statuses in BitPay protocol that indicates the payment has been done
		statuses_indicating_payment_confirmation = ['complete', 'complete (paidOver)', 'confirmed', 'confirmed (paidOver)', 'paid', 'paid (paidOver)']
		payment_confirmed = statuses_indicating_payment_confirmation.include? invoice['status']
		invoice_paid invoice if payment_confirmed

		render json: {'status': 'ok', 'invoice': invoice['id']}, status: 200
	end

	def invoice_paid(invoice)
		# Get btc payment record
		payment = BtcPayment.find_by(btcpay_invoice_id: invoice['id'], success: false)
		return if payment.nil?

		# Which plan was purchased?
		plan = get_purchase_item(payment.plan)

		# Mark account as pro
		account = payment.account
		account.is_pro = true
		account.pro_expires_at = (account.pro_expires_at || DateTime.now) + plan[:months].months
		account.save

		# Mark payment as successful
		payment.success = true
		payment.save

		# Create a transaction
		Transaction.create(account_id: current_account.id, amount: plan[:price].to_i * 100)
	end

	def get_purchase_item(plan)
		case plan
			when '6M'
				{code: 'PRO-6M', desc: 'PRO - 6 Months', price: '30.00', months: 6}
			when '1Y'
				{code: 'PRO-1Y', desc: 'PRO - 1 Year', price: '60.00', months: 12}
			when '5Y'
				{code: 'PRO-5Y', desc: 'PRO - 5 Years', price: '200.00', months: 60}
			else
				raise GabSocial::ValidationError.new 'Plan not selected.'
		end
	end
end
